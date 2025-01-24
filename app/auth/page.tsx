"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";
import { FaGoogle } from "react-icons/fa";

const page = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex justify-center items-center">
      <Button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg"
      >
        Sign in with google
        <FaGoogle size={20} />
      </Button>
    </div>
  );
};

export default page;
