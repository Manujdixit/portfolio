"use client";

import { useState } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Spotify, { SpotifyTrack } from "@/components/spotify";

export default function Navbar() {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);

  const handleTrackChange = (track: SpotifyTrack | null) => {
    setCurrentTrack(track);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
        {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Spotify onTrackChange={handleTrackChange} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-black/95 backdrop-blur-sm border-gray-700 p-0 overflow-hidden"
            >
              {currentTrack ? (
                <div className="p-4 text-white max-w-xs">
                  <div className="text-xs text-gray-400 mb-2 font-medium">
                    Currently listening to
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          currentTrack.item.album.images[0]?.url ||
                          "https://via.placeholder.com/48x48?text=Album"
                        }
                        alt={currentTrack.item.album.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white truncate">
                        {currentTrack.item.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {currentTrack.item.artists
                          .map((artist) => artist.name)
                          .join(", ")}
                      </div>
                      <div className="text-xs text-green-400 mt-1">
                        Now Playing
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() =>
                        window.open(
                          currentTrack.item.external_urls?.spotify,
                          "_blank"
                        )
                      }
                      className="w-full text-xs bg-spotify hover:bg-green-600 text-white py-2 px-3 rounded-md transition-colors"
                    >
                      Open in Spotify
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-white">
                  <div className="text-xs text-gray-400 mb-2 font-medium">
                    Currently listening to
                  </div>
                  <div className="text-sm text-gray-300">Not playing</div>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}
