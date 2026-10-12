"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/Button/Button";

export function SignOutButton() {
  return (
    <Button variant="ghost" onPress={() => void signOut({ callbackUrl: "/sign-in" })}>
      Sign out
    </Button>
  );
}
