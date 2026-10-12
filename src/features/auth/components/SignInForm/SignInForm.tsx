"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/Button/Button";

import styles from "./SignInForm.module.css";

export function SignInForm() {
  return (
    <div className={styles.form}>
      <Button
        className={styles.button}
        onPress={() => void signIn("google", { callbackUrl: "/dashboard" })}
      >
        Sign in with your school account
      </Button>
      <p className={styles.note}>Only @acdeducation.com accounts are accepted.</p>
    </div>
  );
}
