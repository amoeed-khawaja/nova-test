# NOVA Website

National Opportunities for Venture Advancement — TanStack Start + Vite + Nitro.

## Local development

Requires **Node.js 20+**. Use npm, pnpm, yarn, or bun.

```sh
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:3000` or `5173`).

## Build

```sh
npm run build
npm run preview
```

## Deploy to Vercel

This app is configured for Vercel via Nitro (`nitro/vite`) and `vercel.json` (`framework: tanstack-start`).

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Confirm the framework preset is **TanStack Start**, then deploy.

Or with the CLI:

```sh
npm i -g vercel
vercel
```

Use `vercel --prod` for production.
