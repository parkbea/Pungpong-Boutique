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
  title: "뿡뽕의상실 - AI 의상 디자인 스튜디오",
  description:
    "옷 종류, 핏, 색상, 소재, 소품을 고르면 AI가 의상 디자인 이미지를 생성합니다.",
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
