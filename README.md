<div align="center">
  <h1>Innerlink Spider</h1>
  <p><strong>Internal linking opportunity finder for SEO professionals</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
  </p>

  <br />
  <a href="https://innerlink-spider.vercel.app"><strong>Live Demo →</strong></a>
</div>

---

## Overview

Analyzes any website or sitemap to surface internal linking opportunities that strengthen site architecture and boost SEO. Outputs source pages, target pages, and recommended anchor text — all exportable as CSV.

## Preview

> [View the live application →](https://innerlink-spider.vercel.app)

## Features

▸ **URL and Sitemap Analysis** — Enter any website URL or sitemap to begin scanning

▸ **Link Opportunity Detection** — Identifies pages that should link to each other based on content relevance

▸ **Anchor Text Suggestions** — Provides source, target, and recommended anchor text for each opportunity

▸ **CSV Export** — Download all suggestions for implementation in your workflow

▸ **Demo Mode** — Try the tool instantly with realistic sample data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project Structure

```
src/
  app/
    layout.tsx            # Root layout with metadata
    page.tsx              # Main page
    globals.css           # Global styles
  components/
    LinkFinder.tsx        # Core analysis UI
  lib/
    linkAnalyzer.ts       # Link analysis logic
```

## Deployment

```bash
vercel deploy
```

## License

[MIT](LICENSE)

---

<p align="center">Made with 💛 by Sean G</p>
