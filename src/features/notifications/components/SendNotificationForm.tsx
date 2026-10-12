"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Form } from "@/components/ui/Form/Form";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { TextField } from "@/components/ui/TextField/TextField";
import { sendNotificationAction } from "@/features/notifications/actions";
import { NotificationAudience } from "@/generated/prisma/browser";
import { toastActionError, toastSuccess } from "@/lib/hooks/toast-utils";

import styles from "./SendNotificationForm.module.css";

interface ClubOption {
  id: string;
  name: string;
}
interface SendNotificationFormProps {
  clubs: ClubOption[];
}

export function SendNotificationForm({ clubs }: SendNotificationFormProps) {
  const [audience, setAudience] = useState<NotificationAudience>(NotificationAudience.ALL);
  const [clubId, setClubId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    setSuccess(false);
    const response = await sendNotificationAction({
      title: formData.get("title"),
      body: formData.get("body"),
      audience,
      clubId,
    });
    setPending(false);
    if (!response.success) {
      toastActionError(response, "send notification");
      return;
    }
    setSuccess(true);
    event.currentTarget.reset();
    setAudience(NotificationAudience.ALL);
    setClubId(null);
    toastSuccess(
      "Notification sent",
      "Recipients will see the announcement in their feed and email.",
    );
  }

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Officer tools</p>
      <h1>Send notification</h1>
      <Form onSubmit={handleSubmit} className={styles.form}>
        <TextField name="title" label="Title" isRequired />
        <TextField name="body" label="Body" isTextArea rows={7} isRequired />
        <Select
          label="Audience"
          value={audience}
          onChange={(value) => {
            if (value === NotificationAudience.ALL || value === NotificationAudience.CLUB) {
              setAudience(value);
            }
          }}
        >
          <SelectItem id={NotificationAudience.ALL}>All users</SelectItem>
          <SelectItem id={NotificationAudience.CLUB}>Club</SelectItem>
        </Select>
        {audience === NotificationAudience.CLUB && (
          <Select
            label="Club"
            value={clubId}
            onChange={(value) => setClubId(value == null ? null : String(value))}
            isRequired
          >
            {clubs.map((club) => (
              <SelectItem key={club.id} id={club.id}>
                {club.name}
              </SelectItem>
            ))}
          </Select>
        )}
        {success && (
          <p className={styles.success} role="status">
            Notification sent successfully.
          </p>
        )}
        <Button
          type="submit"
          isDisabled={pending || (audience === NotificationAudience.CLUB && !clubId)}
        >
          {pending ? "Sending…" : "Send notification"}
        </Button>
      </Form>
    </div>
  );
}
