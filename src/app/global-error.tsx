"use client";

import { useEffect } from "react";

import { Link } from "@/components/ui/Link/Link";

import styles from "./global-error.module.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className={styles.page}>
          <div className={styles.content}>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>A critical error occurred. Please try again.</p>
            <Link onPress={unstable_retry}>Try again</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
