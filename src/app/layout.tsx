import type { Metadata, Viewport } from "next";
// Fonts are bundled via npm (@fontsource) instead of next/font/google so the
// build never needs to reach fonts.gstatic.com — networks that block gstatic
// (e.g. some corporate firewalls) would otherwise fail to compile.
import "@fontsource/noto-sans-kr/latin-400.css";
import "@fontsource/noto-sans-kr/latin-500.css";
import "@fontsource/noto-sans-kr/latin-600.css";
import "@fontsource/noto-sans-kr/latin-700.css";
import "@fontsource/noto-sans-kr/korean-400.css";
import "@fontsource/noto-sans-kr/korean-500.css";
import "@fontsource/noto-sans-kr/korean-600.css";
import "@fontsource/noto-sans-kr/korean-700.css";
import "@fontsource/noto-serif-kr/latin-400.css";
import "@fontsource/noto-serif-kr/latin-600.css";
import "@fontsource/noto-serif-kr/latin-700.css";
import "@fontsource/noto-serif-kr/korean-400.css";
import "@fontsource/noto-serif-kr/korean-600.css";
import "@fontsource/noto-serif-kr/korean-700.css";
import "./globals.css";
import Pwa from "@/components/Pwa";

export const metadata: Metadata = {
  title: "뿡뽕의상실 — AI 여성복 디자인 스튜디오",
  description:
    "옷 종류와 핏, 소매, 넥라인, 색상, 소재, 신발을 고르면 AI가 나만의 여성복 디자인을 화보로 완성해 드립니다.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "뿡뽕의상실",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {children}
        <Pwa />
      </body>
    </html>
  );
}
