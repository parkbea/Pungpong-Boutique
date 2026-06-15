import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// Pollinations.ai — 무료 텍스트→이미지 생성.
// 서버에서 호출하므로 브라우저 캡차(Turnstile) 요구를 피한다.
// POLLINATIONS_TOKEN(무료 발급, 카드 불필요)을 .env에 넣으면 동시요청 제한이 크게 완화된다.
const ENDPOINT = "https://image.pollinations.ai/prompt";
const SIZE = 1024;
const FETCH_TIMEOUT_MS = 55_000;

export async function POST(req: Request) {
  let prompt: unknown;
  try {
    ({ prompt } = await req.json());
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "프롬프트가 비어 있습니다." }, { status: 400 });
  }
  if (prompt.length > 2000) {
    return NextResponse.json({ error: "프롬프트가 너무 깁니다." }, { status: 400 });
  }

  const token = process.env.POLLINATIONS_TOKEN;
  const seed = Math.floor(Math.random() * 1_000_000);
  const url =
    `${ENDPOINT}/${encodeURIComponent(prompt.trim())}` +
    `?width=${SIZE}&height=${SIZE}&seed=${seed}&nologo=true`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "image/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });

    if (res.status === 402 || res.status === 429) {
      return NextResponse.json(
        {
          error: token
            ? "잠시 요청이 많습니다. 10초쯤 후 다시 시도해 주세요."
            : "무료 이미지 서버가 혼잡합니다. 10~20초 후 다시 시도하거나, 안정적으로 쓰려면 무료 POLLINATIONS_TOKEN을 설정해 주세요.",
        },
        { status: 429 },
      );
    }
    if (res.status === 403) {
      return NextResponse.json(
        { error: "이미지 서버 접근이 거부되었습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 },
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: `이미지 생성 서버 오류입니다. (HTTP ${res.status}) 다시 시도해 주세요.` },
        { status: 502 },
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지를 받지 못했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1024) {
      return NextResponse.json(
        { error: "이미지가 정상적으로 생성되지 않았습니다. 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      dataUrl: `data:${contentType};base64,${buffer.toString("base64")}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (/timeout|aborted|AbortError/i.test(message)) {
      return NextResponse.json(
        { error: "이미지 생성이 지연되고 있습니다. 잠시 후 다시 시도해 주세요." },
        { status: 504 },
      );
    }
    console.error("[/api/generate]", err);
    return NextResponse.json(
      { error: "이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
