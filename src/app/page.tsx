import { Metadata } from "next";
import LinkFinder from "@/components/LinkFinder";

export const metadata: Metadata = {
  title: "Internal Link Finder — Discover SEO Linking Opportunities",
  description:
    "Analyze your website to find internal linking opportunities. Discover pages that should link to each other to boost SEO rankings.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero gradient accent */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-cyan-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.15),transparent)] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-24 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Free SEO Tool
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-50 mb-6 text-balance leading-tight">
            Find Internal Linking
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-3 max-w-2xl mx-auto">
            Enter your website URL and instantly discover pages that should link
            to each other but don&apos;t — boosting your SEO with zero backlink
            outreach.
          </p>
          <p className="text-zinc-500 text-sm">
            No sign-up required. Results in seconds.
          </p>
        </div>

        {/* Tool */}
        <LinkFinder />

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-2xl font-bold text-zinc-50 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-14 h-14 bg-cyan-500/10 ring-1 ring-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-200 group-hover:bg-cyan-500/20 group-hover:scale-105">
                <span className="text-2xl font-bold bg-gradient-to-br from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  1
                </span>
              </div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Enter Your URL
              </h3>
              <p className="text-zinc-500 text-sm">
                Paste your website address or sitemap URL to start the analysis
              </p>
            </div>

            <div className="text-center group">
              <div className="w-14 h-14 bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-200 group-hover:bg-emerald-500/20 group-hover:scale-105">
                <span className="text-2xl font-bold bg-gradient-to-br from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  2
                </span>
              </div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Analyze Content
              </h3>
              <p className="text-zinc-500 text-sm">
                We scan your pages for keyword mentions that match other
                pages&apos; topics
              </p>
            </div>

            <div className="text-center group">
              <div className="w-14 h-14 bg-violet-500/10 ring-1 ring-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-200 group-hover:bg-violet-500/20 group-hover:scale-105">
                <span className="text-2xl font-bold bg-gradient-to-br from-violet-400 to-violet-300 bg-clip-text text-transparent">
                  3
                </span>
              </div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Get Suggestions
              </h3>
              <p className="text-zinc-500 text-sm">
                Review linking opportunities with anchor text suggestions, then
                export as CSV
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-24">
          <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl ring-1 ring-white/10 transition-all duration-200 hover:ring-white/20 hover:scale-[1.02]">
            <div className="w-12 h-12 bg-cyan-500/10 ring-1 ring-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-50 mb-2">
              Smart Link Detection
            </h3>
            <p className="text-zinc-500 text-sm">
              Finds pages mentioning keywords that other pages target, surfacing
              natural link opportunities
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl ring-1 ring-white/10 transition-all duration-200 hover:ring-white/20 hover:scale-[1.02]">
            <div className="w-12 h-12 bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-50 mb-2">
              Anchor Text Suggestions
            </h3>
            <p className="text-zinc-500 text-sm">
              Get recommended anchor text for each link based on the
              content context around the match
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl ring-1 ring-white/10 transition-all duration-200 hover:ring-white/20 hover:scale-[1.02]">
            <div className="w-12 h-12 bg-violet-500/10 ring-1 ring-violet-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-violet-400"
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
            </div>
            <h3 className="font-semibold text-zinc-50 mb-2">
              CSV Export
            </h3>
            <p className="text-zinc-500 text-sm">
              Export all opportunities as a CSV file to share with your team or
              implement at your own pace
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative text-center mt-20 py-10 border-t border-zinc-800/60">
        <p className="text-zinc-500 text-sm">
          Made with{" "}
          <span role="img" aria-label="yellow heart">
            💛
          </span>{" "}
          by Sean G
        </p>
      </footer>
    </main>
  );
}
