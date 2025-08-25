import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const API_KEY = process.env.NEXT_PUBLIC_WAKATIME_API_KEY;

    if (!API_KEY || API_KEY === "your_wakatime_api_key_here") {
      console.log("API key not configured");
      return NextResponse.json(
        {
          error:
            "Wakatime API key not configured. Please set NEXT_PUBLIC_WAKATIME_API_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    console.log(`Fetching Wakatime stats for user: ${username}`);

    const timeRange = searchParams.get("range") || "last_7_days";
    const endpoint =
      timeRange === "all_time"
        ? `https://wakatime.com/api/v1/users/${username}/stats/all_time`
        : `https://wakatime.com/api/v1/users/${username}/stats/last_7_days`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${btoa(API_KEY)}`,
      },
      next: { revalidate: 60 * 60 * 24 }, // Cache for 24 hours
    });

    console.log(`Wakatime API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Wakatime API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        {
          error: `Failed to fetch Wakatime stats: ${response.status} - ${errorText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Wakatime data received:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Wakatime API error:", error);
    return NextResponse.json(
      {
        error: `Internal server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
