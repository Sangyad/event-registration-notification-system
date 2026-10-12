import nodemailer, { type Transporter } from "nodemailer";

import { getOptionalInteger, getRequiredEnvVar } from "@/lib/infra/env";

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();
    transporter = nodemailer.createTransport({
      host: getRequiredEnvVar("SMTP_HOST"),
      port: getOptionalInteger("SMTP_PORT", 587),
      secure: getOptionalInteger("SMTP_PORT", 587) === 465,
      ...(user && pass ? { auth: { user, pass } } : {}),
    });
  }
  return transporter;
}

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail(payload: SendEmailPayload): Promise<void> {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? getRequiredEnvVar("SMTP_USER"),
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}
