import Link from "next/link";
import { redirect } from "next/navigation";
import { FaBell, FaHouse, FaPaperPlane, FaRightFromBracket, FaUsers } from "react-icons/fa6";

import { ToastRegion } from "@/components/ui/Toast/Toast";
import { SignOutButton } from "@/features/auth/components/SignOutButton/SignOutButton";
import { Role } from "@/generated/prisma/browser";
import { auth } from "@/lib/auth";

import styles from "./layout.module.css";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const canSend = session.user.role !== Role.STUDENT;
  const canManage = session.user.role === Role.ADMIN || session.user.role === Role.DEV;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.logo}>
          ERNS
        </Link>
        <div className={styles.account}>
          <span>{session.user.name}</span>
          <span className={styles.role}>{session.user.role}</span>
          <SignOutButton icon={<FaRightFromBracket aria-hidden="true" />} />
        </div>
      </header>
      <div className={styles.body}>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/dashboard">
            <FaHouse aria-hidden="true" />
            Dashboard
          </Link>
          <Link href="/notifications">
            <FaBell aria-hidden="true" />
            Notifications
          </Link>
          {canSend && (
            <Link href="/officer/notifications/new">
              <FaPaperPlane aria-hidden="true" />
              Send notification
            </Link>
          )}
          {canManage && (
            <Link href="/admin/users">
              <FaUsers aria-hidden="true" />
              Manage users
            </Link>
          )}
        </nav>
        <main className={styles.content}>{children}</main>
      </div>
      <ToastRegion />
    </div>
  );
}
