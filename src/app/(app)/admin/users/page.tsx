import { getUserManagementPageAction } from "@/features/users/actions";
import { UsersManagement } from "@/features/users/components/UsersManagement/UsersManagement";

export default async function UsersPage() {
  const page = await getUserManagementPageAction({ pageSize: 10 });
  return <UsersManagement initialRows={page.rows} initialCursor={page.nextCursor} />;
}
