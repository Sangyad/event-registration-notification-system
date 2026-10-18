"use client";

import clsx from "clsx";

import { formatDateTime } from "@/lib/primitives/date";

import type { NotificationRow } from "../../queries";
import styles from "./NotificationCard.module.css";

interface NotificationCardProps {
  notification: NotificationRow;
  onOpen: (notification: NotificationRow) => void;
}

export function NotificationCard({ notification, onOpen }: NotificationCardProps) {
  return (
    <button
      type="button"
      className={clsx(styles.card, !notification.isRead && styles.unread)}
      onClick={() => onOpen(notification)}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.content}>
        <span className={styles.header}>
          <strong className={styles.title}>{notification.title}</strong>
          <time className={styles.time} dateTime={notification.createdAt.toISOString()}>
            {formatDateTime(notification.createdAt)}
          </time>
        </span>
        <span className={styles.body}>{notification.body}</span>
        {notification.clubName && <span className={styles.club}>{notification.clubName}</span>}
      </span>
      {!notification.isRead && <span className={styles.srOnly}>Unread</span>}
    </button>
  );
}
