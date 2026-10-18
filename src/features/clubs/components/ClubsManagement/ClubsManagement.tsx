"use client";

import { useEffect, useRef, useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { ListToolbar } from "@/components/ui/ListToolbar/ListToolbar";
import { deleteClubAction, getClubRowsAction } from "@/features/clubs/actions";
import { ClubFormModal } from "@/features/clubs/components/ClubFormModal/ClubFormModal";
import { ClubLabel } from "@/features/clubs/components/ClubLabel/ClubLabel";
import type { ClubRow } from "@/features/clubs/queries";
import { toastActionError, toastError, toastSuccess } from "@/lib/hooks/toast-utils";
import { useDebounce } from "@/lib/hooks/useDebounce";

import styles from "./ClubsManagement.module.css";

interface ClubsManagementProps {
  initialRows: ClubRow[];
}

export function ClubsManagement({ initialRows }: ClubsManagementProps) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editClub, setEditClub] = useState<ClubRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<ClubRow | null>(null);

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
        const result = await getClubRowsAction({ search: debouncedSearch });
        if (!cancelled) setRows(result);
      } catch {
        if (!cancelled) {
          toastError(
            "Failed to refresh clubs",
            "We couldn't retrieve the club list. Please try again.",
          );
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, refreshTrigger]);

  const refresh = () => setRefreshTrigger((trigger) => trigger + 1);

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Administration</p>
          <h1>Manage clubs</h1>
        </div>
        <Button onPress={() => setAddOpen(true)}>+ Add club</Button>
      </div>
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clubs..."
        searchLabel="Search clubs"
      />
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Club</th>
              <th>Members</th>
              <th>Events</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <ClubLabel name={row.name} shortName={row.shortName} />
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
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  No clubs match the current search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ClubFormModal isOpen={addOpen} onOpenChange={setAddOpen} onSuccess={refresh} />
      {editClub && (
        <ClubFormModal
          key={editClub.id}
          club={editClub}
          isOpen
          onOpenChange={(open) => {
            if (!open) setEditClub(null);
          }}
          onSuccess={refresh}
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
          refresh();
          toastSuccess(
            "Club deleted",
            `The club ${deleteRow.shortName ?? deleteRow.name} has been deleted.`,
          );
        }}
      >
        Are you sure you want to delete{" "}
        {deleteRow && <ClubLabel name={deleteRow.name} shortName={deleteRow.shortName} />}? This
        action cannot be undone.
      </ConfirmDialog>
    </div>
  );
}
