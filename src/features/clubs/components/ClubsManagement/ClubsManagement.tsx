"use client";

import { useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { TextField } from "@/components/ui/TextField/TextField";
import { deleteClubAction, getClubRowsAction } from "@/features/clubs/actions";
import { ClubFormModal } from "@/features/clubs/components/ClubFormModal/ClubFormModal";
import type { ClubRow } from "@/features/clubs/queries";
import { toastActionError, toastError, toastSuccess } from "@/lib/hooks/toast-utils";

import styles from "./ClubsManagement.module.css";

interface ClubsManagementProps {
  initialRows: ClubRow[];
}

export function ClubsManagement({ initialRows }: ClubsManagementProps) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editClub, setEditClub] = useState<ClubRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<ClubRow | null>(null);

  async function refresh(value?: string) {
    const query = value ?? search;
    setSearch(query);
    try {
      setRows(await getClubRowsAction(query));
    } catch {
      toastError(
        "Failed to refresh clubs",
        "We couldn't retrieve the club list. Please try again.",
      );
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Administration</p>
          <h1>Manage clubs</h1>
        </div>
        <Button onPress={() => setAddOpen(true)}>+ Add club</Button>
      </div>
      <TextField label="Search clubs" value={search} onChange={(value) => void refresh(value)} />
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Short name</th>
              <th>Members</th>
              <th>Events</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>
                  {row.shortName ? <span className={styles.badge}>{row.shortName}</span> : "—"}
                </td>
                <td>{row.memberCount}</td>
                <td>{row.eventCount}</td>
                <td className={styles.actions}>
                  <Button variant="ghost" aria-label="Edit club" onPress={() => setEditClub(row)}>
                    <FaPenToSquare aria-hidden="true" className={styles.actionIcon} />
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label="Delete club"
                    onPress={() => setDeleteRow(row)}
                  >
                    <FaTrash aria-hidden="true" className={styles.actionIcon} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ClubFormModal isOpen={addOpen} onOpenChange={setAddOpen} onSuccess={() => void refresh()} />
      {editClub && (
        <ClubFormModal
          key={editClub.id}
          club={editClub}
          isOpen
          onOpenChange={(open) => {
            if (!open) setEditClub(null);
          }}
          onSuccess={() => void refresh()}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteRow}
        onOpenChange={(open) => {
          if (!open) setDeleteRow(null);
        }}
        title="Delete club"
        confirmLabel="Delete club"
        onConfirm={async () => {
          if (!deleteRow) return;
          const result = await deleteClubAction({ clubId: deleteRow.id });
          if (!result.success) {
            toastActionError(result, "delete club");
            return;
          }
          setDeleteRow(null);
          await refresh();
          toastSuccess("Club deleted", `The club ${deleteRow.name} has been deleted.`);
        }}
      >
        Are you sure you want to delete <strong>{deleteRow?.name}</strong>? This action cannot be
        undone.
      </ConfirmDialog>
    </div>
  );
}
