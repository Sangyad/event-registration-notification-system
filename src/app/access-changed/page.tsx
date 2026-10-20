import { Link } from "@/components/ui/Link/Link";
import { NoticePage } from "@/components/ui/NoticePage/NoticePage";

interface AccessChangedPageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function AccessChangedPage({ searchParams }: AccessChangedPageProps) {
  const { reason } = await searchParams;
  const isRoleChange = reason === "role";

  const title = isRoleChange ? "Your access has changed" : "Access changed";
  const message = isRoleChange
    ? "Your role was updated, so the admin area is no longer available. Your permissions are now up to date."
    : "You don't have access to that area. If your role was recently updated, your permissions should now be up to date.";

  return (
    <NoticePage title={title} message={message}>
      <Link href="/notifications">Go to Notifications</Link>
    </NoticePage>
  );
}
