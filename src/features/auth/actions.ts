"use server";

import { auth, signOut } from "@/lib/infra/auth";

export async function clearDeactivatedSessionAction(): Promise<void> {
  const session = await auth();
  if (session?.user?.isActive === false) {
    await signOut({ redirect: false });
  }
}
