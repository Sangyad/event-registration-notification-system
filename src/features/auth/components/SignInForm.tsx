"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/Button/Button";

export function SignInForm() {
  return (
    <div>
      <Button onPress={() => void signIn("google", { callbackUrl: "/dashboard" })}>
        Sign in with your school account
      </Button>
    </div>
  );
}
