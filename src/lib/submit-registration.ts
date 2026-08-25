import { createServerFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";
import { z } from "zod";
import { NEXUS_SUBJECT, novaSubjectForRole } from "./form-codes";

const payloadSchema = z.object({
  source: z.enum(["nova", "nexus", "partner", "contact"]),
  role: z.string().optional(),
  fields: z.record(z.string(), z.string()),
});

export type RegistrationPayload = z.infer<typeof payloadSchema>;

/** Reads the same keys you already have on Vercel. */
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
    // Read per-request (required for serverless / Vercel)
    const gmailUser = process.env["GMAIL_USER"]?.trim();
    // App passwords are often copied with spaces — Gmail accepts either, normalize to none
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

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: sender,
        to: recipients.join(", "),
        subject,
        text,
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
