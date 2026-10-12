"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { TextField } from "@/components/ui/TextField/TextField";
import {
  addPendingUserAction,
  cancelPendingUserAction,
  getUserManagementRowsAction,
  setActiveAction,
  updateRoleAction,
} from "@/features/users/actions";
import type { UserManagementRow } from "@/features/users/queries";
import { Role } from "@/generated/prisma/browser";
import { toastActionError, toastSuccess } from "@/lib/hooks/toast-utils";

import styles from "./UsersManagement.module.css";

interface UsersManagementProps {
  initialRows: UserManagementRow[];
}
const roles = [Role.STUDENT, Role.OFFICER, Role.ADMIN];
type AssignableRole = (typeof roles)[number];

export function UsersManagement({ initialRows }: UsersManagementProps) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [roleRow, setRoleRow] = useState<UserManagementRow | null>(null);
  const [role, setRole] = useState<AssignableRole>(Role.STUDENT);

  async function refresh(value: string) {
    setSearch(value);
    setRows(await getUserManagementRowsAction(value));
  }
  async function run(
    action: Promise<{
      success: boolean;
      error?: { code: string; title: string; description: string };
    }>,
    operation: string,
  ) {
    const response = await action;
    if (!response.success) toastActionError(response, operation);
    else {
      toastSuccess("Changes saved", "The user management list has been updated.");
      setRows(await getUserManagementRowsAction(search));
    }
  }
  async function submitAdd(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await run(addPendingUserAction({ email: data.get("email"), role }), "add user");
    setAddOpen(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Administration</p>
          <h1>Manage users</h1>
        </div>
        <Button onPress={() => setAddOpen(true)}>+ Add user</Button>
      </div>
      <TextField label="Search users" value={search} onChange={(value) => void refresh(value)} />
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
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
                <td>{row.role}</td>
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
                    <Button
                      variant="ghost"
                      onPress={() =>
                        void run(
                          cancelPendingUserAction({ userId: row.id }),
                          "cancel pending assignment",
                        )
                      }
                    >
                      Cancel
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onPress={() => {
                          setRoleRow(row);
                          if (roles.includes(row.role as AssignableRole)) {
                            setRole(row.role as AssignableRole);
                          }
                        }}
                      >
                        Edit role
                      </Button>
                      <Button
                        variant="ghost"
                        onPress={() =>
                          void run(
                            setActiveAction({ userId: row.id, isActive: !row.isActive }),
                            "update user status",
                          )
                        }
                      >
                        {row.isActive ? "Deactivate" : "Reactivate"}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addOpen && (
        <Modal title="Add user" isOpen onOpenChange={setAddOpen}>
          <form className={styles.modalForm} onSubmit={(event) => void submitAdd(event)}>
            <TextField name="email" label="School email" type="email" isRequired />
            <Select
              label="Role"
              value={role}
              onChange={(value) => {
                const selectedRole = String(value) as AssignableRole;
                if (roles.includes(selectedRole)) setRole(selectedRole);
              }}
            >
              {roles.map((item) => (
                <SelectItem key={item} id={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
            <Button type="submit">Add user</Button>
          </form>
        </Modal>
      )}
      {roleRow && (
        <Modal
          title={`Edit role for ${roleRow.email}`}
          isOpen
          onOpenChange={(open) => {
            if (!open) setRoleRow(null);
          }}
        >
          <div className={styles.modalForm}>
            <Select
              label="Role"
              value={role}
              onChange={(value) => {
                const selectedRole = String(value) as AssignableRole;
                if (roles.includes(selectedRole)) setRole(selectedRole);
              }}
            >
              {roles.map((item) => (
                <SelectItem key={item} id={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
            <Button
              onPress={() => {
                void run(updateRoleAction({ userId: roleRow.id, role }), "update user role");
                setRoleRow(null);
              }}
            >
              Save role
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
