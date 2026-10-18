"use server";

import { getClubById } from "@/features/clubs/queries";
import { Role } from "@/generated/prisma/browser";
import { sendEmail } from "@/lib/messaging/email";
import {
  actionConflict,
  actionInvalid,
  actionNotFound,
  type ActionDataResponse,
  type ActionStatusResponse,
} from "@/lib/security/action-response";
import { requirePermission } from "@/lib/security/auth-guards";
import { toActionResponse } from "@/lib/security/errors";

import {
  deletePendingInvitation,
  setUserActive,
  setUserClub,
  updateUserRole,
  upsertPendingAssignment,
} from "./mutations";
import { countActivePrivilegedUsers, getUserById, getUserManagementRows } from "./queries";
import {
  AddPendingUserSchema,
  SetUserClubSchema,
  UpdateRoleSchema,
  UserActiveSchema,
  UserIdSchema,
  UserSearchSchema,
} from "./schemas";

export async function getUserManagementRowsAction(
  search: string,
): Promise<Awaited<ReturnType<typeof getUserManagementRows>>> {
  await requirePermission("user.read");
  const parsed = UserSearchSchema.safeParse({ search });
  return getUserManagementRows(parsed.success ? parsed.data.search : "");
}

export async function updateRoleAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("user.update");
    const parsed = UpdateRoleSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("user role");
    const target = await getUserById(parsed.data.userId);
    if (!target) return actionNotFound("User");
    if (target.role === Role.DEV)
      return actionConflict(
        "Developer account",
        "Developer accounts cannot be assigned through this form.",
      );
    if (target.role === Role.ADMIN && parsed.data.role !== Role.ADMIN) {
      const remaining = await countActivePrivilegedUsers(target.id);
      if (remaining === 0) {
        return actionConflict(
          "Last administrator",
          "Cannot remove the last active administrator. Assign another administrator or developer first.",
        );
      }
    }
    await updateUserRole(parsed.data.userId, parsed.data.role);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "update user role");
  }
}

export async function setActiveAction(
  payload: unknown,
): Promise<ActionDataResponse<{ selfDeactivated: boolean }>> {
  try {
    const session = await requirePermission("user.update");
    const parsed = UserActiveSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("user status");
    const target = await getUserById(parsed.data.userId);
    if (!target) return actionNotFound("User");
    if (!parsed.data.isActive && (target.role === Role.ADMIN || target.role === Role.DEV)) {
      const remaining = await countActivePrivilegedUsers(target.id);
      if (remaining === 0) {
        return actionConflict(
          "Last administrator",
          "Cannot deactivate the last active administrator or developer. Assign another administrator or developer first.",
        );
      }
    }
    await setUserActive(parsed.data.userId, parsed.data.isActive);
    return {
      success: true,
      data: { selfDeactivated: parsed.data.userId === session.id && !parsed.data.isActive },
    };
  } catch (error) {
    return toActionResponse(error, "update user status");
  }
}

export async function addPendingUserAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    const session = await requirePermission("user.create");
    const parsed = AddPendingUserSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("pending user");
    if (parsed.data.clubId) {
      const club = await getClubById(parsed.data.clubId);
      if (!club) return actionNotFound("Club");
    }
    const email = parsed.data.email.toLowerCase();
    await upsertPendingAssignment(email, parsed.data.role, session.id, parsed.data.clubId);
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

export async function setUserClubAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("user.update");
    const parsed = SetUserClubSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("club assignment");
    const target = await getUserById(parsed.data.userId);
    if (!target) return actionNotFound("User");
    if (parsed.data.clubId) {
      const club = await getClubById(parsed.data.clubId);
      if (!club) return actionNotFound("Club");
    }
    await setUserClub(parsed.data.userId, parsed.data.clubId);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "assign club");
  }
}

export async function cancelPendingInvitationAction(
  payload: unknown,
): Promise<ActionStatusResponse> {
  try {
    await requirePermission("user.delete");
    const parsed = UserIdSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("pending assignment");
    await deletePendingInvitation(parsed.data.userId);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "cancel pending assignment");
  }
}
