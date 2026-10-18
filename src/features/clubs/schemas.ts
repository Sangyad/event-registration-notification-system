import { z } from "zod";

import { optionalText, requiredText } from "@/lib/validation/form-utils";

const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/, "Invalid club identifier");

export const ClubIdSchema = z.object({ clubId: cuidSchema });

export const ClubNameSchema = requiredText(100, "Club name");

export const ClubShortNameSchema = optionalText(20, "Short name").transform((value) =>
  value?.toUpperCase(),
);

export const CreateClubSchema = z.object({
  name: ClubNameSchema,
  shortName: ClubShortNameSchema,
});

export const UpdateClubSchema = CreateClubSchema.extend({ clubId: cuidSchema });

export type ClubFormPayload = z.input<typeof CreateClubSchema> & { clubId?: string };

export const ClubSearchSchema = z.object({
  search: requiredText(100, "Search").optional().default(""),
});
