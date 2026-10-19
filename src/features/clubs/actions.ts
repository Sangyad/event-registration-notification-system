"use server";

import type { PageQuery } from "@/lib/primitives/types";
import {
  actionConflict,
  actionInvalid,
  actionNotFound,
  type ActionStatusResponse,
} from "@/lib/security/action-response";
import { requirePermission } from "@/lib/security/auth-guards";
import { toActionResponse } from "@/lib/security/errors";

import { createClub, deleteClub, updateClub } from "./mutations";
import {
  findClubsByName,
  findClubsByShortName,
  getClubById,
  getClubOptions,
  getClubPage,
  getClubUsage,
  type ClubOption,
  type ClubPage,
} from "./queries";
import { ClubIdSchema, ClubPageQuerySchema, CreateClubSchema, UpdateClubSchema } from "./schemas";

async function findClubConflict(name: string, shortName: string | null, excludeClubId?: string) {
  const nameMatch = (await findClubsByName(name, excludeClubId))[0];
  if (nameMatch) {
    return actionConflict(
      "Club already exists",
      `A club named "${nameMatch.name}" already exists.`,
    );
  }
  if (shortName) {
    const shortNameMatch = (await findClubsByShortName(shortName, excludeClubId))[0];
    if (shortNameMatch) {
      return actionConflict(
        "Short name already in use",
        `The short name "${shortNameMatch.shortName}" is already used by another club.`,
      );
    }
  }
  return null;
}

export async function getClubOptionsAction(): Promise<ClubOption[]> {
  await requirePermission("notification.create", "user.update");
  return getClubOptions();
}

export async function getClubPageAction(query: PageQuery): Promise<ClubPage> {
  await requirePermission("club.read");
  const parsed = ClubPageQuerySchema.safeParse(query);
  if (!parsed.success) throw new Error("Invalid query parameters");
  return getClubPage({
    search: parsed.data.search,
    cursor: parsed.data.cursor,
    pageSize: parsed.data.pageSize,
  });
}

export async function createClubAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("club.create");
    const parsed = CreateClubSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("club");
    const conflict = await findClubConflict(parsed.data.name, parsed.data.shortName ?? null);
    if (conflict) return conflict;
    await createClub({ name: parsed.data.name, shortName: parsed.data.shortName ?? null });
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "create club");
  }
}

export async function updateClubAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("club.update");
    const parsed = UpdateClubSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("club");
    const existing = await getClubById(parsed.data.clubId);
    if (!existing) return actionNotFound("Club");
    const conflict = await findClubConflict(
      parsed.data.name,
      parsed.data.shortName ?? null,
      parsed.data.clubId,
    );
    if (conflict) return conflict;
    await updateClub({
      clubId: parsed.data.clubId,
      name: parsed.data.name,
      shortName: parsed.data.shortName ?? null,
    });
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "update club");
  }
}

export async function deleteClubAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    await requirePermission("club.delete");
    const parsed = ClubIdSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("club");
    const usage = await getClubUsage(parsed.data.clubId);
    if (!usage) return actionNotFound("Club");
    if (usage.memberCount + usage.eventCount + usage.notificationCount > 0) {
      return actionConflict(
        "Club in use",
        "Reassign its members and clear related records before deleting this club.",
      );
    }
    await deleteClub(parsed.data.clubId);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "delete club");
  }
}
