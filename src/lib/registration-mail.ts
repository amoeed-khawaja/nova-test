import { NEXUS_SUBJECT, novaSubjectForRole } from "./form-codes";

export type RegistrationSource = "nova" | "nexus" | "partner" | "contact";

export type RegistrationPayload = {
  source: RegistrationSource;
  role?: string;
  fields: Record<string, string>;
};

const SOURCES = new Set<RegistrationSource>(["nova", "nexus", "partner", "contact"]);

export function collectRecipients(): string[] {
  const keys = ["RECIPIENT_EMAIL", "RECIPIENT_EMAIL2", "RECIPIENT_EMAIL3"] as const;
  const out: string[] = [];
  for (const key of keys) {
    const raw = process.env[key]?.trim();
    if (raw) out.push(raw);
  }
  return [...new Set(out)];
}

export function envFlag(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export function buildSubject(source: RegistrationSource, role?: string): string {
  if (source === "nexus") return NEXUS_SUBJECT;
  if (source === "nova") return novaSubjectForRole(role ?? "");
  if (source === "partner") return "NOVA REG · PRT";
  return "NOVA CONTACT";
}

export function buildBody(data: RegistrationPayload): string {
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

export function parseRegistrationPayload(raw: unknown): RegistrationPayload {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid registration payload.");
  }
  const body = raw as Record<string, unknown>;
  const source = body.source;
  if (typeof source !== "string" || !SOURCES.has(source as RegistrationSource)) {
    throw new Error("Invalid registration source.");
  }
  const role = body.role;
  if (role != null && typeof role !== "string") {
    throw new Error("Invalid registration role.");
  }
  const fields = body.fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new Error("Invalid registration fields.");
  }
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields as Record<string, unknown>)) {
    if (typeof value !== "string") {
      throw new Error(`Invalid field value for ${key}.`);
    }
    normalized[key] = value;
  }
  return {
    source: source as RegistrationSource,
    ...(typeof role === "string" ? { role } : {}),
    fields: normalized,
  };
}
