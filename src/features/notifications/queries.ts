import { NotificationAudience } from "@/generated/prisma/browser";
import { prisma } from "@/lib/infra/prisma";

export interface NotificationRow {
  id: string;
  title: string;
  body: string;
  audience: NotificationAudience;
  clubName: string | null;
  createdAt: Date;
  isRead: boolean;
}

export async function getNotificationsForUser(
  userId: string,
  clubId: string | null,
): Promise<NotificationRow[]> {
  const rows = await prisma.notification.findMany({
    where: {
      OR: [
        { audience: NotificationAudience.ALL },
        ...(clubId ? [{ audience: NotificationAudience.CLUB, clubId }] : []),
      ],
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: {
      club: { select: { name: true } },
      reads: { where: { userId }, select: { id: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    audience: row.audience,
    clubName: row.club?.name ?? null,
    createdAt: row.createdAt,
    isRead: row.reads.length > 0,
  }));
}

export async function getUnreadNotificationsForUser(
  userId: string,
  clubId: string | null,
  limit = 10,
): Promise<NotificationRow[]> {
  const rows = await prisma.notification.findMany({
    where: {
      OR: [
        { audience: NotificationAudience.ALL },
        ...(clubId ? [{ audience: NotificationAudience.CLUB, clubId }] : []),
      ],
      reads: { none: { userId } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit,
    include: {
      club: { select: { name: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    audience: row.audience,
    clubName: row.club?.name ?? null,
    createdAt: row.createdAt,
    isRead: false,
  }));
}

export async function getUnreadNotificationCount(
  userId: string,
  clubId: string | null,
): Promise<number> {
  return prisma.notification.count({
    where: {
      OR: [
        { audience: NotificationAudience.ALL },
        ...(clubId ? [{ audience: NotificationAudience.CLUB, clubId }] : []),
      ],
      reads: { none: { userId } },
    },
  });
}

export async function getNotificationRecipients(
  audience: NotificationAudience,
  clubId: string | null,
) {
  return prisma.user.findMany({
    where: {
      isActive: true,
      email: { endsWith: "@acdeducation.com" },
      ...(audience === NotificationAudience.CLUB ? { clubId } : {}),
    },
    select: { email: true },
  });
}
