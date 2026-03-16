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

    try {
      // Validate URL
      let targetUrl = url.trim();
      if (!targetUrl) {
        setError("Please enter a URL");
        setLoading(false);
        return;
      }

      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        targetUrl = "https://" + targetUrl;
      }

      try {
        new URL(targetUrl);
      } catch {
        setError("Please enter a valid URL");
        setLoading(false);
        return;
      }

      // Note: In production, this would crawl the site
      // For demo purposes, we'll show sample data
      const opportunities = analyzeLinks(targetUrl);
      
      setResults(opportunities);
      setScanned(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleExport = useCallback(() => {
    if (results.length === 0) return;

    const csvContent = [
      ["Source Page", "Target Page", "Suggested Anchor Text", "Context"],
      ...results.map((r) => [r.sourceUrl, r.targetUrl, r.anchorText, r.context]),
    ]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url_obj = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url_obj;
    a.download = "internal-link-opportunities.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url_obj);
  }, [results]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Enter your website URL
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
          >
            {loading ? "Analyzing..." : "Analyze Site"}
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Free: 1 scan/day • Pro: Unlimited scans
        </p>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Demo Notice */}
      {scanned && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>Demo Mode:</strong> This is a demonstration with sample data. 
            In production, this would crawl your website and find real internal linking opportunities.
          </p>
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Found {results.length} opportunities
            </h2>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              Export CSV
            </button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase">
                      Source Page
                    </span>
                    <p className="text-sm text-blue-600 truncate">
                      {result.sourceUrl}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase">
                      Target Page
                    </span>
                    <p className="text-sm text-blue-600 truncate">
                      {result.targetUrl}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase">
                      Suggested Anchor
                    </span>
                    <p className="text-sm font-medium text-slate-900">
                      {result.anchorText}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded text-sm text-slate-600">
                  <span className="font-medium">Context:</span> {result.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
