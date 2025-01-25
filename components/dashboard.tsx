"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { FaShare } from "react-icons/fa";

export default function MusicVotingDashboard({ user }: { user: any }) {
  const [newSongUrl, setNewSongUrl] = useState("");
  const [songs, setSongs] = useState<string[]>([]);
  const [mostUpvoted, setmostUpvoted] = useState<any>();
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
  const sharableLink = `${window?.location?.hostname}/creator/${user?.id}`;

  const handleUpvote = async (id: string) => {
    try {
      await axios.post("/api/streams/upvote", {
        streamId: id,
      });

      setSongs((prevSongs: any) =>
        prevSongs?.map((song: any) =>
          song?.id === id
            ? {
                ...song,
                _count: { ...song?._count, upvote: song?._count?.upvote + 1 },
              }
            : song
        )
      );
      // Update only the upvote count for the specific song
    } catch (error) {
      console.error("Error during upvote:", error);
    }
  };

  const handleUpdownvote = async (id: string) => {
    try {
      await axios.post("/api/streams/downvote", {
        streamId: id,
      });

      // Update only the upvote count for the specific song
      setSongs((prevSongs: any) =>
        prevSongs?.map((song: any) =>
          song?.id === id
            ? {
                ...song,
                _count: { ...song?._count, upvote: song?._count?.upvote - 1 },
              }
            : song
        )
      );
    } catch (error) {
      console.error("Error during downvote:", error);
    }
  };

  const addSongs = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/streams", {
        url: newSongUrl,
      });
      const newSong = res.data.newStream;
      setSongs((prevSongs) => [newSong, ...prevSongs]);
      setNewSongUrl("");
    } catch (error) {
      console.log(error);
    }
  };

  const getAllStreams = async () => {
    const res = await axios.get(`/api/me?creatorId=${user.id}`);
    const data = res.data.allStreams;
    setSongs(data);
  };

  const getCurrecntlyPlayingSong = async () => {
    // const res = await axios.get("/api/next");
    // console.log(res.data.streams)
    // setmostUpvoted(res?.data?.streams);
  };

  useEffect(() => {
    if (songs.length > 0) {
      const highestUpvoted = songs.reduce((max: any, current: any) =>
        current._count?.upvote > max._count?.upvote ? current : max
      );
      setmostUpvoted(highestUpvoted);
    } else {
      setmostUpvoted(null); // Clear mostUpvoted if no songs exist
    }
  }, [songs]);

  useEffect(() => {
    getAllStreams();
    setTimeout(() => {
      getAllStreams();
    }, 10000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black p-4 md:p-8 dark">
      <div className="w-full relative flex justify-center items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 text-shadow">
          Choose Beat According To You.
        </h1>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(sharableLink);
          }}
          className="bg-gradient-to-r absolute right-0 top-1 from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg"
        >
          Link
          <FaShare />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Playing song */}
        <div className="w-full md:w-1/3">
          {mostUpvoted && (
            <Card className="bg-gray-900/40 backdrop-blur-sm text-white border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Now Playing</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">
                  {mostUpvoted?.title}
                </h2>
                <div className="aspect-video">
                  <img
                    className="object-cover object-center w-full h-full"
                    src={mostUpvoted?.bigImg}
                  />
                </div>
                <Button
                  onClick={getCurrecntlyPlayingSong}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-4 text-center text-white font-bold py-3 px-8 rounded-full text-lg"
                >
                  Play Next Song
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right side - Add song form and song queue */}
        <div className="w-full md:w-2/3 space-y-4">
          <Card className="bg-gray-900/40 backdrop-blur-sm text-white border border-gray-700">
            <CardContent className="pt-6">
              <form onSubmit={(e) => addSongs(e)} className="flex gap-2">
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
              {newSongUrl && newSongUrl.match(youtubeRegex) && (
                <div className="h-auto w-full overflow-hidden mt-5 rounded-md">
                  <LiteYouTubeEmbed id={newSongUrl.split("?v=")[1]} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
            {songs.map((song: any) => (
              <Card
                key={song?.id}
                className="bg-gray-900/40 transition-all duration-100 backdrop-blur-sm text-white border border-gray-700"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <img
                    src={song?.smallImg}
                    alt={`Thumbnail for ${song?.title}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{song?.title}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      {song?.url}
                    </p>
                  </div>
                  <div
                    onClick={() =>
                      song?.upvote?.length
                        ? handleUpdownvote(song?.id)
                        : handleUpvote(song?.id)
                    }
                    className="flex gap-2"
                  >
                    <Button
                      variant="outline"
                      className="bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
                      size="sm"
                    >
                      {song?.upvote?.length ? (
                        <ThumbsDown className="w-4 h-4" />
                      ) : (
                        <ThumbsUp className="w-4 h-4" />
                      )}
                      <p>{song?._count?.upvote ?? 0}</p>
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
