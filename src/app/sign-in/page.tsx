import { Suspense } from "react";

import { SignInForm } from "@/features/auth/components/SignInForm/SignInForm";

import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brandMark}>ERNS</div>
        <p className={styles.eyebrow}>Event Registration &amp; Notification System</p>
        <h1>Welcome back</h1>
        <p className={styles.description}>Sign in with your school account to continue.</p>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </section>
    </main>
  );
}
