import nodemailer, { type Transporter } from "nodemailer";

import { getOptionalEnvVar, getOptionalInteger, getRequiredEnvVar } from "@/lib/infra/env";

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    const user = getOptionalEnvVar("SMTP_USER", "");
    const pass = getOptionalEnvVar("SMTP_PASS", "");
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
  const sender =
    getOptionalEnvVar("SMTP_FROM", "") ||
    getOptionalEnvVar("SMTP_USER", "") ||
    "no-reply@localhost";
  await getTransporter().sendMail({
    from: sender,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}
