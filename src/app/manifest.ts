import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "뿡뽕의상실 — AI 여성복 디자인 스튜디오",
    short_name: "뿡뽕의상실",
    description:
      "옷 종류와 핏·소매·넥라인·색상·소재·신발을 고르면 AI가 여성복 디자인을 화보로 완성해 드립니다.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#FAF8F3",
    theme_color: "#23211F",
    lang: "ko",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
