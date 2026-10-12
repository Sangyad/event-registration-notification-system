"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogTrigger, Heading } from "react-aria-components";
import { FaBell } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { Popover } from "@/components/ui/Popover/Popover";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { Tooltip, TooltipTrigger } from "@/components/ui/Tooltip/Tooltip";
import {
  getUnreadNotificationsAction,
  markNotificationReadAction,
} from "@/features/notifications/actions";
import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";
import type { NotificationRow } from "@/features/notifications/queries";
import { toastActionError, toastError } from "@/lib/hooks/toast-utils";
import { timeAgo } from "@/lib/primitives/date";

import styles from "./NotificationBell.module.css";

interface NotificationBellProps {
  initialUnreadCount: number;
}

export function NotificationBell({ initialUnreadCount }: NotificationBellProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useUnreadCount(initialUnreadCount);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pendingIdsRef = useRef(new Set<string>());
  const [pendingIds, setPendingIds] = useState(new Set<string>());

  useEffect(() => {
    let cancelled = false;
    if (isOpen) {
      const loadNotifications = async () => {
        setIsLoading(true);
        try {
          const data = await getUnreadNotificationsAction();
          if (!cancelled) {
            setNotifications(data);
          }
        } catch {
          if (!cancelled) {
            toastError(
              "Failed to load notifications",
              "We couldn't retrieve your notifications. Please try again.",
            );
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };
      void loadNotifications();
    }
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  async function handleOpenNotification(notificationId: string) {
    if (pendingIdsRef.current.has(notificationId)) return;
    pendingIdsRef.current.add(notificationId);
    setPendingIds(new Set(pendingIdsRef.current));
    try {
      const result = await markNotificationReadAction({ notificationId });
      if (result.success) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      } else {
        toastActionError(result, "mark notification as read");
      }
    } catch {
      toastError(
        "Failed to mark notification as read",
        "The notification could not be updated. Please try again.",
      );
    } finally {
      pendingIdsRef.current.delete(notificationId);
      setPendingIds(new Set(pendingIdsRef.current));
    }
    setIsOpen(false);
    router.push("/notifications");
  }

  return (
    <TooltipTrigger>
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button variant="ghost" aria-label="Notifications" className={styles.bellButton}>
          <FaBell className={styles.bellIcon} />
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
        </Button>

        <Popover placement="bottom end" width="content" className={styles.popover}>
          <Dialog className={styles.dialog}>
            <div className={styles.header}>
              <Heading slot="title" className={styles.headerTitle}>
                Notifications
              </Heading>
              <Button
                variant="ghost"
                className={styles.viewAllButton}
                onPress={() => {
                  setIsOpen(false);
                  router.push("/notifications");
                }}
              >
                View all
              </Button>
            </div>

            <div className={styles.list}>
              {isLoading ? (
                <div className={styles.empty}>
                  <ProgressCircle aria-label="Loading..." />
                </div>
              ) : notifications.length === 0 ? (
                <div className={styles.empty}>No notifications</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={styles.item}
                    disabled={pendingIds.has(n.id)}
                    onClick={() => handleOpenNotification(n.id)}
                  >
                    <div className={styles.itemContent}>
                      <span className={styles.itemTitle}>{n.title}</span>
                      <span className={styles.itemMessage}>{n.body}</span>
                      <time className={styles.itemTime} dateTime={n.createdAt.toISOString()}>
                        {timeAgo(n.createdAt)}
                      </time>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Dialog>
        </Popover>
      </DialogTrigger>
      <Tooltip>Notifications</Tooltip>
    </TooltipTrigger>
  );
}
