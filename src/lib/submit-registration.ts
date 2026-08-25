import type { RegistrationPayload } from "./registration-mail";

/** Client helper — posts to the server route (no createServerFn / no nodemailer). */
export async function submitRegistration(payload: RegistrationPayload): Promise<{ subject: string }> {
  const res = await fetch("/api/submit-registration", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: { ok?: boolean; subject?: string; error?: string } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    // ignore JSON parse errors; fall through to status text
  }

  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Registration failed (${res.status}).`);
  }

  return { subject: data.subject ?? "" };
}
