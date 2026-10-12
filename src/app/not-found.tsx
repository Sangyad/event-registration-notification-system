import { Link } from "@/components/ui/Link/Link";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/notifications">Go to Notifications</Link>
      </div>
    </main>
  );
}
