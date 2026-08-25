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

function collectRecipients(): string[] {
  const keys = ["RECIPIENT_EMAIL", "RECIPIENT_EMAIL2", "RECIPIENT_EMAIL3"] as const;
  const out: string[] = [];
  for (const key of keys) {
    const raw = process.env[key]?.trim();
    if (raw) out.push(raw);
  }
  return [...new Set(out)];
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
    const gmailPass = process.env["GMAIL_APP_PASSWORD"]?.trim();
    const sender = process.env["SENDER_EMAIL"]?.trim() || gmailUser;
    const recipients = collectRecipients();

    if (!gmailUser || !gmailPass) {
      throw new Error("Email is not configured (missing GMAIL_USER / GMAIL_APP_PASSWORD).");
    }
    if (!sender) {
      throw new Error("Email is not configured (missing SENDER_EMAIL).");
    }
    if (recipients.length === 0) {
      throw new Error("Email is not configured (missing RECIPIENT_EMAIL*).");
    }

    const subject = buildSubject(data.source, data.role);
    const text = buildBody(data);
    const replyTo = data.fields["email"]?.trim();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    try {
      await transporter.sendMail({
        from: sender,
        to: recipients.join(", "),
        subject,
        text,
        ...(replyTo ? { replyTo } : {}),
      });
    } catch (err) {
      console.error("[submitRegistration]", err);
      throw new Error(
        err instanceof Error ? err.message : "Failed to send registration email.",
      );
    }

    return { ok: true as const, subject };
  });
