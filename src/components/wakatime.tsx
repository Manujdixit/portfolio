"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlurFade from "@/components/magicui/blur-fade";

interface WakatimeStats {
  total_seconds: number;
  daily_average: number;
  best_day: {
    date: string;
    total_seconds: number;
  };
  languages: Array<{
    name: string;
    total_seconds: number;
    percent: number;
  }>;
  editors: Array<{
    name: string;
    total_seconds: number;
    percent: number;
  }>;
  operating_systems: Array<{
    name: string;
    total_seconds: number;
    percent: number;
  }>;
  categories: Array<{
    name: string;
    total_seconds: number;
    percent: number;
  }>;
  human_readable_total: string;
  human_readable_daily_average: string;
}

interface WakatimeData {
  data: WakatimeStats;
}

const WakatimeComponent = () => {
  const [stats, setStats] = useState<WakatimeStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WakatimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with your Wakatime API key and username
        const API_KEY = process.env.NEXT_PUBLIC_WAKATIME_API_KEY;
        const USERNAME = "manujdixit"; // Replace with your username

        if (!API_KEY || API_KEY === "your_wakatime_api_key_here") {
          setError(
            "Wakatime API key not configured. Please set NEXT_PUBLIC_WAKATIME_API_KEY in .env.local"
          );
          setLoading(false);
          return;
        }

        // Fetch both lifetime and weekly stats
        const [lifetimeResponse, weeklyResponse] = await Promise.all([
          fetch(`/api/wakatime?username=${USERNAME}&range=all_time`),
          fetch(`/api/wakatime?username=${USERNAME}&range=last_7_days`),
        ]);

        if (!lifetimeResponse.ok || !weeklyResponse.ok) {
          throw new Error("Failed to fetch Wakatime stats");
        }

        const lifetimeData: WakatimeData = await lifetimeResponse.json();
        const weeklyData: WakatimeData = await weeklyResponse.json();

        setStats(lifetimeData.data);
        setWeeklyStats(weeklyData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coding Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coding Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex min-h-0 flex-col gap-y-3">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center border p-4 rounded-xl">
          <p className="text-2xl font-bold">
            {formatTime(stats.total_seconds)}
          </p>
          <h5 className="font-semibold mb-2">Total Time</h5>
        </div>
        <div className="text-center border p-4 rounded-xl">
          <p className="text-2xl font-bold">
            {stats.daily_average < 21600 && weeklyStats
              ? formatTime(weeklyStats.daily_average)
              : formatTime(stats.daily_average)}
          </p>
          <h5 className="font-semibold mb-2">Daily Average </h5>
        </div>
      </div>

      {/* Languages */}
      {stats.languages.length > 0 && (
        <div>
          <h5 className="font-semibold mt-3">Top Languages (Lifetime)</h5>
          <div className="flex flex-wrap gap-1">
            {stats.languages.slice(0, 10).map((lang, index) => (
              <BlurFade key={index} delay={0.04 * 10 + index * 0.05}>
                <Badge key={lang.name}>{lang.name}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      )}

      {/* Editors and OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.editors.length > 0 && (
          <div>
            <h5 className="font-semibold mt-3">Editors</h5>
            <div className="space-y-1">
              {stats.editors.slice(0, 3).map((editor) => (
                <div key={editor.name} className="text-sm">
                  {editor.name} ({editor.percent.toFixed(1)}%)
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.operating_systems.length > 0 && (
          <div>
            <h5 className="font-semibold mt-3">Operating Systems</h5>
            <div className="space-y-1">
              {stats.operating_systems.slice(0, 3).map((os) => (
                <div key={os.name} className="text-sm">
                  {os.name} ({os.percent.toFixed(1)}%)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WakatimeComponent;
