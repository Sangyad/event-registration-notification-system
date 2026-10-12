import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { Role } from "@/generated/prisma/browser";
import { prisma } from "@/lib/infra/prisma";

const schoolDomain = "@acdeducation.com";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "database" },
  pages: { signIn: "/sign-in", error: "/sign-in" },
  callbacks: {
    async signIn({ user, account, profile }) {
      const emailVerified =
        profile && "email_verified" in profile && profile.email_verified === true;
      if (account?.provider !== "google" || !emailVerified || !user.email) return false;

      const email = user.email.toLowerCase();
      if (!email.endsWith(schoolDomain)) return "/sign-in?error=Domain";

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && !existingUser.isActive) return "/sign-in?error=Deactivated";

      if (!existingUser) {
        const pending = await prisma.pendingRoleAssignment.findUnique({ where: { email } });
        const devEmail = process.env.DEV_EMAIL?.trim().toLowerCase();
        const role = devEmail === email ? Role.DEV : (pending?.role ?? Role.STUDENT);
        try {
          await prisma.user.create({
            data: {
              email,
              name: user.name ?? email,
              image: user.image,
              role,
            },
          });
          if (pending) await prisma.pendingRoleAssignment.delete({ where: { email } });
        } catch (error) {
          const concurrentUser = await prisma.user.findUnique({ where: { email } });
          if (!concurrentUser) throw error;
        }
      } else {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { name: user.name ?? existingUser.name, image: user.image },
        });
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.email) return token;
      const user = await prisma.user.findUnique({ where: { email: token.email } });
      if (!user) return token;
      token.id = user.id;
      token.role = user.role;
      token.isActive = user.isActive;
      token.clubId = user.clubId;
      return token;
    },
    async session({ session, token, user }) {
      const source = user ?? token;
      if (session.user && source) {
        session.user.id =
          "id" in source && typeof source.id === "string" ? source.id : (user?.id ?? "");
        session.user.role = "role" in source && source.role ? source.role : Role.STUDENT;
        session.user.isActive = "isActive" in source && source.isActive !== false;
        session.user.clubId = "clubId" in source ? (source.clubId ?? null) : null;
      }
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
export const signIn = NextAuth(authOptions);
