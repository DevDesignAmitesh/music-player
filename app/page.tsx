"use client";

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">MusicVote</span>
      </h1>
      <p className="text-xl mb-8 max-w-md text-gray-300">
        Create rooms, vote for songs, and listen together. The ultimate music democracy for creators and fans.
      </p>
      <Button
      onClick={() => router.push("/auth")}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg">
        Get Started
      </Button>
    </div>
  )
}

