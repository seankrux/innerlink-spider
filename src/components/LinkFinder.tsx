"use client";

import { useState, useCallback, useMemo } from "react";

interface LinkOpportunity {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  context: string;
  score: number;
  type: "heading-match" | "body-match" | "title-match";
}

type FilterType = "all" | "heading-match" | "body-match" | "title-match";
type SortKey = "score" | "source" | "target";

const PAGE_SIZE = 10;

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  "heading-match": {
    label: "Heading",
    color: "text-violet-300 bg-violet-500/10 border-violet-500/20",
  },
  "body-match": {
    label: "Body",
    color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  },
  "title-match": {
    label: "Title",
    color: "text-sky-300 bg-sky-500/10 border-sky-500/20",
  },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, (score / 120) * 100);
  const color =
    pct > 66 ? "bg-emerald-500" : pct > 33 ? "bg-amber-500" : "bg-sky-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-zinc-500 w-8 text-right">{score}</span>
    </div>
  );
}

export default function LinkFinder() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<LinkOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagesScanned, setPagesScanned] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortKey>("score");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(20);
  const [isReal, setIsReal] = useState(false);

  const handleAnalyze = useCallback(async () => {
    setError("");
    setLoading(true);
    setScanned(false);
    setResults([]);
    setPage(1);
    setIsReal(false);

    let targetUrl = url.trim();
    if (!targetUrl) {
      setError("Please enter a URL to analyze.");
      setLoading(false);
      return;
    }
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }
    try {
      new URL(targetUrl);
    } catch {
      setError("Please enter a valid URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, maxPages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setResults(data.opportunities || []);
      setPagesScanned(data.pagesScanned || 0);
      setIsReal(true);
      setScanned(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [url, maxPages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) handleAnalyze();
    },
    [handleAnalyze, loading],
  );

  const handleExportCSV = useCallback(() => {
    if (results.length === 0) return;
    const rows = [
      [
        "Score",
        "Type",
        "Source Page",
        "Target Page",
        "Suggested Anchor Text",
        "Context",
      ],
      ...results.map((r) => [
        String(r.score),
        r.type,
        r.sourceUrl,
        r.targetUrl,
        r.anchorText,
        r.context,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "internal-link-opportunities.csv",
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [results]);

  const handleExportJSON = useCallback(() => {
    if (results.length === 0) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "internal-link-opportunities.json",
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [results]);

  const filtered = useMemo(() => {
    let out = results;
    if (filter !== "all") out = out.filter((r) => r.type === filter);
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.sourceUrl.toLowerCase().includes(q) ||
          r.targetUrl.toLowerCase().includes(q) ||
          r.anchorText.toLowerCase().includes(q),
      );
    }
    if (sort === "score") out = [...out].sort((a, b) => b.score - a.score);
    else if (sort === "source")
      out = [...out].sort((a, b) => a.sourceUrl.localeCompare(b.sourceUrl));
    else if (sort === "target")
      out = [...out].sort((a, b) => a.targetUrl.localeCompare(b.targetUrl));
    return out;
  }, [results, filter, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const typeCounts = useMemo(() => {
    const c: Record<string, number> = {
      all: results.length,
      "heading-match": 0,
      "body-match": 0,
      "title-match": 0,
    };
    results.forEach((r) => {
      c[r.type] = (c[r.type] || 0) + 1;
    });
    return c;
  }, [results]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Input */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl ring-1 ring-white/10 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            id="site-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="flex-1 p-3 bg-zinc-800/80 ring-1 ring-zinc-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all text-zinc-50 placeholder:text-zinc-500"
            disabled={loading}
          />
          <div className="flex gap-2">
            <select
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
              disabled={loading}
              className="px-3 py-3 bg-zinc-800/80 ring-1 ring-zinc-700 rounded-lg text-zinc-300 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value={10}>10 pages</option>
              <option value={20}>20 pages</option>
              <option value={35}>35 pages</option>
              <option value={50}>50 pages</option>
            </select>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 rounded-lg hover:from-cyan-400 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold whitespace-nowrap flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {loading && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? "Crawling..." : "Analyze Site"}
            </button>
          </div>
        </div>
        <p className="text-zinc-600 text-xs">
          Crawls your sitemap or homepage links — real results, no demo data.
        </p>
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 ring-1 ring-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl ring-1 ring-white/10 p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 ring-1 ring-cyan-500/20 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-cyan-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-50 mb-1">
            Crawling your site...
          </h3>
          <p className="text-zinc-500 text-sm">
            Fetching pages, analyzing content, scoring opportunities
          </p>
        </div>
      )}

      {/* Results */}
      {scanned && !loading && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Pages Scanned",
                value: pagesScanned,
                color: "text-cyan-400",
              },
              {
                label: "Opportunities",
                value: results.length,
                color: "text-emerald-400",
              },
              {
                label: "Heading Matches",
                value: typeCounts["heading-match"],
                color: "text-violet-400",
              },
              {
                label: "Body Matches",
                value: typeCounts["body-match"],
                color: "text-amber-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-zinc-900/80 ring-1 ring-white/10 rounded-xl p-4 text-center"
              >
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {isReal && (
            <div className="bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-lg p-3 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <p className="text-emerald-300 text-sm">
                Live crawl — results from your actual site ({pagesScanned} pages
                analyzed)
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl ring-1 ring-white/10 p-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                  type="search"
                  placeholder="Search opportunities..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="flex-1 px-3 py-2 bg-zinc-800/80 ring-1 ring-zinc-700 rounded-lg text-zinc-200 placeholder:text-zinc-600 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as FilterType);
                    setPage(1);
                  }}
                  className="px-3 py-2 bg-zinc-800/80 ring-1 ring-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none"
                >
                  <option value="all">All types ({typeCounts.all})</option>
                  <option value="heading-match">
                    Heading ({typeCounts["heading-match"]})
                  </option>
                  <option value="body-match">
                    Body ({typeCounts["body-match"]})
                  </option>
                  <option value="title-match">
                    Title ({typeCounts["title-match"]})
                  </option>
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="px-3 py-2 bg-zinc-800/80 ring-1 ring-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none"
                >
                  <option value="score">Sort: Score</option>
                  <option value="source">Sort: Source</option>
                  <option value="target">Sort: Target</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 ring-1 ring-white/10 text-sm font-medium flex items-center gap-1.5 transition-all"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    CSV
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 ring-1 ring-white/10 text-sm font-medium flex items-center gap-1.5 transition-all"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    JSON
                  </button>
                </div>
              </div>

              <p className="text-zinc-600 text-xs mb-4">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} ·
                page {page} of {Math.max(1, totalPages)}
              </p>

              {/* Rows */}
              <div className="space-y-3">
                {paginated.map((result, i) => {
                  const typeStyle = TYPE_LABELS[result.type] || {
                    label: result.type,
                    color: "text-zinc-400 bg-zinc-800 border-zinc-700",
                  };
                  return (
                    <div
                      key={`${result.sourceUrl}-${result.targetUrl}-${i}`}
                      className="ring-1 ring-zinc-800 rounded-lg p-4 hover:ring-zinc-600 hover:bg-zinc-800/30 transition-all"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-600">
                            #{(page - 1) * PAGE_SIZE + i + 1}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeStyle.color}`}
                          >
                            {typeStyle.label}
                          </span>
                        </div>
                        <div className="w-32">
                          <ScoreBar score={result.score} />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 mb-3">
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Source
                          </span>
                          <p
                            className="text-sm text-cyan-400 truncate mt-0.5"
                            title={result.sourceUrl}
                          >
                            {result.sourceUrl}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Target
                          </span>
                          <p
                            className="text-sm text-cyan-400 truncate mt-0.5"
                            title={result.targetUrl}
                          >
                            {result.targetUrl}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Anchor
                          </span>
                          <p className="text-sm font-semibold text-zinc-100 mt-0.5">
                            &ldquo;{result.anchorText}&rdquo;
                          </p>
                        </div>
                      </div>
                      <div className="bg-zinc-800/60 ring-1 ring-zinc-700/50 p-3 rounded-lg text-sm text-zinc-400 leading-relaxed">
                        <span className="font-medium text-zinc-300">
                          Context:{" "}
                        </span>
                        {result.context}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 disabled:opacity-40 text-sm transition-all"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    const p =
                      totalPages <= 7
                        ? i + 1
                        : page <= 4
                          ? i + 1
                          : page >= totalPages - 3
                            ? totalPages - 6 + i
                            : page - 3 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm transition-all ${p === page ? "bg-cyan-500 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 disabled:opacity-40 text-sm transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {results.length === 0 && (
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl ring-1 ring-white/10 p-10 text-center">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold text-zinc-50 mb-1">
                No opportunities found
              </h3>
              <p className="text-zinc-500 text-sm">
                Your site&apos;s internal linking looks complete, or more pages
                may need to be crawled.
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!scanned && !loading && (
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl ring-1 ring-white/10 p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 ring-1 ring-zinc-700 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-50 mb-1">
            Ready to crawl
          </h3>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Enter your website URL and click Analyze Site to find real internal
            linking gaps using live crawl data.
          </p>
        </div>
      )}
    </div>
  );
}
