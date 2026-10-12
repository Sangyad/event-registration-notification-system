import type { NotificationAudience } from "@/generated/prisma/browser";
import { prisma } from "@/lib/infra/prisma";

export async function createNotification(payload: {
  title: string;
  body: string;
  audience: NotificationAudience;
  clubId: string | null;
  createdById: string;
}) {
  return prisma.notification.create({ data: payload });
}

export async function markNotificationRead(notificationId: string, userId: string): Promise<void> {
  await prisma.notificationRead.upsert({
    where: { notificationId_userId: { notificationId, userId } },
    update: { readAt: new Date() },
    create: { notificationId, userId },
  });
}
