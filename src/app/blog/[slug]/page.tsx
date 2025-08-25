import { getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  let post = await getPost(params.slug);

  if (!post) {
    return undefined;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  return {
    title: `${title} - Manuj Dixit`,
    description,
    keywords: [
      "blog",
      "article",
      "software development",
      "programming",
      "web development",
      "Manuj Dixit",
    ],
    authors: [{ name: DATA.name }],
    other: {
      publishedTime,
      modifiedTime: publishedTime,
    },
    openGraph: {
      title: `${title} - Manuj Dixit`,
      description,
      type: "article",
      publishedTime,
      modifiedTime: publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      authors: [DATA.name],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Manuj Dixit`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${DATA.url}/blog/${post.slug}`,
    },
    category: "Technology",
  };
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const isDevToPost = (post as any).isDevToPost;
  const postUrl = (post as any).url;

  return (
    <section id="blog">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${DATA.url}${post.metadata.image}`
              : `${DATA.url}/og?title=${post.metadata.title}`,
            url: `${DATA.url}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      <div className="max-w-[650px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="title font-medium text-2xl tracking-tighter">
            {post.metadata.title}
          </h1>
          {isDevToPost && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              dev.to
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-2 mb-2 text-sm">
          <Suspense fallback={<p className="h-5" />}>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(post.metadata.publishedAt)}
            </p>
          </Suspense>
          {isDevToPost && postUrl && (
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View on dev.to →
            </a>
          )}
        </div>

        <div className="block w-[2.5rem] h-[0.2rem] mb-8 bg-[#ddd]"></div>

        <article className="prose dark:prose-invert max-w-none">
          {isDevToPost ? (
            // For dev.to posts, convert markdown to HTML and render
            <div
              dangerouslySetInnerHTML={{
                __html: await import("@/data/blog").then(({ markdownToHTML }) =>
                  markdownToHTML(post.source)
                ),
              }}
            />
          ) : (
            // For local posts, use existing HTML content
            <div dangerouslySetInnerHTML={{ __html: post.source }} />
          )}
        </article>
      </div>
    </section>
  );
}
