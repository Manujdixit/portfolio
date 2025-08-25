import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI ||
  "http://localhost:3000/api/spotify/callback";

let ownerAccessToken = process.env.SPOTIFY_OWNER_ACCESS_TOKEN;
let ownerRefreshToken = process.env.SPOTIFY_OWNER_REFRESH_TOKEN;
let tokenExpiry: number | null = null;

// Function to refresh the owner's access token
async function refreshOwnerToken() {
  if (!ownerRefreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: ownerRefreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  ownerAccessToken = data.access_token;

  if (data.refresh_token) {
    ownerRefreshToken = data.refresh_token;
  }

  tokenExpiry = Date.now() + data.expires_in * 1000;
  return ownerAccessToken;
}

// Function to get valid access token
async function getValidAccessToken() {
  if (!ownerAccessToken) {
    throw new Error("No owner access token configured");
  }

  // If token is expired or will expire in next 5 minutes, refresh it
  if (!tokenExpiry || Date.now() > tokenExpiry - 5 * 60 * 1000) {
    return await refreshOwnerToken();
  }

  return ownerAccessToken;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "auth") {
    const scope = "user-read-currently-playing user-read-playback-state";
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID!,
        response_type: "code",
        redirect_uri: SPOTIFY_REDIRECT_URI,
        scope: scope,
      });

    return NextResponse.json({ authUrl });
  }

  if (action === "setup") {
    // This is for the owner to get setup instructions
    const scope = "user-read-currently-playing user-read-playback-state";
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID!,
        response_type: "code",
        redirect_uri: SPOTIFY_REDIRECT_URI,
        scope: scope,
      });

    return NextResponse.json({
      message:
        "Copy this URL and visit it in your browser to authenticate. After authorization, you'll get the tokens to add to your .env.local file.",
      authUrl: authUrl,
      setupInstructions: [
        "1. Copy the authUrl above and paste it in your browser",
        "2. Authorize your Spotify account",
        "3. You'll be redirected back (the tokens are handled in the callback)",
        "4. Check your server logs for the tokens",
        "5. Add the tokens to your .env.local file",
      ],
    });
  }

  if (action === "current-track") {
    try {
      const accessToken = await getValidAccessToken();

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 204) {
        return NextResponse.json({ isPlaying: false });
      }

      if (!response.ok) {
        // If unauthorized, try refreshing token
        if (response.status === 401) {
          try {
            const newToken = await refreshOwnerToken();
            const retryResponse = await fetch(
              "https://api.spotify.com/v1/me/player/currently-playing",
              {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              }
            );

            if (retryResponse.status === 204) {
              return NextResponse.json({ isPlaying: false });
            }

            if (!retryResponse.ok) {
              return NextResponse.json(
                { error: "Failed to fetch current track" },
                { status: retryResponse.status }
              );
            }

            const data = await retryResponse.json();
            return NextResponse.json(data);
          } catch (refreshError) {
            return NextResponse.json(
              { error: "Failed to refresh token" },
              { status: 401 }
            );
          }
        }

        return NextResponse.json(
          { error: "Failed to fetch current track" },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
