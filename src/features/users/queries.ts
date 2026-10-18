import { Role } from "@/generated/prisma/browser";
import { prisma } from "@/lib/infra/prisma";

export interface UserManagementRow {
  kind: "user" | "pending";
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isActive: boolean | null;
  clubId: string | null;
  clubName: string | null;
  clubShortName: string | null;
  createdAt: Date;
}

export async function getUserManagementRows(search = ""): Promise<UserManagementRow[]> {
  const normalizedSearch = search.trim();
  const users = await prisma.user.findMany({
    where: normalizedSearch
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" } },
            { email: { contains: normalizedSearch, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      clubId: true,
      club: { select: { name: true, shortName: true } },
    },
  });
  const pending = await prisma.pendingRoleAssignment.findMany({
    where: normalizedSearch
      ? { email: { contains: normalizedSearch, mode: "insensitive" } }
      : undefined,
    select: {
      id: true,
      email: true,
      role: true,
      assignedAt: true,
      clubId: true,
      club: { select: { name: true, shortName: true } },
    },
  });

  return [
    ...users.map((user) => ({
      kind: "user" as const,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      clubId: user.clubId,
      clubName: user.club?.name ?? null,
      clubShortName: user.club?.shortName ?? null,
      createdAt: user.createdAt,
    })),
    ...pending.map((assignment) => ({
      kind: "pending" as const,
      id: assignment.id,
      name: null,
      email: assignment.email,
      role: assignment.role,
      isActive: null,
      clubId: assignment.clubId,
      clubName: assignment.club?.name ?? null,
      clubShortName: assignment.club?.shortName ?? null,
      createdAt: assignment.assignedAt,
    })),
  ].sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true },
  });
}

export async function countActivePrivilegedUsers(excludeUserId?: string) {
  return prisma.user.count({
    where: {
      isActive: true,
      role: { in: [Role.ADMIN, Role.DEV] },
      ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
    },
  });
}
