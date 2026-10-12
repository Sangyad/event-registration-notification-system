"use server";

import { Role } from "@/generated/prisma/browser";
import { sendEmail } from "@/lib/messaging/email";
import {
  actionConflict,
  actionInvalid,
  actionNotFound,
  type ActionStatusResponse,
} from "@/lib/security/action-response";
import { requirePermission } from "@/lib/security/auth-guards";
import { toActionResponse } from "@/lib/security/errors";

import {
  deletePendingAssignment,
  setUserActive,
  updateUserRole,
  upsertPendingAssignment,
} from "./mutations";
import { getClubs, getUserById, getUserManagementRows } from "./queries";
import {
  AddPendingUserSchema,
  UpdateRoleSchema,
  UserActiveSchema,
  UserIdSchema,
  UserSearchSchema,
} from "./schemas";

export async function getUserManagementRowsAction(
  search: string,
): Promise<Awaited<ReturnType<typeof getUserManagementRows>>> {
  await requirePermission("manageUsers");
  const parsed = UserSearchSchema.safeParse({ search });
  return getUserManagementRows(parsed.success ? parsed.data.search : "");
}

export async function getClubsAction(): Promise<Awaited<ReturnType<typeof getClubs>>> {
  await requirePermission("sendNotifications");
  return getClubs();
}

export async function updateRoleAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("manageUsers");
    const parsed = UpdateRoleSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("user role");
    const target = await getUserById(parsed.data.userId);
    if (!target) return actionNotFound("User");
    if (target.role === Role.DEV)
      return actionConflict(
        "Developer account",
        "Developer accounts cannot be assigned through this form.",
      );
    await updateUserRole(parsed.data.userId, parsed.data.role);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "update user role");
  }
}

export async function setActiveAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("manageUsers");
    const parsed = UserActiveSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("user status");
    await setUserActive(parsed.data.userId, parsed.data.isActive);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "update user status");
  }
}

export async function addPendingUserAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    const session = await requirePermission("manageUsers");
    const parsed = AddPendingUserSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("pending user");
    const email = parsed.data.email.toLowerCase();
    await upsertPendingAssignment(email, parsed.data.role, session.id);
    await sendEmail({
      to: email,
      subject: "You have been added to ERNS",
      html: `<p>You have been added as <strong>${parsed.data.role}</strong>.</p><p>Sign in with your school account to get started.</p>`,
    });
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "add user");
  }
}

export async function cancelPendingUserAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("manageUsers");
    const parsed = UserIdSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("pending assignment");
    await deletePendingAssignment(parsed.data.userId);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "cancel pending assignment");
  }
}
