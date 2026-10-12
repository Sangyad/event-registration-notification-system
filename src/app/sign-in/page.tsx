import Image from "next/image";
import { Suspense } from "react";

import { SignInForm } from "@/features/auth/components/SignInForm/SignInForm";

import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Image
          src="/school-logo.svg"
          alt="School logo"
          width={96}
          height={96}
          className={styles.brandMark}
          priority
        />
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
