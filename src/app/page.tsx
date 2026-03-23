import { Metadata } from "next";
import LinkFinder from "@/components/LinkFinder";

export const metadata: Metadata = {
  title: "Internal Link Finder - Find Linking Opportunities",
  description: "Discover internal linking opportunities on your website. Find pages that should link to each other to boost SEO.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Internal Link Finder
          </h1>
          <p className="text-xl text-slate-600 mb-4">
            Discover internal linking opportunities to boost your SEO
          </p>
          <p className="text-slate-500">
            Find pages on your site that should link to each other but don&apos;t
          </p>
        </div>

        {/* Tool */}
        <LinkFinder />

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Find Opportunities</h3>
            <p className="text-slate-600 text-sm">Discover pages mentioning keywords that other pages target</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Anchor Text Suggestions</h3>
            <p className="text-slate-600 text-sm">Get recommended anchor text for each internal link</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Robots.txt Respect</h3>
            <p className="text-slate-600 text-sm">Crawler respects robots.txt and crawl rate limits</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 text-slate-500 text-sm">
          Made with 💛 by Sean G
        </footer>
      </div>
    </main>
  );
}
