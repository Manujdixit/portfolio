"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";

interface GitHubPR {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  repository: {
    name: string;
    full_name: string;
    html_url: string;
    owner: string;
    avatar_url: string | null;
    description: string | null;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

interface GitHubData {
  pullRequests: GitHubPR[];
}

const GitHubComponent = () => {
  const [prs, setPrs] = useState<GitHubPR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const USERNAME =
          process.env.NEXT_PUBLIC_GITHUB_USERNAME || "ManujDixit";

        const response = await fetch(`/api/github?username=${USERNAME}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("GitHub API error:", response.status, errorText);
          throw new Error(
            `Failed to fetch GitHub PRs: ${response.status} - ${errorText}`
          );
        }

        const data: GitHubData = await response.json();
        setPrs(data.pullRequests || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
      case "open":
        return "bg-green-500";
      case "closed":
        return "bg-red-500";
      case "merged":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (state: string) => {
    return state.charAt(0).toUpperCase() + state.slice(1);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>GitHub Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>GitHub Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <BlurFade delay={0.04}>
      <Card className="w-full">
        <CardContent className="space-y-4">
          {prs.length === 0 ? (
            <p className="text-muted-foreground">No pull requests found.</p>
          ) : (
            <div className="space-y-3">
              {prs.slice(0, 3).map((pr) => (
                <div
                  key={pr.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {pr.repository.avatar_url && (
                        <img
                          src={pr.repository.avatar_url}
                          alt={`${pr.repository.owner} avatar`}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={pr.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sm hover:text-white transition-colors line-clamp-2"
                        >
                          #{pr.number} {pr.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(pr.created_at)}
                          </span>
                        </div>
                        {pr.repository.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {pr.repository.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${getStatusColor(
                          pr.state
                        )}`}
                        title={getStatusText(pr.state)}
                      />
                      <Badge variant="outline" className="text-xs">
                        {getStatusText(pr.state)}
                      </Badge>
                    </div>
                  </div>

                  {pr.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pr.labels.slice(0, 3).map((label) => (
                        <Badge
                          key={label.name}
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: `#${label.color}20`,
                            borderColor: `#${label.color}`,
                            color: `#${label.color}`,
                          }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                      {pr.labels.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{pr.labels.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {prs.length > 3 && (
            <div className="pt-2 border-t">
              <Link
                href={`https://github.com/${
                  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "ManujDixit"
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View all {prs.length} pull requests on GitHub →
              </Link>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex justify-center">
              <Link
                href={`https://github.com/${
                  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "ManujDixit"
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Visit Github Profile
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </BlurFade>
  );
};

export default GitHubComponent;
