import { getNotificationsAction } from "@/features/notifications/actions";
import { NotificationsFeed } from "@/features/notifications/components/NotificationsFeed/NotificationsFeed";
import { Role } from "@/generated/prisma/browser";
import { auth } from "@/lib/infra/auth";

export default async function NotificationsPage() {
  const [notifications, session] = await Promise.all([getNotificationsAction(), auth()]);
  const canCompose = session?.user?.role != null && session.user.role !== Role.STUDENT;
  return <NotificationsFeed initialNotifications={notifications} canCompose={canCompose} />;
}
