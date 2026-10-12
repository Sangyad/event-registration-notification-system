"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button/Button";

import styles from "./SignInForm.module.css";

export function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message =
    error === "Domain"
      ? "Use your @acdeducation.com account to sign in."
      : error === "Deactivated"
        ? "Your account has been deactivated. Please contact an administrator."
        : null;

  return (
    <div className={styles.form}>
      {message && (
        <p className={styles.error} role="alert">
          {message}
        </p>
      )}
      <Button onPress={() => void signIn("google", { callbackUrl: "/dashboard" })}>
        Sign in with your school account
      </Button>
      <p className={styles.note}>Only @acdeducation.com accounts are accepted.</p>
    </div>
  );
}
