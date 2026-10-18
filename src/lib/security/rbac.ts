/**
 * Centralized RBAC policy for the application.
 *
 * This module mirrors `documentation/RBAC.md` - the permission matrix is the
 * single source of truth for what each role may do. When a policy change is
 * requested, edit the affected cell in {@link PERMISSION_MATRIX} here and in
 * the documentation together; every layer (Server Actions, client UI, sidebar
 * nav) reads this same object.
 *
 * The module is pure and client-safe: it imports only the Prisma `Role` type
 * from the `browser` entry, so it can be imported from `"use client"`
 * components and Server Actions alike.
 */

import type { Role } from "@/generated/prisma/browser";

/** Shared user-facing message for denied actions. */
export const FORBIDDEN_MESSAGE = "You don't have permission to perform this action.";

/**
 * Granular action a role may or may not perform, named `entity.action`.
 *
 * Only capabilities that are actually implemented are listed; new rows are
 * added here and in `documentation/RBAC.md` as their features land.
 */
export type Permission =
  | "user.read"
  | "user.create"
  | "user.update"
  | "user.delete"
  | "club.read"
  | "club.create"
  | "club.update"
  | "club.delete"
  | "notification.create"
  | "notification.read_all";

/**
 * Qualifier set for one matrix row, keyed by the four application roles.
 *
 * `DEV` is a bootstrap superuser and is never part of the documented table,
 * so it is pinned to `true` for every row.
 */
interface RoleCells {
  admin: boolean;
  officer: boolean;
  student: boolean;
}

/**
 * Builds a matrix row for the standard roles, pinning `DEV` to allowed.
 *
 * @param cells - Allowed flag per standard role for the row.
 * @returns A full `Role` → boolean row for the matrix.
 */
const cells = ({ admin, officer, student }: RoleCells): Record<Role, boolean> => ({
  DEV: true,
  ADMIN: admin,
  OFFICER: officer,
  STUDENT: student,
});

/**
 * The RBAC matrix, transcribed cell-for-cell from the tables in
 * `documentation/RBAC.md`. Edit a cell here and in the doc together.
 */
export const PERMISSION_MATRIX: Record<Permission, Record<Role, boolean>> = {
  "user.read": cells({ admin: true, officer: false, student: false }),
  "user.create": cells({ admin: true, officer: false, student: false }),
  "user.update": cells({ admin: true, officer: false, student: false }),
  "user.delete": cells({ admin: true, officer: false, student: false }),

  "club.read": cells({ admin: true, officer: false, student: false }),
  "club.create": cells({ admin: true, officer: false, student: false }),
  "club.update": cells({ admin: true, officer: false, student: false }),
  "club.delete": cells({ admin: true, officer: false, student: false }),

  "notification.create": cells({ admin: true, officer: true, student: false }),
  "notification.read_all": cells({ admin: true, officer: false, student: false }),
};

/**
 * Evaluates whether a role may perform a permission.
 *
 * Returns `false` for `null`/`undefined` roles, or for role values not present
 * in the {@link Role} enum (unrecognized roles deny permission).
 *
 * @param role - The user's role (nullable, as it comes from the session).
 * @param permission - The granular action to evaluate.
 * @returns `true` when the role is permitted.
 */
export function can(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return PERMISSION_MATRIX[permission]?.[role] ?? false;
}
