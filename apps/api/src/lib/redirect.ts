export type UserRole = "patient" | "doctor";

export function redirectForRole(role: UserRole): string {
  return role === "patient" ? "/appointments" : "/doctor/day";
}
