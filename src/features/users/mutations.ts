import type { Role } from "@/generated/prisma/browser";
import { prisma } from "@/lib/infra/prisma";

export function getAuthAdapterClient(): typeof prisma {
  return prisma;
}

export async function ensureDeveloperUser(email: string): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return;

  try {
    await prisma.user.create({
      data: { email, name: "Developer Account", role: "DEV" },
    });
  } catch (error) {
    const concurrentUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!concurrentUser) throw error;
  }
}

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
