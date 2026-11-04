import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://portfolio-vx5b.vercel.app/",
    title: "Manuj Dixit",
    description:
      "Manuj Dixit is a web developer building with TypeScript and modern frontend tools. Projects, experiments and notes.",
    author: "Manuj Dixit",
    profile: "https://github.com/Manujdixit",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Kolkata",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/Manujdixit" },
    { name: "devto", url: "https://dev.to/manujdixit", linkTitle: "Manuj Dixit on DEV" },
    { name: "medium", url: "https://medium.com/@manujdixit04" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
