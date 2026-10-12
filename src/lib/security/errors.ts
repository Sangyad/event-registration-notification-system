import {
  actionDeactivated,
  actionError,
  actionForbidden,
  actionUnauthorized,
  type ActionError,
  type ActionStatusResponse,
} from "@/lib/security/action-response";

export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}
export class DeactivatedError extends Error {}
export class NotFoundError extends Error {}

export function toActionResponse(error: unknown, operation: string): ActionStatusResponse {
  if (error instanceof DeactivatedError) return actionDeactivated();
  if (error instanceof UnauthorizedError) return actionUnauthorized();
  if (error instanceof ForbiddenError) return actionForbidden();
  if (error instanceof NotFoundError) {
    return actionError(
      "not_found",
      "Record not found",
      "The record may have been removed. Please refresh and try again.",
    );
  }

  console.error(`Failed to ${operation}`, error);
  const unknown: ActionError = {
    code: "unknown",
    title: `Failed to ${operation}`,
    description: "Something went wrong on our end. Please try again.",
  };
  return { success: false, error: unknown };
}
