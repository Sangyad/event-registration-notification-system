"use client";

import clsx from "clsx";
import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components";

import styles from "./ProgressCircle.module.css";

interface ProgressCircleProps extends Omit<
  AriaProgressBarProps,
  "children" | "isIndeterminate" | "value" | "minValue" | "maxValue"
> {
  className?: string;
}

export function ProgressCircle({ className, ...props }: ProgressCircleProps) {
  return (
    <AriaProgressBar {...props} isIndeterminate className={clsx(styles.circle, className)}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" strokeWidth="4" className={styles.track} />
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"
          strokeLinecap="round"
          className={styles.arc}
        />
      </svg>
    </AriaProgressBar>
  );
}
