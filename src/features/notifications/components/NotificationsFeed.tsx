"use client";

import { useState } from "react";

import { markNotificationReadAction } from "@/features/notifications/actions";
import type { NotificationRow } from "@/features/notifications/queries";
import { toastActionError } from "@/lib/hooks/toast-utils";

import styles from "./NotificationsFeed.module.css";

interface NotificationsFeedProps {
  initialNotifications: NotificationRow[];
}

export function NotificationsFeed({ initialNotifications }: NotificationsFeedProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const markRead = async (id: string) => {
    const response = await markNotificationReadAction({ notificationId: id });
    if (!response.success) {
      toastActionError(response, "mark notification as read");
      return;
    }
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Updates</p>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p className={styles.empty}>You do not have any notifications yet.</p>
      ) : (
        <div className={styles.list}>
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`${styles.item} ${notification.isRead ? "" : styles.unread}`}
              onClick={() => void markRead(notification.id)}
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.itemContent}>
                <span className={styles.itemHeader}>
                  <strong>{notification.title}</strong>
                  <time dateTime={notification.createdAt.toISOString()}>
                    {notification.createdAt.toLocaleString()}
                  </time>
                </span>
                <span className={styles.body}>{notification.body}</span>
                {notification.clubName && (
                  <span className={styles.club}>{notification.clubName}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
