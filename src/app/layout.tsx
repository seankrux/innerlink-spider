import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Internal Link Finder",
  description: "Find internal linking opportunities on your website",
  authors: [{ name: "Sean G" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
