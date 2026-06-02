import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

interface PageData {
  url: string;
  title: string;
  headings: string[];
  bodyText: string;
  outboundLinks: string[];
}

interface LinkOpportunity {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  context: string;
  score: number;
  type: "heading-match" | "body-match" | "title-match";
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

const STOP_WORDS = new Set([
  "this",
  "that",
  "with",
  "from",
  "have",
  "will",
  "been",
  "they",
  "their",
  "there",
  "where",
  "when",
  "what",
  "which",
  "your",
  "about",
  "more",
  "some",
  "into",
  "also",
  "than",
  "then",
  "were",
  "would",
]);

function getKeywords(text: string): Set<string> {
  return new Set(tokenize(text).filter((w) => !STOP_WORDS.has(w)));
}

function extractContext(bodyText: string, keyword: string): string {
  const lower = bodyText.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());
  if (idx === -1) return "";
  const start = Math.max(0, idx - 80);
  const end = Math.min(bodyText.length, idx + keyword.length + 80);
  let snippet = bodyText.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < bodyText.length) snippet = snippet + "...";
  return snippet;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  a.forEach((w) => {
    if (b.has(w)) intersection++;
  });
  return intersection / (a.size + b.size - intersection);
}

async function fetchPage(
  url: string,
  controller: AbortController,
): Promise<PageData | null> {
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "InternalLinkSpider/1.0 (+https://innerlink-spider.vercel.app)",
        Accept: "text/html",
      },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
      : url;

    const headingMatches = [
      ...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi),
    ];
    const headings = headingMatches
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean);

    const bodyMatch = html.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
    const bodyRaw = bodyMatch ? bodyMatch[1] : html;
    const bodyText = bodyRaw
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    const linkMatches = [...html.matchAll(/href=["']([^"']+)["']/gi)];
    const base = new URL(url);
    const outboundLinks = linkMatches
      .map((m) => {
        try {
          const resolved = new URL(m[1], url);
          if (
            resolved.hostname === base.hostname &&
            resolved.pathname !== base.pathname
          ) {
            return resolved.href.split("#")[0].split("?")[0];
          }
        } catch {
          /* skip */
        }
        return null;
      })
      .filter((l): l is string => l !== null);

    return {
      url,
      title,
      headings,
      bodyText,
      outboundLinks: [...new Set(outboundLinks)],
    };
  } catch {
    return null;
  }
}

async function fetchSitemap(
  baseUrl: string,
  controller: AbortController,
): Promise<string[]> {
  const candidates = [
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap_index.xml`,
    `${baseUrl}/sitemap.xml.gz`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) continue;
      const text = await res.text();
      const locs = [...text.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) =>
        m[1].trim(),
      );
      if (locs.length > 0) return locs.slice(0, 50);
    } catch {
      /* try next */
    }
  }
  return [];
}

export async function POST(req: NextRequest) {
  let body: { url: string; maxPages?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { url, maxPages = 20 } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let baseUrl: string;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    baseUrl = `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    // 1. Discover pages via sitemap or homepage links
    let pageUrls = await fetchSitemap(baseUrl, controller);

    if (pageUrls.length === 0) {
      const home = await fetchPage(baseUrl, controller);
      if (!home) {
        return NextResponse.json(
          {
            error: "Could not fetch the website. Check the URL and try again.",
          },
          { status: 422 },
        );
      }
      pageUrls = [baseUrl, ...home.outboundLinks.slice(0, maxPages - 1)];
    } else {
      pageUrls = pageUrls.slice(0, maxPages);
    }

    // 2. Fetch pages concurrently (batch of 5)
    const pages: PageData[] = [];
    for (let i = 0; i < pageUrls.length; i += 5) {
      const batch = pageUrls.slice(i, i + 5);
      const results = await Promise.all(
        batch.map((u) => fetchPage(u, controller)),
      );
      results.forEach((p) => {
        if (p) pages.push(p);
      });
    }

    if (pages.length < 2) {
      return NextResponse.json({
        opportunities: [],
        pagesScanned: pages.length,
        message: "Not enough pages found to analyze linking opportunities.",
      });
    }

    // 3. Analyze linking opportunities
    const opportunities: LinkOpportunity[] = [];

    for (const source of pages) {
      const sourceKws = getKeywords(
        `${source.title} ${source.headings.join(" ")}`,
      );

      for (const target of pages) {
        if (source.url === target.url) continue;
        if (source.outboundLinks.includes(target.url)) continue;

        const targetKws = getKeywords(
          `${target.title} ${target.headings.join(" ")}`,
        );
        const similarity = jaccardSimilarity(sourceKws, targetKws);

        // Find matching keywords that appear in source body but target is about
        const matchingWords = [...targetKws].filter(
          (w) => source.bodyText.toLowerCase().includes(w) && w.length > 4,
        );

        if (matchingWords.length === 0 && similarity < 0.1) continue;

        const topMatch = matchingWords.sort((a, b) => b.length - a.length)[0];
        if (!topMatch && similarity < 0.15) continue;

        const anchorText = topMatch
          ? target.title.toLowerCase().includes(topMatch)
            ? target.title.slice(0, 60)
            : topMatch
          : target.title.slice(0, 60);

        const context = topMatch
          ? extractContext(source.bodyText, topMatch)
          : source.headings[0] || source.bodyText.slice(0, 160);

        const score =
          Math.round(
            (matchingWords.length * 10 +
              similarity * 50 +
              (topMatch?.length ?? 0)) *
              10,
          ) / 10;

        const type: LinkOpportunity["type"] = source.headings.some((h) =>
          h.toLowerCase().includes(topMatch || ""),
        )
          ? "heading-match"
          : matchingWords.length > 2
            ? "body-match"
            : "title-match";

        opportunities.push({
          sourceUrl: source.url,
          targetUrl: target.url,
          anchorText,
          context: context || `${source.title} could reference ${target.title}`,
          score,
          type,
        });
      }
    }

    // Deduplicate and sort by score
    const seen = new Set<string>();
    const unique = opportunities
      .filter((o) => {
        const key = `${o.sourceUrl}|${o.targetUrl}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    return NextResponse.json({
      opportunities: unique,
      pagesScanned: pages.length,
      totalFound: unique.length,
    });
  } finally {
    clearTimeout(timeout);
  }
}
