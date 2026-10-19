import { getClubPageAction } from "@/features/clubs/actions";
import { ClubsManagement } from "@/features/clubs/components/ClubsManagement/ClubsManagement";

export default async function ClubsPage() {
  const page = await getClubPageAction({ pageSize: 10 });
  return <ClubsManagement initialRows={page.rows} initialCursor={page.nextCursor} />;
}
