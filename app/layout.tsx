import Header from "../components/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://doubledagproductions.com"),
  title: "Double Dag Productions | Video Editing & Post-Production",
  description:
    "Emmy-recognized video editor Ben Bacharach-White. Documentary, branded, and cinematic post-production.",
  // TODO: swap banner2.png for a proper 1200x630 social-share still.
  openGraph: {
    title: "Double Dag Productions | Video Editing & Post-Production",
    description:
      "Emmy-recognized video editor Ben Bacharach-White. Documentary, branded, and cinematic post-production.",
    images: ["/banner2.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body className="min-h-full flex flex-col">
  <Header />

  <main className="flex-1">
    {children}
  </main>

  {/* 🔥 Footer Logo */}
  <footer className="flex flex-col items-center py-10">
    <img
      src="/Doubledag-Logo-Digital-Glitch2.webp"
      alt="Double Dag Logo"
      className="w-24 md:w-32 opacity-70 transition duration-500 hover:opacity-100"
    />
    <p className="mt-4 text-center text-xs text-neutral-500">
      © 2026 Double Dag Productions. All rights reserved.
    </p>
  </footer>
</body>
    </html>
  );
}