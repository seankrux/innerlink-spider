<h1 align="center">🕷️ Internal Link Finder</h1>
<p align="center"><strong>Discover internal linking opportunities to boost your SEO.</strong></p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
</p>

---

## Preview

> No deployed URL yet — run locally to try the demo mode.

---

## Key Features

- 🔗 **URL & Sitemap Analysis** — Enter any website URL or sitemap to scan
- 🎯 **Link Opportunity Detection** — Finds pages that should link to each other
- ✍️ **Anchor Text Suggestions** — Source, target, and recommended anchor text
- 📊 **CSV Export** — Download suggestions for easy implementation
- 🧪 **Demo Mode** — Try it instantly with realistic sample data

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
  app/
    layout.tsx            # Root layout with metadata
    page.tsx              # Main page
    globals.css           # Global styles and skeleton animation
  components/
    LinkFinder.tsx        # Core analysis UI
  lib/
    linkAnalyzer.ts       # Demo link analysis logic
```

---

## Deployment

```bash
vercel deploy
```

---

## License

[MIT](LICENSE)

---

<div align="center">
  <p>Made with 💛 by Sean G</p>
</div>
