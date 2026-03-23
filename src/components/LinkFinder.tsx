"use client";

import { useState, useCallback } from "react";
import { analyzeLinks, LinkOpportunity } from "@/lib/linkAnalyzer";

export default function LinkFinder() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<LinkOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanned, setScanned] = useState(false);

  const handleAnalyze = useCallback(async () => {
    setError("");
    setLoading(true);
    setScanned(false);
    setResults([]);

    try {
      let targetUrl = url.trim();
      if (!targetUrl) {
        setError("Please enter a URL to analyze.");
        setLoading(false);
        return;
      }

      if (
        !targetUrl.startsWith("http://") &&
        !targetUrl.startsWith("https://")
      ) {
        targetUrl = "https://" + targetUrl;
      }

      try {
        new URL(targetUrl);
      } catch {
        setError("Please enter a valid URL (e.g. https://example.com).");
        setLoading(false);
        return;
      }

      // Simulate analysis delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const opportunities = analyzeLinks(targetUrl);
      setResults(opportunities);
      setScanned(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        handleAnalyze();
      }
    },
    [handleAnalyze, loading]
  );

  const handleExport = useCallback(() => {
    if (results.length === 0) return;

    const csvContent = [
      ["Source Page", "Target Page", "Suggested Anchor Text", "Context"],
      ...results.map((r) => [r.sourceUrl, r.targetUrl, r.anchorText, r.context]),
    ]
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "internal-link-opportunities.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  }, [results]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl ring-1 ring-white/10 p-6 mb-6">
        <label
          htmlFor="site-url"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Website URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="site-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="flex-1 p-3 bg-zinc-800/80 ring-1 ring-zinc-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 text-zinc-50 placeholder:text-zinc-500"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 rounded-lg hover:from-cyan-400 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold whitespace-nowrap flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
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
            {loading ? "Analyzing..." : "Analyze Site"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 ring-1 ring-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Loading State — Skeleton */}
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
            Analyzing your site...
          </h3>
          <p className="text-zinc-500 text-sm mb-6">
            Scanning pages and finding link opportunities
          </p>
          {/* Skeleton rows */}
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-4 w-3/5" />
          </div>
        </div>
      )}

      {/* Demo Notice */}
      {scanned && !loading && (
        <div className="bg-amber-500/10 ring-1 ring-amber-500/20 rounded-lg p-4 mb-6">
          <p className="text-amber-300 text-sm">
            <strong>Demo Mode:</strong> Showing sample results to illustrate the
            tool. In production, this crawls your site and finds real internal
            linking gaps using content analysis.
          </p>
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && !loading && (
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl ring-1 ring-white/10 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-zinc-50">
                {results.length} Opportunities Found
              </h2>
              <p className="text-zinc-500 text-sm mt-0.5">
                Pages that should link to each other
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-zinc-800 text-zinc-50 rounded-lg hover:bg-zinc-700 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-200 text-sm font-medium flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
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
              Export CSV
            </button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={`${result.sourceUrl}-${result.targetUrl}`}
                className="ring-1 ring-zinc-800 rounded-lg p-4 hover:ring-zinc-700 hover:bg-zinc-800/50 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
                  <span className="bg-zinc-800 text-zinc-400 font-medium px-2 py-0.5 rounded ring-1 ring-zinc-700">
                    #{index + 1}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Source Page
                    </span>
                    <p
                      className="text-sm text-cyan-400 truncate mt-0.5"
                      title={result.sourceUrl}
                    >
                      {result.sourceUrl}
                    </p>
                  </div>
                  <div className="min-w-0 flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Target Page
                      </span>
                      <p
                        className="text-sm text-cyan-400 truncate mt-0.5"
                        title={result.targetUrl}
                      >
                        {result.targetUrl}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Suggested Anchor
                    </span>
                    <p className="text-sm font-semibold text-zinc-50 mt-0.5">
                      &ldquo;{result.anchorText}&rdquo;
                    </p>
                  </div>
                </div>
                <div className="bg-zinc-800/60 ring-1 ring-zinc-700/50 p-3 rounded-lg text-sm text-zinc-400 leading-relaxed">
                  <span className="font-medium text-zinc-300">Context: </span>
                  {result.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State — before any scan */}
      {!scanned && !loading && results.length === 0 && (
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
            Ready to analyze
          </h3>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Enter a website URL above and click &ldquo;Analyze Site&rdquo; to
            find internal pages that should link to each other.
          </p>
        </div>
      )}
    </div>
  );
}
