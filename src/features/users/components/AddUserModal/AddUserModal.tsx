"use client";

import { useEffect, useState } from "react";
import { Form } from "react-aria-components";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { TextField } from "@/components/ui/TextField/TextField";
import { getClubOptionsAction } from "@/features/clubs/actions";
import { formatClubLabel, LITS_CLUB_NAME } from "@/features/clubs/constants";
import type { ClubOption } from "@/features/clubs/queries";
import { addPendingUserAction } from "@/features/users/actions";
import { AddPendingUserSchema, type AddPendingUserPayload } from "@/features/users/schemas";
import { Role } from "@/generated/prisma/browser";
import { toastError } from "@/lib/hooks/toast-utils";
import { useModalForm } from "@/lib/hooks/useModalForm";
import { createFieldValidator, requiredString } from "@/lib/validation/form-utils";

import styles from "./AddUserModal.module.css";

const roles = [Role.STUDENT, Role.OFFICER, Role.ADMIN];
type AssignableRole = (typeof roles)[number];

const NO_CLUB = "none";

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export function AddUserModal({ isOpen, onOpenChange, onSuccess }: AddUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AssignableRole>(Role.STUDENT);
  const [clubId, setClubId] = useState<string | null>(null);
  const [clubs, setClubs] = useState<ClubOption[]>([]);

  const reset = () => {
    setEmail("");
    setRole(Role.STUDENT);
    setClubId(null);
  };

  const { isPending, submitForm, handleCancel } = useModalForm<AddPendingUserPayload>({
    submit: addPendingUserAction,
    onOpenChange,
    onSuccess,
    reset,
    successMessage: "User added",
    successDescription: "The invitation has been sent to the school email address.",
    failureMessage: "Failed to add user",
    schema: AddPendingUserSchema,
  });

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    async function loadClubs() {
      try {
        const rows = await getClubOptionsAction();
        if (cancelled) return;
        setClubs(rows);
        setClubId(
          (current) => current ?? rows.find((club) => club.name === LITS_CLUB_NAME)?.id ?? null,
        );
      } catch {
        if (!cancelled) {
          toastError(
            "Failed to load clubs",
            "We couldn't retrieve the club list. Please try again.",
          );
          onOpenChange(false);
        }
      }
    }
    void loadClubs();
    return () => {
      cancelled = true;
    };
  }, [isOpen, onOpenChange]);

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (isPending) return;
    await submitForm({ email: requiredString(email), role, clubId });
  }

  return (
    <Modal className={styles.modal} title="Add user" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form validationBehavior="native" onSubmit={handleSubmit}>
        <div className={styles.form}>
          <TextField
            label="School email"
            type="email"
            value={email}
            onChange={setEmail}
            validate={createFieldValidator(AddPendingUserSchema.shape.email)}
            isDisabled={isPending}
          />
          <Select
            label="Role"
            value={role}
            onChange={(value) => {
              const selectedRole = String(value) as AssignableRole;
              if (roles.includes(selectedRole)) setRole(selectedRole);
            }}
            validate={createFieldValidator(AddPendingUserSchema.shape.role)}
            isDisabled={isPending}
          >
            {roles.map((item) => (
              <SelectItem key={item} id={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Club"
            value={clubId ?? NO_CLUB}
            onChange={(value) =>
              setClubId(value == null || value === NO_CLUB ? null : String(value))
            }
            isDisabled={isPending}
          >
            <SelectItem id={NO_CLUB}>No club</SelectItem>
            {clubs.map((club) => (
              <SelectItem key={club.id} id={club.id}>
                {formatClubLabel(club)}
              </SelectItem>
            ))}
          </Select>
          <div className={styles.actions}>
            <Button
              className={styles.button}
              type="button"
              variant="secondary"
              onPress={handleCancel}
              isDisabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className={styles.button}
              type="submit"
              variant="primary"
              isDisabled={isPending}
              isPending={isPending}
            >
              Add user
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
