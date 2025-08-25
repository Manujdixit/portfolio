import { NextRequest, NextResponse } from "next/server";

interface GitHubPR {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

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
    const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

    if (!GITHUB_TOKEN || GITHUB_TOKEN === "your_github_token_here") {
      console.log("GitHub token not configured");
      return NextResponse.json(
        {
          error:
            "GitHub token not configured. Please set GITHUB_ACCESS_TOKEN in .env.local",
        },
        { status: 500 }
      );
    }

    console.log(`Fetching GitHub PRs for user: ${username}`);
    console.log(`Using token: ${GITHUB_TOKEN ? "Present" : "Missing"}`);

    // Fetch pull requests where user is the author
    const response = await fetch(
      `https://api.github.com/search/issues?q=author:${username}+type:pr+is:open+is:closed&sort=updated&order=desc&per_page=3`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 * 60 * 24 }, // Cache for 24 hours
      }
    );

    console.log(`GitHub API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        {
          error: `Failed to fetch GitHub PRs: ${response.status} - ${errorText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("GitHub data received:", data);

    // Transform the data to include more PR details
    const prs =
      data.items?.map((item: any) => {
        console.log("Processing PR item:", item);
        console.log("Repository data:", item.repository);

        // Handle different repository data structures
        const repoData = item.repository || item.repository_url;

        return {
          id: item.id,
          number: item.number,
          title: item.title,
          html_url: item.html_url,
          state: item.state,
          created_at: item.created_at,
          updated_at: item.updated_at,
          repository: {
            html_url: repoData?.html_url || item.html_url,
            avatar_url: repoData?.owner?.avatar_url || null,
            description: repoData?.description || null,
          },
          labels: item.labels || [],
        };
      }) || [];

    return NextResponse.json({ pullRequests: prs });
  } catch (error) {
    console.error("GitHub API error:", error);
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
