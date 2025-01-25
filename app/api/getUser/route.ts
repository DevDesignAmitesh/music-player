"use server";

import { prisma } from "@/prisma/src";

export async function getUser(email: string) {
  if (!email) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return;
  }

  return user;
}
