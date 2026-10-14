"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";

import styles from "./SignInForm.module.css";

export function SignInForm() {
  return (
    <div className={styles.form}>
      <Button
        className={styles.button}
        onPress={() => void signIn("google", { callbackUrl: "/notifications" })}
      >
        <FaGoogle aria-hidden="true" className={styles.icon} />
        Sign in with Google
      </Button>
    </div>
  );
}
