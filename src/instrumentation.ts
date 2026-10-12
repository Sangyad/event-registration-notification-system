import { getOptionalEnvVar } from "@/lib/infra/env";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const devEmailRaw = getOptionalEnvVar("DEV_EMAIL", "");
  const email = devEmailRaw ? devEmailRaw.toLowerCase() : "";
  if (!email) return;

  const { ensureDeveloperUser } = await import("@/features/users/mutations");
  await ensureDeveloperUser(email);
}
