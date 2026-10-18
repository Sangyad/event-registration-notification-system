import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/infra/prisma";

export interface ClubOption {
  id: string;
  name: string;
  shortName: string | null;
}

export interface ClubRow extends ClubOption {
  createdAt: Date;
  memberCount: number;
  eventCount: number;
  notificationCount: number;
}

export interface ClubUsage {
  memberCount: number;
  eventCount: number;
  notificationCount: number;
}

export interface ClubManagementQuery {
  search?: string;
}

function buildClubSearchFilter(search: string): Prisma.ClubWhereInput {
  return search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { shortName: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};
}

export async function getClubOptions(): Promise<ClubOption[]> {
  return prisma.club.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, shortName: true },
  });
}

export async function getClubRows(query: ClubManagementQuery = {}): Promise<ClubRow[]> {
  const { search = "" } = query;
  const clubs = await prisma.club.findMany({
    where: buildClubSearchFilter(search.trim()),
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      shortName: true,
      createdAt: true,
      _count: { select: { members: true, events: true, notifications: true } },
    },
  });

  return clubs.map((club) => ({
    id: club.id,
    name: club.name,
    shortName: club.shortName,
    createdAt: club.createdAt,
    memberCount: club._count.members,
    eventCount: club._count.events,
    notificationCount: club._count.notifications,
  }));
}

export async function getClubById(clubId: string): Promise<ClubOption | null> {
  return prisma.club.findUnique({
    where: { id: clubId },
    select: { id: true, name: true, shortName: true },
  });
}

export async function getClubUsage(clubId: string): Promise<ClubUsage | null> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: {
      _count: { select: { members: true, events: true, notifications: true } },
    },
  });
  if (!club) return null;
  return {
    memberCount: club._count.members,
    eventCount: club._count.events,
    notificationCount: club._count.notifications,
  };
}

export async function findClubsByName(name: string, excludeClubId?: string) {
  return prisma.club.findMany({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(excludeClubId ? { id: { not: excludeClubId } } : {}),
    },
    select: { id: true, name: true },
  });
}

export async function findClubsByShortName(shortName: string, excludeClubId?: string) {
  return prisma.club.findMany({
    where: {
      shortName: { equals: shortName, mode: "insensitive" },
      ...(excludeClubId ? { id: { not: excludeClubId } } : {}),
    },
    select: { id: true, shortName: true },
  });
}
