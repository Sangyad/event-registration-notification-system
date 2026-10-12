"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import {
  getNotificationsAction,
  markNotificationReadAction,
} from "@/features/notifications/actions";
import { SendNotificationModal } from "@/features/notifications/components/SendNotificationModal/SendNotificationModal";
import type { NotificationRow } from "@/features/notifications/queries";
import { toastActionError, toastError } from "@/lib/hooks/toast-utils";

import styles from "./NotificationsFeed.module.css";

interface NotificationsFeedProps {
  initialNotifications: NotificationRow[];
  canCompose: boolean;
}

export function NotificationsFeed({ initialNotifications, canCompose }: NotificationsFeedProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const refresh = async () => {
    try {
      setNotifications(await getNotificationsAction());
    } catch {
      toastError(
        "Failed to refresh notifications",
        "We couldn't retrieve your notifications. Please try again.",
      );
    }
  };

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
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Updates</p>
          <h1>Notifications</h1>
        </div>
        {canCompose && (
          <Button onPress={() => setIsComposeOpen(true)}>
            <FaPlus aria-hidden="true" />
            Send notification
          </Button>
        )}
      </div>
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
      {canCompose && (
        <SendNotificationModal
          isOpen={isComposeOpen}
          onOpenChange={setIsComposeOpen}
          onSuccess={() => void refresh()}
        />
      )}
    </div>
  );
}
