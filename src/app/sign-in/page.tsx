import { Source_Serif_4 } from "next/font/google";
import Image from "next/image";

import { SignInForm } from "@/features/auth/components/SignInForm/SignInForm";
import { SCHOOL_EMAIL_DOMAINS_TEXT } from "@/lib/security/email-domain";

import styles from "./page.module.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-source-serif",
});

interface SignInPageProps {
  searchParams: Promise<{ error?: string | string[] }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;
  const emailRejected = (Array.isArray(error) ? error[0] : error) === "Domain";

  return (
    <main className={`${styles.page} ${sourceSerif.variable}`}>
      <div className={styles.layout}>
        <section className={styles.card}>
          <Image
            src="/school-logo.svg"
            alt="School logo"
            width={120}
            height={120}
            className={styles.brandMark}
            priority
          />
          <h1 className={styles.greetings}>
            Welcome to Event
            <br />
            Registration & Notification
          </h1>
          <p className={styles.description}>Sign in with your school Google account</p>
          <SignInForm emailRejected={emailRejected} />
          <p className={styles.note}>
            Only school accounts ({SCHOOL_EMAIL_DOMAINS_TEXT}) can sign in.
          </p>
        </section>
        <p className={styles.help}>
          Need access? Ask your club officer or the school administrator.
        </p>
      </div>
    </main>
  );
}
