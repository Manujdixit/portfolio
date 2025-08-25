import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Blog - Manuj Dixit",
  description:
    "My thoughts on software development, life, and more. Articles about React, Next.js, Node.js, web development, and technology.",
  keywords: [
    "blog",
    "software development",
    "React",
    "Next.js",
    "Node.js",
    "web development",
    "JavaScript",
    "TypeScript",
    "programming",
    "tech articles",
    "Manuj Dixit",
  ],
  openGraph: {
    title: "Blog - Manuj Dixit",
    description: "My thoughts on software development, life, and more.",
    url: "https://manujdixit.dev/blog",
    siteName: "Manuj Dixit",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Blog - Manuj Dixit",
    description: "My thoughts on software development, life, and more.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://manujdixit.dev/blog",
  },
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">blog</h1>
      </BlurFade>
      {posts.map((post, id) => {
        const isDevToPost = "isDevToPost" in post && post.isDevToPost;
        // All posts now use internal routing - dev.to posts will be displayed locally
        const postUrl = `/blog/${post.slug}`;

        return (
          <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
            <Link className="flex flex-col space-y-1 mb-4" href={postUrl}>
              <div className="w-full flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="tracking-tight">{post.metadata.title}</p>
                  {isDevToPost && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      dev.to
                    </span>
                  )}
                </div>
                <p className="h-6 text-xs text-muted-foreground">
                  {formatDate(post.metadata.publishedAt)}
                  {isDevToPost && " • Full content available"}
                </p>
              </div>
            </Link>
          </BlurFade>
        );
      })}
    </section>
  );
}
