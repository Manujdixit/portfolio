import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

type DevToPost = {
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  slug: string;
  path: string;
  url: string;
  canonical_url?: string;
  cover_image?: string;
  tags: string;
  tag_list: string[];
  reading_time_minutes: number;
  published_at: string;
  body_markdown?: string;
};

function getMDXFiles(dir: string) {
  try {
    // Check if directory exists
    if (!fs.existsSync(dir)) {
      return [];
    }
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  } catch (error) {
    console.warn("Error reading content directory:", error);
    return [];
  }
}

// Fetch posts from dev.to API
async function fetchDevToPosts(username: string): Promise<DevToPost[]> {
  try {
    console.log(`Fetching dev.to posts for username: ${username}`);
    const response = await fetch(
      `https://dev.to/api/articles?username=${username}&per_page=100`
    );
    if (!response.ok) {
      console.warn("Failed to fetch dev.to posts");
      return [];
    }
    const posts = await response.json();
    console.log(`Fetched ${posts.length} posts from dev.to:`, posts);
    return posts;
  } catch (error) {
    console.warn("Error fetching dev.to posts:", error);
    return [];
  }
}

// Fetch individual dev.to post by slug
async function fetchDevToPostBySlug(
  username: string,
  slug: string
): Promise<DevToPost | null> {
  try {
    const response = await fetch(
      `https://dev.to/api/articles/${username}/${slug}`
    );
    if (!response.ok) {
      console.warn("Failed to fetch dev.to post");
      return null;
    }
    const post = await response.json();
    return post;
  } catch (error) {
    console.warn("Error fetching dev.to post:", error);
    return null;
  }
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  // Check if it's a dev.to post
  if (slug.startsWith("devto-")) {
    const originalSlug = slug.replace("devto-", "");
    const devToPost = await fetchDevToPostBySlug("manujdixit", originalSlug);

    if (devToPost) {
      // Convert dev.to post to our format
      return {
        source: devToPost.body_markdown || devToPost.description,
        metadata: {
          title: devToPost.title,
          publishedAt: devToPost.published_at, // Use full timestamp for accurate date
          summary: devToPost.description,
          image: devToPost.cover_image,
        },
        slug,
        isDevToPost: true,
        url: devToPost.url,
      };
    }
  }

  // Handle local MDX posts
  try {
    const filePath = path.join("content", `${slug}.mdx`);
    let source = fs.readFileSync(filePath, "utf-8");
    const { content: rawContent, data: metadata } = matter(source);
    const content = await markdownToHTML(rawContent);
    return {
      source: content,
      metadata,
      slug,
      isDevToPost: false,
    };
  } catch (error) {
    // If local post doesn't exist, return null
    return null;
  }
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let post = await getPost(slug);
      return post;
    })
  );

  // Filter out null posts and return only valid ones
  return posts.filter(
    (post): post is NonNullable<typeof post> => post !== null
  );
}

export async function getBlogPosts() {
  // Get local MDX posts
  const localPosts = await getAllPosts(path.join(process.cwd(), "content"));

  // Get dev.to posts
  const devToPosts = await fetchDevToPosts("manujdixit");

  // Transform dev.to posts to match local post format
  const transformedDevToPosts = devToPosts.map((post) => ({
    metadata: {
      title: post.title,
      publishedAt: post.published_at, // Use full timestamp instead of readable date
      summary: post.description,
      image: post.cover_image,
    },
    slug: `devto-${post.slug}`,
    source: post.description, // Use description as preview, full content will be fetched when needed
    url: post.url, // Add the dev.to URL
    isDevToPost: true, // Flag to identify dev.to posts
  }));

  // Combine and sort all posts by date
  const allPosts = [...localPosts, ...transformedDevToPosts].sort((a, b) => {
    const dateA = new Date(a.metadata.publishedAt);
    const dateB = new Date(b.metadata.publishedAt);
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  return allPosts;
}
