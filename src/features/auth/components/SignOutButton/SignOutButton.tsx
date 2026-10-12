"use client";

import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button/Button";

interface SignOutButtonProps {
  icon?: ReactNode;
}

export function SignOutButton({ icon }: SignOutButtonProps) {
  return (
    <Button variant="ghost" onPress={() => void signOut({ callbackUrl: "/sign-in" })}>
      {icon}
      Sign out
    </Button>
  );
}
