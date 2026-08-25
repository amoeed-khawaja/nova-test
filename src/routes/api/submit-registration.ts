import { createFileRoute } from "@tanstack/react-router";
import {
  buildBody,
  buildSubject,
  collectRecipients,
  envFlag,
  parseRegistrationPayload,
} from "@/lib/registration-mail";

export const Route = createFileRoute("/api/submit-registration")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload;
        try {
          payload = parseRegistrationPayload(await request.json());
        } catch (err) {
          const message = err instanceof Error ? err.message : "Invalid request.";
          return Response.json({ ok: false, error: message }, { status: 400 });
        }

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
          return Response.json(
            {
              ok: false,
              error:
                "Email is not configured on the server (missing GMAIL_USER or GMAIL_APP_PASSWORD).",
            },
            { status: 503 },
          );
        }
        if (!sender) {
          return Response.json(
            { ok: false, error: "Email is not configured (missing SENDER_EMAIL)." },
            { status: 503 },
          );
        }
        if (recipients.length === 0) {
          return Response.json(
            {
              ok: false,
              error:
                "Email is not configured (missing RECIPIENT_EMAIL / RECIPIENT_EMAIL2 / RECIPIENT_EMAIL3).",
            },
            { status: 503 },
          );
        }

        const subject = buildSubject(payload.source, payload.role);
        const text = buildBody(payload);
        const replyTo = payload.fields["email"]?.trim();

        try {
          // Dynamic import keeps nodemailer out of the page SSR graph.
          const { sendGmailMail } = await import("../../lib/send-mail.server");
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
          return Response.json({ ok: true, subject });
        } catch (err) {
          console.error("[submitRegistration] send failed", err);
          const detail =
            err instanceof Error ? err.message : "Failed to send registration email.";
          return Response.json({ ok: false, error: detail }, { status: 502 });
        }
      },
    },
  },
});
