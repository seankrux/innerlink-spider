import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Internal Link Finder — Discover SEO Linking Opportunities",
  description:
    "Analyze your website to find internal linking opportunities. Discover pages that should link to each other to boost SEO rankings.",
  authors: [{ name: "Sean G" }],
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-zinc-950 text-zinc-50`}>{children}</body>
    </html>
  );
}
