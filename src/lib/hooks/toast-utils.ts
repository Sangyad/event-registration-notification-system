"use client";

/**
 * Shared toast helpers for surfacing Server Action results and app events.
 *
 * Every toast carries a title and a description - both are mandatory. These
 * helpers are the only sanctioned way for feature components to enqueue
 * toasts; ad-hoc `queue.add(...)` calls are banned to keep wording, timeout,
 * and title/description placement consistent across the app.
 *
 * @module lib/toast-utils
 */
import { queue } from "@/components/ui/Toast/Toast";

/** Minimal envelope for failed actions (mirrors law-firm action-response). */
export interface ActionStatusResponse {
  success: boolean;
  error?: {
    code: string;
    title: string;
    description: string;
  };
}

/** Standard display duration (ms) for all toasts. */
export const TOAST_TIMEOUT = 5000;

/**
 * Enqueues a success toast with a supporting description line.
 *
 * @param title - Short headline (e.g. `"Registration created"`).
 * @param description - Full-sentence confirmation of what happened.
 */
export function toastSuccess(title: string, description: string): void {
  queue.add({ title, description, variant: "success" }, { timeout: TOAST_TIMEOUT });
}

/**
 * Enqueues an informational toast with a supporting description line.
 *
 * @param title - Short headline.
 * @param description - Full-sentence context or guidance.
 */
export function toastInfo(title: string, description: string): void {
  queue.add({ title, description, variant: "info" }, { timeout: TOAST_TIMEOUT });
}

/**
 * Enqueues an error toast with a supporting description line. Use for
 * client-side failures that never reach a Server Action (network drops,
 * rejected uploads, etc.).
 *
 * @param title - Short headline (e.g. `"Registration failed"`).
 * @param description - Full-sentence explanation with a next step.
 */
export function toastError(title: string, description: string): void {
  queue.add({ title, description, variant: "error" }, { timeout: TOAST_TIMEOUT });
}

/**
 * Renders the structured error from a failed write action as a toast.
 *
 * When the envelope carries no error (e.g. the request threw before a
 * response arrived), a sanitized fallback built from `operation` is shown
 * instead.
 *
 * @param response - The failed action's envelope.
 * @param operation - Verb phrase describing the attempted operation
 *   (e.g. `"create registration"`, rendered as `"Failed to create registration"`).
 */
export function toastActionError(response: ActionStatusResponse, operation: string): void {
  const error = response.error ?? {
    code: "unknown",
    title: `Failed to ${operation}`,
    description: "Something went wrong on our end. Please try again.",
  };
  queue.add(
    {
      title: error.title,
      description: error.description,
      variant: error.code === "locked" ? "warning" : "error",
    },
    { timeout: TOAST_TIMEOUT },
  );
}

/**
 * Enqueues the standard access-denied toast for optimistic client-side
 * permission pre-checks. Enforcement always remains server-side; this only
 * mirrors the canonical denial copy.
 */
export function toastDenied(): void {
  queue.add(
    {
      title: "Access denied",
      description: "You don't have permission to perform this action.",
      variant: "error",
    },
    { timeout: TOAST_TIMEOUT },
  );
}

/**
 * Enqueues the standard not-found toast for records missing on the client.
 *
 * @param entity - Human-readable entity name (e.g. `"Event"`).
 */
export function toastNotFound(entity: string): void {
  queue.add(
    {
      title: `${entity} not found`,
      description: `The ${entity.toLowerCase()} may have been deleted by another user.`,
      variant: "error",
    },
    { timeout: TOAST_TIMEOUT },
  );
}
