# :spider: Internal Link Finder

**Discover internal linking opportunities to boost your SEO.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

Internal Link Finder analyzes your website and surfaces pages that should link to each other but don't. Enter a URL or sitemap, get actionable source-to-target link suggestions with recommended anchor text, and export everything to CSV.

## Features

- **URL & Sitemap Input** - Enter any website URL or sitemap to start analysis
- **Link Opportunity Detection** - Finds pages mentioning keywords that other pages target
- **Anchor Text Suggestions** - Recommends natural anchor text for each link opportunity
- **CSV Export** - Download all suggestions as a CSV for easy implementation
- **Robots.txt Compliance** - Crawler respects robots.txt and rate limits
- **Cheerio-Powered Parsing** - Fast, lightweight HTML parsing on the server

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| HTML Parsing | Cheerio |
| Robots Parsing | robots-parser |
| Sitemap Parsing | fast-xml-parser |
| UI Components | Radix UI, Lucide Icons |

## Environment Variables

Create a `.env.local` file in the project root. These are **optional** and only needed if you enable Stripe billing:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

## Deployment

```bash
vercel deploy
```

## License

MIT

---

Made with 💛 by Sean G
