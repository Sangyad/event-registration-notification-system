import { Suspense } from "react";

import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";

import { AuthErrorContent } from "./auth-error-content";
import styles from "./AuthErrorPage.module.css";

export default function AuthErrorPage() {
  return (
    <main className={styles.page}>
      <Suspense fallback={<ProgressCircle aria-label="Loading error details..." />}>
        <AuthErrorContent />
      </Suspense>
    </main>
  );
}
