"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";

interface Song {
  id: string;
  url: string;
  title: string;
  bgImg: string;
}

export default function MusicVotingDashboard() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongUrl, setNewSongUrl] = useState("");

  useEffect(() => {
    const getAllStreams = async () => {
      try {
        const allStreams = await axios.get("/api/me");
        setSongs(allStreams.data.allStreams);
        console.log(allStreams.data.allStreams);
        return allStreams.data; // Log the resolved data
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    getAllStreams(); // Call the async function
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black p-4 md:p-8 dark">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 text-shadow">
        Choose Beat According To You.
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Playing song */}
        <div className="w-full md:w-1/3">
          <Card className="bg-gray-900/40 backdrop-blur-sm text-white border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">{songs[0]?.title}</h2>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${songs[0]?.url}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Add song form and song queue */}
        <div className="w-full md:w-2/3 space-y-4">
          <Card className="bg-gray-900/40 backdrop-blur-sm text-white border border-gray-700">
            <CardContent className="pt-6">
              <form className="flex gap-2">
                <Input
                  type="text"
                  value={newSongUrl}
                  onChange={(e) => setNewSongUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  className="flex-grow bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  variant="outline"
                  className="bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
                  type="submit"
                >
                  Add Song
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
            {songs.map((song: any) => (
              <Card
                key={song.id}
                className="bg-gray-900/40 backdrop-blur-sm text-white border border-gray-700"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <img
                    src={song.smallImg}
                    alt={`Thumbnail for ${song.title}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{song.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{song.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
                      size="sm"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
                      size="sm"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
