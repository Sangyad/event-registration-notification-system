"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBan, FaPencil, FaPeopleGroup, FaUserCheck } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { ListToolbar } from "@/components/ui/ListToolbar/ListToolbar";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import type { FilterDefinition } from "@/components/ui/TableFilter/TableFilter";
import { Tooltip, TooltipTrigger } from "@/components/ui/Tooltip/Tooltip";
import { ClubLabel } from "@/features/clubs/components/ClubLabel/ClubLabel";
import {
  cancelPendingInvitationAction,
  getUserManagementRowsAction,
  setActiveAction,
} from "@/features/users/actions";
import { AddUserModal } from "@/features/users/components/AddUserModal/AddUserModal";
import { AssignClubModal } from "@/features/users/components/AssignClubModal/AssignClubModal";
import { EditRoleModal } from "@/features/users/components/EditRoleModal/EditRoleModal";
import { roleLabels } from "@/features/users/constants";
import type { UserManagementRow } from "@/features/users/queries";
import { Role } from "@/generated/prisma/browser";
import { toastActionError, toastError, toastSuccess } from "@/lib/hooks/toast-utils";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { FilterValues } from "@/lib/primitives/types";

import styles from "./UsersManagement.module.css";

interface UsersManagementProps {
  initialRows: UserManagementRow[];
}

const roles = [Role.STUDENT, Role.OFFICER, Role.ADMIN];
type AssignableRole = (typeof roles)[number];

const userFilters: FilterDefinition[] = [
  {
    key: "role",
    label: "Role",
    options: Object.values(Role).map((role) => ({ value: role, label: roleLabels[role] })),
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
];

export function UsersManagement({ initialRows }: UsersManagementProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [roleRow, setRoleRow] = useState<UserManagementRow | null>(null);
  const [clubRow, setClubRow] = useState<UserManagementRow | null>(null);
  const [statusRow, setStatusRow] = useState<UserManagementRow | null>(null);
  const [invitationRow, setInvitationRow] = useState<UserManagementRow | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const skipInitialFetch = useRef(true);

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const result = await getUserManagementRowsAction({ search: debouncedSearch, filters });
        if (!cancelled) setRows(result);
      } catch {
        if (!cancelled) {
          toastError(
            "Failed to refresh users",
            "We couldn't retrieve the user list. Please try again.",
          );
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, filters, refreshTrigger]);

  const refresh = () => setRefreshTrigger((trigger) => trigger + 1);

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Administration</p>
          <h1>Manage users</h1>
        </div>
        <Button onPress={() => setAddOpen(true)}>+ Add user</Button>
      </div>
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        searchLabel="Search users"
        filters={userFilters}
        filterValues={filters}
        onFiltersChange={setFilters}
      />
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Club</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.kind}-${row.id}`}
                className={row.kind === "pending" ? styles.pending : undefined}
              >
                <td>{row.name ?? "—"}</td>
                <td>{row.email}</td>
                <td>{roleLabels[row.role]}</td>
                <td>
                  {row.clubName ? (
                    <ClubLabel name={row.clubName} shortName={row.clubShortName} />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {row.kind === "pending" ? (
                    <StatusBadge variant="pending">Pending</StatusBadge>
                  ) : row.isActive ? (
                    <StatusBadge variant="done">Active</StatusBadge>
                  ) : (
                    <StatusBadge variant="danger">Inactive</StatusBadge>
                  )}
                </td>
                <td className={styles.actions}>
                  {row.kind === "pending" ? (
                    <Button variant="ghost" onPress={() => setInvitationRow(row)}>
                      Cancel invitation
                    </Button>
                  ) : (
                    <>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          aria-label="Edit role"
                          isDisabled={row.role === Role.DEV}
                          onPress={() => setRoleRow(row)}
                        >
                          <FaPencil aria-hidden="true" className={styles.actionIcon} />
                        </Button>
                        <Tooltip>
                          {row.role === Role.DEV ? "Developer role cannot be edited" : "Edit role"}
                        </Tooltip>
                      </TooltipTrigger>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          aria-label="Assign club"
                          onPress={() => setClubRow(row)}
                        >
                          <FaPeopleGroup aria-hidden="true" className={styles.actionIcon} />
                        </Button>
                        <Tooltip>Assign club</Tooltip>
                      </TooltipTrigger>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          aria-label={row.isActive ? "Deactivate user" : "Reactivate user"}
                          onPress={() => setStatusRow(row)}
                        >
                          {row.isActive ? (
                            <FaBan aria-hidden="true" className={styles.actionIcon} />
                          ) : (
                            <FaUserCheck aria-hidden="true" className={styles.actionIcon} />
                          )}
                        </Button>
                        <Tooltip>{row.isActive ? "Deactivate" : "Reactivate"}</Tooltip>
                      </TooltipTrigger>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No users match the current search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddUserModal isOpen={addOpen} onOpenChange={setAddOpen} onSuccess={refresh} />
      {clubRow && clubRow.kind === "user" && (
        <AssignClubModal
          key={clubRow.id}
          userId={clubRow.id}
          userLabel={clubRow.name ?? clubRow.email}
          initialClubId={clubRow.clubId}
          isOpen
          onOpenChange={(open) => {
            if (!open) setClubRow(null);
          }}
          onSuccess={refresh}
        />
      )}
      {roleRow && roles.includes(roleRow.role as AssignableRole) && (
        <EditRoleModal
          userId={roleRow.id}
          userEmail={roleRow.email}
          initialRole={roleRow.role as AssignableRole}
          isOpen
          onOpenChange={(open) => {
            if (!open) setRoleRow(null);
          }}
          onSuccess={refresh}
        />
      )}
      <ConfirmDialog
        isOpen={!!statusRow}
        onOpenChange={(open) => {
          if (!open) setStatusRow(null);
        }}
        title={statusRow?.isActive ? "Deactivate user" : "Reactivate user"}
        confirmLabel={statusRow?.isActive ? "Deactivate" : "Reactivate"}
        onConfirm={async () => {
          if (!statusRow) return;
          const isActive = !statusRow.isActive;
          const result = await setActiveAction({ userId: statusRow.id, isActive });
          if (!result.success) {
            toastActionError(result, isActive ? "reactivate user" : "deactivate user");
            return;
          }
          if (result.data?.selfDeactivated) {
            router.push("/deactivated?reason=deactivated");
            return;
          }
          setStatusRow(null);
          refresh();
          toastSuccess(
            isActive ? "User reactivated" : "User deactivated",
            isActive
              ? `The account for ${statusRow.email} can sign in again.`
              : `The account for ${statusRow.email} has been deactivated.`,
          );
        }}
      >
        {statusRow?.isActive ? (
          <>
            Are you sure you want to deactivate <strong>{statusRow.name ?? statusRow.email}</strong>
            ? They won&apos;t be able to sign in.
          </>
        ) : (
          <>
            Are you sure you want to reactivate{" "}
            <strong>{statusRow?.name ?? statusRow?.email}</strong>? They will be able to sign in
            again.
          </>
        )}
      </ConfirmDialog>
      <ConfirmDialog
        isOpen={!!invitationRow}
        onOpenChange={(open) => {
          if (!open) setInvitationRow(null);
        }}
        title="Cancel invitation"
        confirmLabel="Cancel invitation"
        onConfirm={async () => {
          if (!invitationRow) return;
          const result = await cancelPendingInvitationAction({ userId: invitationRow.id });
          if (!result.success) {
            toastActionError(result, "cancel invitation");
            return;
          }
          setInvitationRow(null);
          refresh();
          toastSuccess(
            "Invitation cancelled",
            `The invitation for ${invitationRow.email} has been cancelled.`,
          );
        }}
      >
        Are you sure you want to cancel the invitation for <strong>{invitationRow?.email}</strong>?
        They will need to be invited again.
      </ConfirmDialog>
    </div>
  );
}
