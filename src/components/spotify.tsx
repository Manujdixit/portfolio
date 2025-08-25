"use client";

import { useEffect, useState } from "react";
import { Disc } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotifyTrack {
  item: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
  };
  is_playing: boolean;
}

export default function Spotify() {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTokens, setHasTokens] = useState(true);

  useEffect(() => {
    fetchCurrentTrack();

    // Set up interval to fetch current track every 30 seconds
    const interval = setInterval(fetchCurrentTrack, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchCurrentTrack = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/spotify?action=current-track");

      if (response.ok) {
        const data = await response.json();
        setCurrentTrack(data.isPlaying ? data : null);
        setHasTokens(true);
      } else if (response.status === 401) {
        // No tokens configured or tokens expired
        setHasTokens(false);
        setCurrentTrack(null);
      } else {
        // Other error, keep trying
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error("Failed to fetch current track:", error);
      setCurrentTrack(null);
    } finally {
      setIsLoading(false);
    }
  };

  // If no tokens are configured, show setup message for owner
  if (!hasTokens && !isLoading) {
    return (
      <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Disc className="size-4 text-gray-400" />
      </div>
    );
  }

  // If loading and no current track, show loading state
  if (isLoading && !currentTrack) {
    return (
      <div className="size-12 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <Disc className="size-4 text-gray-400" />
      </div>
    );
  }

  // If no track is playing, show static disc
  if (!currentTrack) {
    return (
      <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Disc className="size-4 text-gray-400" />
      </div>
    );
  }

  // Show rotating CD with album cover
  return (
    <div className="relative group">
      <div
        className={cn(
          "size-12 rounded-full overflow-hidden border-2 border-green-500 relative",
          currentTrack.is_playing && "animate-spin"
        )}
        style={{
          animationDuration: "3s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {currentTrack.item.album.images[0] ? (
          <img
            src={currentTrack.item.album.images[0].url}
            alt={currentTrack.item.album.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Disc className="size-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Tooltip with track info */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
        <div className="font-semibold">{currentTrack.item.name}</div>
        <div className="text-gray-300 text-xs">
          {currentTrack.item.artists.map((artist) => artist.name).join(", ")}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
}
