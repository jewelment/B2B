import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30-day session
  },
  providers: [
    CredentialsProvider({
      name: "B2B Portal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
        
        if (!isValidPassword) {
          throw new Error("Invalid email or password.");
        }

        // --- THE B2B GATEKEEPER LOGIC ---
        if (user.role === "CLIENT" && user.status !== "APPROVED") {
          throw new Error("Access Denied: Your wholesale account is pending administrative approval.");
        }

        if (user.status === "SUSPENDED") {
          throw new Error("Access Denied: Your account has been suspended. Contact your procurement manager.");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          assignedSalesmanId: user.assignedSalesmanId || undefined // FIXED SCHEMA REFERENCE
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        // Map custom properties to the JWT token
        token.assignedSalesmanId = (user as any).assignedSalesmanId; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).assignedSalesmanId = token.assignedSalesmanId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };