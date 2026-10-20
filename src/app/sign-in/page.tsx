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
          width={100}
          height={100}
          className={styles.brandMark}
          priority
        />
        <p className={styles.title}>Event Registration &amp; Notification System</p>
        <h1 className={styles.greetings}>Welcome back!</h1>
        <p className={styles.description}>
          Sign in with your school or invited account to continue.
        </p>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
        <p className={styles.note}>Only @acdeducation.com accounts are accepted.</p>
      </section>
    </main>
  );
}
