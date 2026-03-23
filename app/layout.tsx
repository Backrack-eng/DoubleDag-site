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
  title: "Double Dag Productions | Video Editing & Post-Production",
  description:
    "Emmy-recognized video editor Ben Bacharach-White. Documentary, branded, and cinematic post-production.",
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
  <footer className="flex justify-center py-10">
    <img
      src="/Doubledag-Logo-Digital-Glitch2.webp"
      alt="Double Dag Logo"
      className="w-24 md:w-32 opacity-70 transition duration-500 hover:opacity-100"
    />
  </footer>
</body>
    </html>
  );
}