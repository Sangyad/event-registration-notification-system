import Link from "next/link";

import { getUnreadNotificationCountAction } from "@/features/notifications/actions";

import styles from "./page.module.css";

export default async function DashboardPage() {
  const unreadCount = await getUnreadNotificationCountAction();
  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Overview</p>
      <h1>Dashboard</h1>
      <section className={styles.card}>
        <p className={styles.count}>{unreadCount}</p>
        <div>
          <h2>Unread notifications</h2>
          <p>Stay up to date with announcements for you and your clubs.</p>
          <Link href="/notifications">View notifications</Link>
        </div>
      </section>
    </div>
  );
}
