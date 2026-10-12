import type { Role } from "@/generated/prisma/browser";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      isActive: boolean;
      clubId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    isActive?: boolean;
    clubId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    isActive?: boolean;
    clubId?: string | null;
  }
}
