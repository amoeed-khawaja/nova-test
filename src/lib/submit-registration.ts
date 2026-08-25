import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NEXUS_SUBJECT, novaSubjectForRole } from "./form-codes";

const payloadSchema = z.object({
  source: z.enum(["nova", "nexus", "partner", "contact"]),
  role: z.string().optional(),
  fields: z.record(z.string(), z.string()),
});

export type RegistrationPayload = z.infer<typeof payloadSchema>;

function collectRecipients(): string[] {
  const keys = ["RECIPIENT_EMAIL", "RECIPIENT_EMAIL2", "RECIPIENT_EMAIL3"] as const;
  const out: string[] = [];
  for (const key of keys) {
    const raw = process.env[key]?.trim();
    if (raw) out.push(raw);
  }
  return [...new Set(out)];
}

function envFlag(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function buildSubject(source: RegistrationPayload["source"], role?: string): string {
  if (source === "nexus") return NEXUS_SUBJECT;
  if (source === "nova") return novaSubjectForRole(role ?? "");
  if (source === "partner") return "NOVA REG · PRT";
  return "NOVA CONTACT";
}

function buildBody(data: RegistrationPayload): string {
  const lines = [
    `Source: ${data.source}`,
    data.role ? `Role: ${data.role}` : null,
    `Subject tag: ${buildSubject(data.source, data.role)}`,
    "",
    "— Submission —",
    ...Object.entries(data.fields).map(([k, v]) => `${k}: ${v}`),
    "",
    `Received at: ${new Date().toISOString()}`,
  ].filter((x): x is string => x != null);
  return lines.join("\n");
}

export const submitRegistration = createServerFn({ method: "POST" })
  .validator(payloadSchema)
  .handler(async ({ data }) => {
    const gmailUser = process.env["GMAIL_USER"]?.trim();
    const gmailPass = process.env["GMAIL_APP_PASSWORD"]?.replace(/\s+/g, "")?.trim();
    const sender = process.env["SENDER_EMAIL"]?.trim() || gmailUser;
    const recipients = collectRecipients();

    console.info("[submitRegistration] env check", {
      GMAIL_USER: envFlag("GMAIL_USER"),
      GMAIL_APP_PASSWORD: envFlag("GMAIL_APP_PASSWORD"),
      SENDER_EMAIL: envFlag("SENDER_EMAIL"),
      RECIPIENT_EMAIL: envFlag("RECIPIENT_EMAIL"),
      RECIPIENT_EMAIL2: envFlag("RECIPIENT_EMAIL2"),
      RECIPIENT_EMAIL3: envFlag("RECIPIENT_EMAIL3"),
      recipientCount: recipients.length,
    });

    if (!gmailUser || !gmailPass) {
      throw new Error(
        "Email is not configured on the server (missing GMAIL_USER or GMAIL_APP_PASSWORD). Redeploy after setting Vercel env vars.",
      );
    }
    if (!sender) {
      throw new Error("Email is not configured (missing SENDER_EMAIL).");
    }
    if (recipients.length === 0) {
      throw new Error(
        "Email is not configured (missing RECIPIENT_EMAIL / RECIPIENT_EMAIL2 / RECIPIENT_EMAIL3).",
      );
    }

    const subject = buildSubject(data.source, data.role);
    const text = buildBody(data);
    const replyTo = data.fields["email"]?.trim();

    // Dynamic import keeps nodemailer off the client bundle (prevents site crash).
    const { sendGmailMail } = await import("./send-mail.server");

    try {
      const info = await sendGmailMail({
        from: sender,
        to: recipients,
        subject,
        text,
        user: gmailUser,
        pass: gmailPass,
        ...(replyTo ? { replyTo } : {}),
      });
      console.info("[submitRegistration] sent", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        subject,
        toCount: recipients.length,
      });
    } catch (err) {
      console.error("[submitRegistration] send failed", err);
      const detail = err instanceof Error ? err.message : "Failed to send registration email.";
      throw new Error(detail);
    }

    return { ok: true as const, subject };
  });
