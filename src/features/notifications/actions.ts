"use server";

import { sendEmail } from "@/lib/messaging/email";
import type { PageQuery } from "@/lib/primitives/types";
import { actionInvalid, type ActionStatusResponse } from "@/lib/security/action-response";
import { requireAuth, requirePermission } from "@/lib/security/auth-guards";
import { toActionResponse } from "@/lib/security/errors";

import { createNotification, markNotificationRead } from "./mutations";
import {
  getNotificationPage,
  getNotificationRecipients,
  getUnreadNotificationCount,
  type NotificationPage,
} from "./queries";
import { MarkReadSchema, NotificationPageQuerySchema, SendNotificationSchema } from "./schemas";
import { buildNotificationScope } from "./scope";

export async function getNotificationsPageAction(query: PageQuery): Promise<NotificationPage> {
  const session = await requirePermission("notification.read");
  const parsed = NotificationPageQuerySchema.safeParse(query);
  return getNotificationPage({
    scope: buildNotificationScope(session),
    query: parsed.success ? parsed.data : {},
  });
}

export async function getUnreadNotificationCountAction(): Promise<number> {
  const session = await requirePermission("notification.read");
  return getUnreadNotificationCount(buildNotificationScope(session));
}

export async function markNotificationReadAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    const session = await requireAuth();
    const parsed = MarkReadSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("notification");
    await markNotificationRead(parsed.data.notificationId, session.id);
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "mark notification as read");
  }
}

export async function sendNotificationAction(payload: unknown): Promise<ActionStatusResponse> {
  try {
    const session = await requirePermission("notification.create");
    const parsed = SendNotificationSchema.safeParse(payload);
    if (!parsed.success) return actionInvalid("notification");
    const notification = await createNotification({ ...parsed.data, createdById: session.id });
    const recipients = await getNotificationRecipients(parsed.data.audience, parsed.data.clubId);
    if (recipients.length > 0) {
      await sendEmail({
        to: recipients.map((recipient) => recipient.email),
        subject: parsed.data.title,
        html: `<h1>${parsed.data.title}</h1><p>${parsed.data.body}</p>`,
      });
    }
    void notification;
    return { success: true };
  } catch (error) {
    return toActionResponse(error, "send notification");
  }
}
