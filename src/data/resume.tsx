import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Manuj Dixit",
  initials: "MD",
  url: "https://manujdixit.dev",
  location: "Meerut, India",
  locationLink: "https://www.google.com/maps/place/meerut",
  description:
    "Full Stack Developer passionate about creating innovative web applications and contributing to open-source projects. I specialize in modern web technologies and enjoy solving complex problems.",
  summary:
    "I am a passionate full-stack developer with expertise in React, Next.js, Node.js, and various modern web technologies. Currently pursuing Computer Science and Engineering, I actively contribute to open-source projects and have participated in multiple hackathons. I love building scalable web applications and exploring new technologies.",
  avatarUrl: "/me.jpeg",
  skills: [
    "React",
    "Next.js",
    "Javascript",
    "Typescript",
    "Node.js",
    "Express.js",
    "Nestjs",
    "Python",
    "Golang",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "Prisma",
    "AWS",
    "Docker",
    "Firebase",
    "Razorpay",
    "Git",
    "Linux",
    "HTML",
    "CSS",
    "TailwindCSS",
    "Shadcn UI",
    "Redux",
    "REST APIs",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "manujdixit.dev@gmail.com",
    tel: "+919457239806",
    social: {
      Resume: {
        name: "Resume",
        url: "/resume/MANUJ_DIXIT.pdf",
        icon: Icons.clip,
        navbar: true,
      },
      GitHub: {
        name: "GitHub",
        url: "https://github.com/manujdixit",
        icon: Icons.github,
        navbar: true,
      },
      Leetcode: {
        name: "Leetcode",
        url: "https://leetcode.com/manujdixit",
        icon: Icons.leetcode,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/manujdixit",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/manujdixit",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:manujdixit.dev@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "TrueScholar Pvt Ltd",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Software Engineer Intern",
      logoUrl: "/github.png",
      start: "May 2025",
      end: "Present",
      description:
        "Delivered 2+ full-stack applications from conception to production deployment, serving 10,000+ monthly traffic. Architected scalable database solutions with AWS alerts, Auto scaling groups, AWS EC2, PostgreSQL and Redis caching, achieving 40% improvement in query response times.",
    },
    {
      company: "Cohyve",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Full Stack Developer Intern",
      logoUrl: "/hacktober.jpeg",
      start: "March 2025",
      end: "April 2025",
      description:
        "Developed authentication system with JWT access tokens, refresh tokens, OTP verification, and password reset functionality, handled with axios interceptors. Built robust media upload tool with drag-and-drop functionality supporting AWS S3 and Google Storage. Implemented background service workers for push notifications for better UX.",
    },
    {
      company: "Seetaara",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Full Stack Developer Intern",
      logoUrl: "/hackfest.png",
      start: "September 2024",
      end: "November 2024",
      description:
        "Created hexagonal architecture backend in Golang, enabling seamless future migration to microservices. Integrated Firebase Cloud Messaging and Razorpay payment gateway, with token refresh mechanisms resulting to 95% successful notification delivery rate and processing 1,000+ monthly transactions. Engineered high-throughput REST APIs achieving 60% latency reduction through optimized PostgreSQL database normalization, and query optimization.",
    },
    {
      company: "GitHub",
      href: "https://github.com/manujdixit",
      badges: [],
      location: "Remote",
      title: "Open Source Contributor",
      logoUrl: "/github.png",
      start: "August 2023",
      end: "Present",
      description:
        "Contributed to multiple public projects and the AMVSTRM API repo, collaborating globally with developers to foster innovation and drive success.",
    },
  ],
  education: [
    {
      title: "Institute of Engineering and Rural Technology",
      dates: "August 2023 - Present",
      location: "Prayagraj, India",
      description:
        "Bachelor of Technology in Computer Science and Engineering. Actively involved in web development and open-source contributions.",
      image: "/miet.jpeg",
      links: [],
    },
  ],
  projects: [
    {
      title: "Anveshna.",
      href: "https://anveshna.xyz",
      dates: "May 2024 - July 2024",
      active: true,
      description:
        "Anveshna is an anime streaming website that lets you watch your favorite anime 🌸",
      technologies: [
        "React",
        "Typescript",
        "Node.js",
        "Express",
        "Tailwind",
        "Aceternity UI",
        "Anilist API",
      ],
      links: [
        {
          type: "Website",
          href: "https://anveshna.xyz",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Github",
          href: "https://github.com/manujdixit/anveshna",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://github.com/manujdixit/portfolio/raw/main/public/videos/anveshna.mp4",
    },
    {
      title: "Presence",
      href: "https://presence.manujdixit.xyz",
      dates: "Feburary 2024",
      active: true,
      description:
        "A geolocation based attendance system for your on-the-go workforces.",
      technologies: ["Next.js", "React", "Tailwind CSS", "MongoDB"],
      links: [
        {
          type: "Website",
          href: "https://presence.manujdixit.xyz",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Github",
          href: "https://github.com/manujdixit/presence",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://github.com/manujdixit/portfolio/raw/main/public/videos/presence.mp4",
    },
    {
      title: "MIET Results",
      href: "https://miet-results.manujdixit.xyz",
      dates: "June 2024 - July 2024",
      active: true,
      description:
        "A web scraper to get AKTU University results of all students of Meerut Institute of Engineering and Technology.",
      technologies: [
        "React",
        "Javascript",
        "Node.js",
        "Express",
        "Tailwind",
        "AWS",
        "Cheerio",
        "Postman",
      ],
      links: [
        {
          type: "Website",
          href: "https://miet-results.manujdixit.xyz",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Github",
          href: "https://github.com/manujdixit/miet-results",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://github.com/manujdixit/portfolio/raw/main/public/videos/miet-result.mp4",
    },
    {
      title: "Watcher.",
      href: "https://watcher-01.vercel.app",
      dates: "March 2024",
      active: true,
      description:
        "A WebApp to watch movies and organize watch parties together with your friends.",
      technologies: [
        "React",
        "Javascript",
        "Node.js",
        "SCSS",
        "Express",
        "ZegoCloud API",
      ],
      links: [
        {
          type: "Website",
          href: "https://watcher-01.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Github",
          href: "https://github.com/manujdixit/watcher",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://github.com/manujdixit/portfolio/raw/main/public/videos/watcher.mp4",
    },
  ],
  hackathons: [
    {
      title: "Hackfest 1.0",
      dates: "April 22nd, 2024",
      location: "Meerut, Uttar Pradesh",
      description:
        "Developed a Responsive Web Application which allows users to find and book appointments with doctors ",
      image: "/hackfest.png",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/anshi14a/doctorly",
        },
      ],
    },
    {
      title: "DevGathering",
      dates: "March 30th - 31st, 2024",
      location: "Meerut, Uttar Pradesh",
      description:
        "Developed a Web Application which allows users to share thier screen and do watch parties with others.",
      image: "/devGathering.jpeg",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/manujdixit/watcher",
        },
        {
          title: "Devfolio",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://devfolio.co/projects/watcher-6488",
        },
      ],
    },
  ],
} as const;
