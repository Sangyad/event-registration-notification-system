import { Role } from "@/generated/prisma/browser";

export type Permission = "manageUsers" | "manageClubs" | "sendNotifications";

export function can(role: Role, permission: Permission): boolean {
  if (permission === "manageUsers" || permission === "manageClubs") {
    return role === Role.ADMIN || role === Role.DEV;
  }
  return role === Role.OFFICER || role === Role.ADMIN || role === Role.DEV;
}
