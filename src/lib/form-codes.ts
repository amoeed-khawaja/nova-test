/** Shared NOVA registration role codes for email subjects. */

export const NOVA_ROLE_CODES = {
  student: "STU",
  university: "UNI",
  partner: "PRT",
  sponsor: "SPN",
  instructor: "INS",
  judge: "JDG",
  speaker: "SPK",
  media: "MED",
  mentor: "MNT",
} as const;

export type NovaRole = keyof typeof NOVA_ROLE_CODES;

export function novaSubjectForRole(role: string): string {
  const code = NOVA_ROLE_CODES[role as NovaRole];
  return code ? `NOVA REG · ${code}` : "NOVA REG";
}

export const FELLOWSHIP_SUBJECT = "NOVA-FELLOWSHIP REG";
