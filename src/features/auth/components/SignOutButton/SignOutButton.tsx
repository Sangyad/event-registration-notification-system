"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { FaRightFromBracket } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { Tooltip, TooltipTrigger } from "@/components/ui/Tooltip/Tooltip";

import styles from "./SignOutButton.module.css";

export function SignOutButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipTrigger>
        <Button variant="ghost" aria-label="Sign out" onPress={() => setIsOpen(true)}>
          <FaRightFromBracket className={styles.icon} />
        </Button>
        <Tooltip>Sign out</Tooltip>
      </TooltipTrigger>
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Sign Out"
        confirmLabel="Sign Out"
        onConfirm={() => signOut({ callbackUrl: "/sign-in" })}
      >
        Are you sure you want to sign out?
      </ConfirmDialog>
    </>
  );
}
