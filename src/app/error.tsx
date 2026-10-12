"use client";

import { useEffect } from "react";

import { Link } from "@/components/ui/Link/Link";

import styles from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function Error({ error, unstable_retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.message}>{error.message}</p>
        <div className={styles.actions}>
          <Link onPress={unstable_retry}>Try again</Link>
          <Link href="/notifications">Go to Notifications</Link>
        </div>
      </div>
    </main>
  );
}
