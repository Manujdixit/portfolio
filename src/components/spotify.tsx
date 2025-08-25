"use client";

import { useEffect, useState } from "react";
import { Disc } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpotifyTrack {
  item: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    external_urls?: {
      spotify: string;
    };
  };
  is_playing: boolean;
}

interface SpotifyProps {
  onTrackChange?: (track: SpotifyTrack | null) => void;
}

export default function Spotify({ onTrackChange }: SpotifyProps) {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTokens, setHasTokens] = useState(true);

  useEffect(() => {
    fetchCurrentTrack();

    // Set up interval to fetch current track every 30 seconds
    const interval = setInterval(fetchCurrentTrack, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Notify parent component when track changes
    if (onTrackChange) {
      onTrackChange(currentTrack);
    }
  }, [currentTrack, onTrackChange]);

  const fetchCurrentTrack = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/spotify?action=current-track");

      if (response.ok) {
        const data = await response.json();
        setCurrentTrack(data.is_playing ? data : null);
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
      <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Disc className="size-4 text-gray-400" />
      </div>
    );
  }

  // If loading and no current track, show loading state
  if (isLoading && !currentTrack) {
    return (
      <div className="size-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <Disc className="size-4 text-gray-400" />
      </div>
    );
  }

  // If no track is playing, show static disc
  if (!currentTrack) {
    return (
      <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Disc className="size-4 text-gray-400" />
      </div>
    );
  }

  const handleClick = () => {
    if (currentTrack && currentTrack.item.external_urls?.spotify) {
      window.open(currentTrack.item.external_urls.spotify, "_blank");
    }
  };

  // Show rotating CD with album cover
  return (
    <div
      className={cn(
        "size-10 rounded-full overflow-hidden border-2 border-green-500 relative cursor-pointer transition-transform hover:scale-105",
        currentTrack.is_playing && "animate-spin"
      )}
      style={{
        animationDuration: "3s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      }}
      onClick={handleClick}
      title={
        currentTrack
          ? `Open "${currentTrack.item.name}" on Spotify`
          : "Not playing"
      }
    >
      {currentTrack.item.album.images[0] ? (
        <img
          src={currentTrack.item.album.images[0].url}
          alt={currentTrack.item.album.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <Disc className="size-5 text-gray-400" />
        </div>
      )}
    </div>
  );
}
