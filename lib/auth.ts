import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";
import { prisma } from "@/prisma/src";

interface RateLimiter {
  timestamps: Date[];
}
const userRateLimits = new Map<string, RateLimiter>();

export const rateLimit = (
  userId: string,
  rateLimitCount: number,
  rateLimitInterval: number
): boolean => {
  const now = new Date();
  const userLimiter = userRateLimits.get(userId) ?? { timestamps: [] };

  userLimiter.timestamps = userLimiter.timestamps.filter(
    (timestamp) => now.getTime() - timestamp.getTime() < rateLimitInterval
  );

  if (userLimiter.timestamps.length >= rateLimitCount) {
    return false; // Rate limit exceeded
  }

  userLimiter.timestamps.push(now);
  userRateLimits.set(userId, userLimiter);
  return true;
};

export const auth: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "production",
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: any) {
      const rateLimitCount = 5; // Allow 5 sign-ins
      const rateLimitInterval = 60 * 1000; // Within 1 minute (in milliseconds)

      if (!user.email) {
        console.error("User email is undefined in signIn callback");
        return false; // Reject sign-in
      }

      const isAllowed = rateLimit(
        user.email,
        rateLimitCount,
        rateLimitInterval
      );

      if (!isAllowed) {
        console.log(`Rate limit exceeded for user ${user.email}`);
        return false; // Reject sign-in
      }
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        return true;
      }

      await prisma.user.create({
        data: {
          email: user.email,
          provider: "Google",
          name: user.name,
          image: user.image,
        },
      });

      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.email = user.email; // Persist email in the token
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.email = token.email;
      }
      return session;
    },
  },
};
