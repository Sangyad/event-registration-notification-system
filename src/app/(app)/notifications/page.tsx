import { getNotificationsAction } from "@/features/notifications/actions";
import { NotificationsFeed } from "@/features/notifications/components/NotificationsFeed";

export default async function NotificationsPage() {
  const notifications = await getNotificationsAction();
  return <NotificationsFeed initialNotifications={notifications} />;
}
