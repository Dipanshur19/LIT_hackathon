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
  title: "Noted — Study once. Post everywhere.",
  description:
    "Noted turns a student creator's study notes into a ready-to-post content pack: carousel, reel script, caption and hashtags — in their own voice.",
  keywords: ["studygram", "student creator", "content generator", "AI SaaS", "exam prep"],
  openGraph: {
    title: "Noted — Study once. Post everywhere.",
    description:
      "Turn your study notes into a ready-to-post carousel, reel script, caption and hashtags in seconds.",
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
      <body className="min-h-full flex flex-col bg-[#fafafa] text-zinc-900">{children}</body>
    </html>
  );
}
