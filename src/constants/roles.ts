export const SUPPORTED_ROLES = [
  "Super Admin",
  "Admin",
  "Supplier",
  "Customer",
  "Doctor",
  "MR",
] as const;

export type SupportedRole = (typeof SUPPORTED_ROLES)[number];

export function normalizeRole(role: string | string[] | undefined): SupportedRole | null {
  const roleValue = Array.isArray(role) ? role[0] : role;
  const normalizedRole = roleValue?.trim().toLowerCase().replace(/[\s_-]+/g, "");

  return (
    SUPPORTED_ROLES.find(
      (supportedRole) =>
        supportedRole.toLowerCase().replace(/\s+/g, "") === normalizedRole
    ) ?? null
  );
}
