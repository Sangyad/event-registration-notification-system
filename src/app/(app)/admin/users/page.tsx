import { getUserManagementRowsAction } from "@/features/users/actions";
import { UsersManagement } from "@/features/users/components/UsersManagement/UsersManagement";

export default async function UsersPage() {
  const rows = await getUserManagementRowsAction("");
  return <UsersManagement initialRows={rows} />;
}
