---
title: "Scoring 100 on Lighthouse (Performance focused)"
description: "“Why aim for 100? Because Google loves fast websites more than devs love dark mode.”   If you also..."
pubDatetime: 2025-08-02T19:30:52Z
modDatetime: 2025-08-02T19:50:11Z
tags:
  - webdev
  - programming
  - javascript
  - seo
---
> “Why aim for 100? Because Google loves fast websites more than devs love dark mode.”

If you also stared at a Lighthouse score of **28** and thought _“what kind of shit I had written”_, this post is for you.

---

## 🤔 What Even Is Lighthouse?

Lighthouse is Google’s brutally honest friend. It audits your site for:

- Performance  
- SEO  
- Accessibility  
- Best Practices  
- PWA readiness

> ![Drake Meme – JS ≠ fast vs. no JS = fast](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0ks8dippmd5822zasava.png)
  
---

## ⚙️ How to Run Lighthouse

- **Chrome DevTools**  
  Right-click → Inspect → Lighthouse tab → Click “Analyze”

---

## ⚡ Performance: How to Reach 100 Without Losing Mind


### 1. Code Splitting

* Remove unused libraries/imports.
* Split JS using `React.lazy()` or `next/dynamic`
> ![Dynamic import](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ekzyaa1bpqwrawpkcr1c.png)


* Avoid unnecessary animations on load
* Implement session based caching for less frquently updated data.

```js
// import specific parts

// bad practice- import radixui from "radix-ui"

// good practice
import Switch from "@radixui/switch"
```


* For manual treeshaking in nextjs-

![Treeshaking](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rgt90q1pzizvnpmhnmkp.png)

```bash
 ANALYZE=true npm run build
```

> ![Big modules](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lsz6g760cwutc200gnr7.png)
> *Bigger colored boxes increase your bundle size and oftenly impact performance also. To optimize dynamically import them.*

---

### 2. Optimize Apis

* Reduce the size of response by returning only required fields(or further more reducing its size by gziping it)
> ![selecting only required fields to query from db](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vye8j3t6bq88nq3upl7j.png)


* Implementing caching for less freuently updated data.
> ![caching](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dpcmb1pu8rapywezlpai.png)


* Avoid Shitty Orms like prisma, typeorm etc. As they make your queries slower with heavy engines, slower query execution speed, lack of proper joins. (I had started using drizzle for migrations and kysely as sql query builder, responses are 10x faster as compared to prisma and 3-4x faster to typeorm).

---

### 2. 🖼️ Optimize Your Largest Contentful Paint (LCP)

LCP = how fast your main content loads (target: < 2.5s)

* Compress images (`.webp` > `.jpg`)
* Lazy load offscreen images
* Serve static assets from a CDN

> ![lcp](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7vn6sernueel5z51t2gl.png)




> ![Slow LCP](https://i.imgflip.com/3lmzyx.jpg)
> LCP is like your first impression on a date — don’t show up blurry or late.

---



### 3. ⏱️ Use `defer` and Lazy Load Smartly

```html
<script defer src="/scripts/main.js"></script>
<img loading="lazy" src="/images/offscreen.jpg" />
```

> “Don’t serve dessert before the main course.” 🍰

---

### 4. 🥇 Preload Fonts & Key Assets

```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

---

## 🔍 SEO: Make Googlebot Fall in Love With You

### 1. 🎯 Proper `<title>` & `<meta description>`

Each page should have proper title and meta description.


![metadata](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ledbkj0y0sl5yw8whmr4.png)


> ![Confused math lady meme](https://i.imgflip.com/4t0m5k.jpg)
> *“Googlebot trying to index your page with no title tag…”*

---

### 2. 🧩 Use Semantic HTML

Use proper tags like `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`.

> **Analogy:**
> Semantic tags are like labeled boxes during moving — they help Googlebot know what’s inside.

---

### 3. 🧭 Descriptive Link Text

Bad:

```html
<a href="/more">Click here</a>
```

Good:

```html
<a href="/about-us">Learn more about our team</a>
```

> *“Click here” links are the SEO version of mystery boxes.*

---

### 4. 📱 Mobile Friendliness

Make sure your layout adapts well to all screen sizes.

---

## 🧰 Bonus Tools to Save Your Sanity

* 🎨 [Squoosh](https://squoosh.app) — Compress images locally
* 🧼 [PurgeCSS](https://purgecss.com/) — Remove unused CSS
* 🕵️ [PageSpeed Insights](https://pagespeed.web.dev/)
* 🔡 [Glyphhanger](https://github.com/filamentgroup/glyphhanger) — Font subset tool
* 🚀 [Cloudflare Pages](https://pages.cloudflare.com/) — Free CDN hosting for static sites

---

## 🏁 Final Thoughts

Getting a **100** Lighthouse score isn’t just for bragging rights — it helps with:

* ⚡ Blazing fast user experience
* 🔍 Higher SEO rankings
* 📈 Better engagement + conversions

> *“A slow site is like a waiter who brings water after dessert. Nobody comes back.”*
