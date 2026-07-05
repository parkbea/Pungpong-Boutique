import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const POLLINATIONS_ENDPOINT = "https://image.pollinations.ai/prompt";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const SIZE = 1024;
const FETCH_TIMEOUT_MS = 55_000;
const MAX_PROMPT_LENGTH = 2400;
const MAX_REFERENCE_DATA_URL_LENGTH = 2_800_000;

type GenerateRequest = {
  prompt?: unknown;
  referenceImageDataUrl?: unknown;
};

export async function POST(req: Request) {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const prompt = body.prompt;
  const referenceImage = validateReferenceImage(body.referenceImageDataUrl);

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "프롬프트가 비어 있습니다." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json({ error: "프롬프트가 너무 깁니다." }, { status: 400 });
  }

  if (referenceImage instanceof NextResponse) {
    return referenceImage;
  }

  if (referenceImage) {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!geminiKey) {
      return NextResponse.json(
        { error: "사진 기반 생성에는 GEMINI_API_KEY가 필요합니다. Google AI Studio에서 API 키를 발급해 .env.local에 설정해 주세요." },
        { status: 500 },
      );
    }
    if (!looksLikeGeminiApiKey(geminiKey)) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 올바른 Gemini API 키 형식이 아닙니다. Google AI Studio에서 발급한 AIza... 형태의 키를 넣어 주세요." },
        { status: 401 },
      );
    }

    try {
      const dataUrl = await generateWithGeminiImage({
        apiKey: geminiKey,
        prompt: prompt.trim(),
        referenceImage,
      });
      return NextResponse.json({ dataUrl });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const status = /401|API key|PERMISSION_DENIED|UNAUTHENTICATED/i.test(message)
        ? 401
        : /timeout|aborted|AbortError/i.test(message)
          ? 504
          : 502;
      return NextResponse.json({ error: message }, { status });
    }
  }

  return generateWithPollinations(prompt.trim());
}

function validateReferenceImage(value: unknown): string | null | NextResponse {
  if (typeof value !== "string" || value.length === 0) return null;

  if (!/^data:image\/(png|jpe?g|webp);base64,/i.test(value)) {
    return NextResponse.json({ error: "참고 사진 형식이 올바르지 않습니다." }, { status: 400 });
  }
  if (value.length > MAX_REFERENCE_DATA_URL_LENGTH) {
    return NextResponse.json(
      { error: "참고 사진 용량이 큽니다. 더 작은 사진으로 다시 업로드해 주세요." },
      { status: 400 },
    );
  }
  return value;
}

function looksLikeGeminiApiKey(key: string): boolean {
  return /^AIza[0-9A-Za-z_-]{20,}$/.test(key.trim());
}

async function generateWithPollinations(prompt: string) {
  const token = process.env.POLLINATIONS_TOKEN;
  const seed = Math.floor(Math.random() * 1_000_000);
  const url = new URL(`${POLLINATIONS_ENDPOINT}/${encodeURIComponent(prompt)}`);
  url.searchParams.set("width", String(SIZE));
  url.searchParams.set("height", String(SIZE));
  url.searchParams.set("seed", String(seed));
  url.searchParams.set("nologo", "true");
  url.searchParams.set("private", "true");
  url.searchParams.set("safe", "true");

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
            : "무료 이미지 서버가 혼잡합니다. 10~20초 후 다시 시도하거나 POLLINATIONS_TOKEN을 설정해 주세요.",
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

async function generateWithGeminiImage({
  apiKey,
  prompt,
  referenceImage,
}: {
  apiKey: string;
  prompt: string;
  referenceImage: string;
}): Promise<string> {
  const parsed = parseDataUrl(referenceImage);

  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: "gemini-3.1-flash-image",
      input: [
        { type: "text", text: prompt },
        {
          type: "image",
          data: parsed.data,
          mime_type: parsed.mimeType,
        },
      ],
      response_format: {
        type: "image",
        mime_type: "image/jpeg",
        aspect_ratio: "1:1",
        image_size: "1K",
      },
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const body = await res.text();

  if (!res.ok) {
    const detail = extractErrorMessage(body);
    throw new Error(
      detail
        ? `참고 사진 이미지 생성에 실패했습니다. (HTTP ${res.status}) ${detail}`
        : `참고 사진 이미지 생성에 실패했습니다. (HTTP ${res.status})`,
    );
  }

  if (contentType.startsWith("image/")) {
    return `data:${contentType};base64,${Buffer.from(body, "binary").toString("base64")}`;
  }

  const json = JSON.parse(body) as unknown;
  const found = findBase64Image(json);
  if (!found) {
    throw new Error("Gemini 응답에서 생성된 이미지를 찾지 못했습니다.");
  }
  return `data:${found.mimeType};base64,${found.data}`;
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/i);
  if (!match) {
    throw new Error("참고 사진 형식이 올바르지 않습니다.");
  }
  return {
    mimeType: match[1].toLowerCase().replace("image/jpg", "image/jpeg"),
    data: match[2],
  };
}

function extractErrorMessage(text: string): string {
  try {
    const json = JSON.parse(text) as { error?: { message?: string } };
    return json.error?.message ?? "";
  } catch {
    return text.slice(0, 240);
  }
}

function findBase64Image(value: unknown): { data: string; mimeType: string } | null {
  if (!value || typeof value !== "object") return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findBase64Image(item);
      if (found) return found;
    }
    return null;
  }

  const obj = value as Record<string, unknown>;
  const mimeType =
    typeof obj.mime_type === "string"
      ? obj.mime_type
      : typeof obj.mimeType === "string"
        ? obj.mimeType
        : typeof obj.mime === "string"
          ? obj.mime
          : undefined;

  if (typeof obj.data === "string" && mimeType?.startsWith("image/")) {
    return { data: obj.data, mimeType };
  }

  for (const nested of Object.values(obj)) {
    const found = findBase64Image(nested);
    if (found) return found;
  }
  return null;
}
