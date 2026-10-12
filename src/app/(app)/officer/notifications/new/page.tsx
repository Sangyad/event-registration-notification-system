import { SendNotificationForm } from "@/features/notifications/components/SendNotificationForm";
import { getClubsAction } from "@/features/users/actions";

export default async function NewNotificationPage() {
  const clubs = await getClubsAction();
  return <SendNotificationForm clubs={clubs} />;
}
