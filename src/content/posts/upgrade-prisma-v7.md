---
title: "How to Upgrade Prisma ORM version (in Expressjs)?"
description: "Prisma v7 brings real improvements — better performance, cleaner architecture with adapters, and more..."
pubDatetime: 2025-11-29T15:06:41Z
modDatetime: 2026-08-14T10:02:32Z
tags:
  - webdev
  - programming
  - javascript
  - tutorial
---
Prisma v7 brings real improvements — better performance, cleaner architecture with adapters, and more predictable behavior in ESM environments. The challenge isn’t *whether* to upgrade, it’s upgrading without unnecessary chaos.

This guide focuses on exactly that: **what you need to change to move from Prisma v6 to v7 safely, why those changes exist, and what to avoid.** No fluff, no magic commands that break half your project.

The main areas that change during the upgrade:

* Dependencies and build tooling
* TypeScript config and module format
* Prisma client generation path
* Database connection using adapters
* Import paths inside the project

If you understand these pieces, upgrading becomes straightforward — not a guessing game.

---

## What Went Wrong the First Time —

During the initial migration attempt, the upgrade followed Prisma’s AI‑generated migration instructions. While technically valid, those steps enforced a full transition to **native ESM imports with file extensions** across the entire codebase.

This led to the following issues:

* Every local import required a `.js` extension after transpilation, forcing updates across all project files.
* TypeScript tooling such as `ts-node`, `tsx`, and `nodemon` became inconsistent because the runtime expected compiled `.js` file paths while the source files remained `.ts`.
* The Prisma client import also needed to be ESM‑specific with `.js` file extensions, which increased friction and instability.

Although the instructions technically aligned with an ESM‑only environment, this type of migration was unnecessarily disruptive for an existing project and introduced breaking points unrelated to Prisma itself.

### Correct Direction

The stable and efficient upgrade was achieved by using Prisma v7 with the new **adapter pattern** rather than converting the project to full ESM imports. Key improvements included:

* Keeping TypeScript import paths extension‑less
* Generating the Prisma client within `/src/generated` instead of `node_modules`
* Using `tsup` to output clean ESM build files instead of restructuring source imports manually
* Switching to `PrismaPg` with a PostgreSQL pool rather than changing file resolution strategies

This approach preserved the existing project architecture while meeting Prisma v7’s new adapter architecture requirements.

---

## Step 1: Install Required Dependencies

```bash
npm install prisma@latest @prisma/client@latest @prisma/adapter-pg pg tsup
npm i -D tsx
```

`@prisma/adapter-pg` + `pg` is now the default combo for PostgreSQL.

---

## Step 2: Update `tsconfig.json`

**Old:**

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

**New:**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*", "prisma.config.ts"]
}
```

✔ Enables ESM + modern TypeScript support that Prisma v7 expects.

---

## Step 3: Add `tsup.config.ts` (build using tsup)

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  target: "es2022",
  clean: true,
  sourcemap: false,
  dts: false,
});
```

Prisma v7 projects mostly use `tsup` instead of compiling via `tsc`.

---

## Step 4: Update Prisma Client Singleton

### Old (`@prisma/client`)

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const cleanup = async () => {
  await prisma.$disconnect();
};

process.on("beforeExit", cleanup);
process.on("exit", cleanup);
```

---

### New (Adapter-based)

```ts
import "dotenv/config";
import { PrismaClient } from "../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const cleanup = async () => {
  await prisma.$disconnect();
};

process.on("beforeExit", cleanup);
process.on("exit", cleanup);
```

Also update all imports across the project:

```
from "@prisma/client" → from "generated/client"
```

---

## Step 5: Update `schema.prisma`

**Old:**

```prisma
generator client {
  provider = "prisma-client-js"
  seed     = "ts-node prisma/seed.ts"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**New:**

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated"
}

datasource db {
  provider = "postgresql"
}
```

✔ Prisma v7 reads database connection from `prisma.config.ts` now.

---

## Step 6: Add `prisma.config.ts`

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

This file replaces `DATABASE_URL` inside the schema.

---

## Step 7: Update `package.json` scripts

**Old:**

```json
"scripts": {
  "build": "tsc -b",
  "start": "node dist/index.js",
  "render:build": "npm i && npx prisma generate --no-engine && npm run build",
  "render:start": "npx prisma migrate deploy && npm run start",
  "db:seed": "ts-node prisma/seed.ts",
  "dev": "nodemon src/index.ts"
}
```

**New:**

```json
"scripts": {
  "build": "tsup",
  "start": "node dist/index.mjs",
  "dev": "tsx --watch src/index.ts",
  "render:build": "npm i && npx prisma generate --no-engine && npm run build",
  "render:start": "npx prisma migrate deploy && npm run start"
}
```

---

## Migration Done — Now Regenerate Client

```bash
npx prisma generate
```

Then run your app:

```bash
npm run dev
```

If everything boots without adapter/esm errors — congrats, you're officially on Prisma v7 🎉

---

## Final Takeaway

Prisma v7 is faster, more modular, and built for modern ESM + adapters — but the transition requires tweaks to config, imports, build setup, and the singleton.
