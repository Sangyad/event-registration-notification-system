"use client";

import clsx from "clsx";
import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";

import styles from "./Button.module.css";

interface ButtonProps extends AriaButtonProps {
  variant?: "primary" | "secondary" | "navigation" | "ghost";
  title?: string;
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={clsx(styles.button, styles[variant], className)}
      data-variant={variant}
    >
      {composeRenderProps(children, (children, { isPending }) => (
        <>
          {!isPending && children}
          {isPending && <ProgressCircle aria-label="Loading..." />}
        </>
      ))}
    </AriaButton>
  );
}
