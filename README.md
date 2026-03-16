# Internal Link Finder

A micro-SaaS tool for finding internal linking opportunities on your website.

## Features

- Enter website URL or sitemap
- Analyzes pages for internal linking opportunities
- Shows: Source page → Target page → Anchor text suggestions
- Export results as CSV
- Free: 1 site scan/day
- Pro: Unlimited scans ($12/month)

## Tech Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Cheerio for HTML parsing
- Client-side crawling (respects robots.txt)
- Deploy-ready to Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

## Deployment

```bash
vercel
```

## License

MIT
