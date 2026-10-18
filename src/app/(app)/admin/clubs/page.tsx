import { getClubRowsAction } from "@/features/clubs/actions";
import { ClubsManagement } from "@/features/clubs/components/ClubsManagement/ClubsManagement";

export default async function ClubsPage() {
  const rows = await getClubRowsAction("");
  return <ClubsManagement initialRows={rows} />;
}
