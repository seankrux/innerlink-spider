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

InnerLink Spider is a focused internal link analysis tool for SEO professionals, growth teams, and technical marketers. It analyzes a website URL or sitemap to uncover linking gaps that strengthen site architecture, reinforce topical clusters, and improve crawl paths. The output is execution-ready: source pages, target pages, suggested anchor text, and exportable CSV recommendations.

## Preview

> [View the live application →](https://innerlink-spider.vercel.app)

## Why InnerLink Spider?

Most internal linking workflows are still buried inside technical crawlers, scripts, or general-purpose SEO platforms. InnerLink Spider stands out by delivering a dedicated, browser-based experience for internal link analysis, making it easier to demo, review, and act on opportunities without relying on terminal-heavy workflows.

- Built for the web, not just for power users comfortable with CLI tools
- Focused on one high-value SEO workflow: finding internal links worth adding
- Produces action-ready recommendations instead of raw crawl data alone
- Fast to evaluate for client work, content audits, and portfolio demonstrations

## Features

- **URL and Sitemap Analysis** — Start with a domain homepage or sitemap to kick off internal link discovery
- **Link Opportunity Detection** — Surfaces pages that should link to one another based on relevance and site structure
- **Anchor Text Suggestions** — Recommends source pages, target pages, and suggested anchor phrases
- **CSV Export** — Downloads opportunities in a handoff-friendly format for implementation
- **Demo Mode** — Makes the product easy to evaluate with realistic sample data and polished UX
- **Clean Web UI** — Presents findings in an approachable interface designed for marketers and SEO operators

## How It Works

The current public demo returns representative sample opportunities, but the intended internal link discovery workflow follows a straightforward analysis pipeline:

1. **Crawl and collect pages**  
   Start from a homepage or sitemap, discover crawlable internal URLs, and normalize them to remove duplicates caused by protocol, trailing slash, or path variations.
2. **Build the internal link graph**  
   Parse each page, extract its outgoing internal links, and map the site as a graph so the tool can understand which pages are connected, isolated, or underlinked.
3. **Identify gaps and opportunities**  
   Compare page connectivity with page topics and on-page mentions to flag orphan-page candidates, weak content clusters, and source pages that mention concepts already covered elsewhere on the site but do not link to them.
4. **Recommend implementation-ready links**  
   Generate suggested source-target pairs, anchor text, and contextual snippets so teams can prioritize the highest-value internal links and export the recommendations as CSV.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm 9+ or later

### Installation

```bash
git clone https://github.com/seankrux/innerlink-spider.git
cd innerlink-spider
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

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

## Contributing

Contributions are welcome, especially around crawl accuracy, graph analysis, UX polish, and export workflows.

1. Fork the repository and create a focused feature branch.
2. Install dependencies with `npm install`.
3. Run the app locally with `npm run dev`.
4. Validate production readiness with `npm run build`.
5. Open a pull request with a concise summary of the problem solved and the approach taken.

## License

[MIT](LICENSE)

---

<p align="center">Made with 💛 by Sean G</p>
