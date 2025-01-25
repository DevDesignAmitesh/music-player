import MusicVotingDashboard from "@/components/dashboard";
import React from "react";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUser } from "../api/getUser/route";

const page = async () => {
  const session: any = await getServerSession(auth);

  if (!session) {
    redirect("/");
  }

  console.log(session)

  const email = session?.user?.email;

  const user = await getUser(email);
  return <MusicVotingDashboard user={user} />;
};

export default page;
