import type { Role } from "@/generated/prisma/browser";
import { prisma } from "@/lib/infra/prisma";

export async function updateUserRole(userId: string, role: Role): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function setUserActive(userId: string, isActive: boolean): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { isActive } });
}

export async function upsertPendingAssignment(
  email: string,
  role: Role,
  assignedById: string,
): Promise<void> {
  await prisma.pendingRoleAssignment.upsert({
    where: { email },
    update: { role, assignedById, assignedAt: new Date() },
    create: { email, role, assignedById },
  });
}

export async function deletePendingAssignment(id: string): Promise<void> {
  await prisma.pendingRoleAssignment.delete({ where: { id } });
}
