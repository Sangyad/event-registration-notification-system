import { z } from "zod";

import { NotificationAudience } from "@/generated/prisma/browser";
import { requiredText } from "@/lib/validation/form-utils";

export const SendNotificationSchema = z
  .object({
    title: requiredText(160, "Title"),
    body: requiredText(5000, "Body"),
    audience: z.enum([NotificationAudience.ALL, NotificationAudience.CLUB]),
    clubId: z
      .string()
      .regex(/^c[a-z0-9]{24}$/, "Invalid club identifier")
      .nullable(),
  })
  .superRefine((value, context) => {
    if (value.audience === NotificationAudience.CLUB && !value.clubId) {
      context.addIssue({ code: "custom", path: ["clubId"], message: "Select a club" });
    }
    if (value.audience === NotificationAudience.ALL && value.clubId) {
      context.addIssue({
        code: "custom",
        path: ["clubId"],
        message: "Club must be empty for all recipients",
      });
    }
  });

export const MarkReadSchema = z.object({
  notificationId: z.string().regex(/^c[a-z0-9]{24}$/, "Invalid notification identifier"),
});
