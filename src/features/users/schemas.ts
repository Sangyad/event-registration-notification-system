import { z } from "zod";

import { Role } from "@/generated/prisma/browser";
import { emailText, optionalText } from "@/lib/validation/form-utils";

export const AssignableRoleSchema = z.enum([Role.STUDENT, Role.OFFICER, Role.ADMIN]);

const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/, "Invalid user identifier");
const clubIdSchema = z.string().regex(/^c[a-z0-9]{24}$/, "Invalid club identifier");

export const UserIdSchema = z.object({ userId: cuidSchema });

export const SetUserActiveSchema = UserIdSchema.extend({ isActive: z.boolean() });

export const UpdateUserRoleSchema = z.object({
  userId: cuidSchema,
  role: AssignableRoleSchema,
});

export const AddPendingUserSchema = z.object({
  email: emailText("Email").refine((value) => value.toLowerCase().endsWith("@acdeducation.com"), {
    message: "Email must end in @acdeducation.com",
  }),
  role: AssignableRoleSchema,
  clubId: clubIdSchema.nullable().default(null),
});

export const SetUserClubSchema = z.object({
  userId: cuidSchema,
  clubId: clubIdSchema.nullable(),
});

export const UserRoleFilterSchema = z.enum([Role.STUDENT, Role.OFFICER, Role.ADMIN, Role.DEV]);

export const UserStatusFilterSchema = z.enum(["active", "inactive", "pending"]);

export const UserManagementPageQuerySchema = z.object({
  search: optionalText(100, "Search", true),
  cursor: z.string().max(500).optional(),
  pageSize: z.number().int().min(1).max(50).optional(),
  filters: z
    .object({
      role: z.array(UserRoleFilterSchema).optional(),
      status: z.array(UserStatusFilterSchema).optional(),
    })
    .optional(),
});
