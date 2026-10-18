import { Role } from "@/generated/prisma/browser";
import { Prisma } from "@/generated/prisma/client";
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

export type UserStatusFilter = "active" | "inactive" | "pending";

export interface UserManagementQuery {
  search?: string;
  role?: Role[];
  status?: UserStatusFilter[];
}

function buildUserSearchFilter(search: string): Prisma.UserWhereInput {
  return search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};
}

function buildPendingSearchFilter(search: string): Prisma.PendingRoleAssignmentWhereInput {
  return search ? { email: { contains: search, mode: "insensitive" } } : {};
}

export async function getUserManagementRows(
  query: UserManagementQuery = {},
): Promise<UserManagementRow[]> {
  const { search = "", role = [], status = [] } = query;
  const normalizedSearch = search.trim();
  const wantsActive = status.includes("active");
  const wantsInactive = status.includes("inactive");
  const wantsPending = status.includes("pending");
  const hasStatusFilter = status.length > 0;
  const includeUsers = !hasStatusFilter || wantsActive || wantsInactive;
  const includePending = !hasStatusFilter || wantsPending;

  const users = includeUsers
    ? await prisma.user.findMany({
        where: {
          ...buildUserSearchFilter(normalizedSearch),
          ...(role.length > 0 ? { role: { in: role } } : {}),
          ...(wantsActive !== wantsInactive ? { isActive: wantsActive } : {}),
        },
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
      })
    : [];
  const pending = includePending
    ? await prisma.pendingRoleAssignment.findMany({
        where: {
          ...buildPendingSearchFilter(normalizedSearch),
          ...(role.length > 0 ? { role: { in: role } } : {}),
        },
        select: {
          id: true,
          email: true,
          role: true,
          assignedAt: true,
          clubId: true,
          club: { select: { name: true, shortName: true } },
        },
      })
    : [];

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

export async function getUserById(
  userId: string,
): Promise<{ id: string; role: Role; isActive: boolean | null } | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true },
  });
}

export async function countActivePrivilegedUsers(excludeUserId?: string): Promise<number> {
  return prisma.user.count({
    where: {
      isActive: true,
      role: { in: [Role.ADMIN, Role.DEV] },
      ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
    },
  });
}
