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

    const blob = new Blob([csvContent], { type: "text/csv" });
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
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 mb-6">
        <label
          htmlFor="site-url"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Website URL
        </label>
        <div className="flex gap-3">
          <input
            id="site-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-slate-900 placeholder:text-slate-400"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap flex items-center gap-2"
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
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600 animate-spin"
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
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Analyzing your site...
          </h3>
          <p className="text-slate-500 text-sm">
            Scanning pages and finding link opportunities
          </p>
        </div>
      )}

      {/* Demo Notice */}
      {scanned && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>Demo Mode:</strong> Showing sample results to illustrate the
            tool. In production, this crawls your site and finds real internal
            linking gaps using content analysis.
          </p>
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && !loading && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {results.length} Opportunities Found
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Pages that should link to each other
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2"
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
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                  <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                    #{index + 1}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Source Page
                    </span>
                    <p
                      className="text-sm text-blue-600 truncate mt-0.5"
                      title={result.sourceUrl}
                    >
                      {result.sourceUrl}
                    </p>
                  </div>
                  <div className="min-w-0 flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Target Page
                      </span>
                      <p
                        className="text-sm text-blue-600 truncate mt-0.5"
                        title={result.targetUrl}
                      >
                        {result.targetUrl}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Suggested Anchor
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      &ldquo;{result.anchorText}&rdquo;
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 leading-relaxed">
                  <span className="font-medium text-slate-700">Context: </span>
                  {result.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State — before any scan */}
      {!scanned && !loading && results.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
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
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Ready to analyze
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Enter a website URL above and click &ldquo;Analyze Site&rdquo; to
            find internal pages that should link to each other.
          </p>
        </div>
      )}
    </div>
  );
}
