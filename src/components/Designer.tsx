"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BACKGROUNDS,
  CARRIES,
  CARRY_STYLES,
  COLLARS,
  COLORS,
  DEFAULT_DESIGN,
  DETAILS,
  Design,
  DetailId,
  FITS,
  GARMENTS,
  GarmentId,
  MATERIALS,
  NECKLINES,
  PATTERNS,
  SHOES,
  SLEEVES,
  SOCK_LENGTHS,
  STYLE_PRESETS,
  StylePresetId,
  applyStylePreset,
  buildPrompt,
  colorOf,
  detailOptionsFor,
  isDressLike,
  labelOf,
  lengthOptionsFor,
  materialOptionsFor,
  shoeColorOf,
  shoeOptionsFor,
} from "@/lib/design";
import GarmentIcon from "./GarmentIcon";
import Preview from "./Preview";
import StepIndicator from "./StepIndicator";
import { ColorChips, Field, SegmentGroup, ToggleChips } from "./controls";

type Phase = "idle" | "loading" | "done" | "error";

type ReferencePhoto = {
  dataUrl: string;
  name: string;
};

const MAX_STEP = 5;

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -28 }),
};

export default function Designer() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN);
  const [referencePhoto, setReferencePhoto] = useState<ReferencePhoto | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastGenerationKeyRef = useRef<string | null>(null);
  const loadingRef = useRef(false);

  const prompt = buildPrompt(design);
  const finalPrompt = useMemo(
    () => buildFinalPrompt(prompt, Boolean(referencePhoto)),
    [prompt, referencePhoto],
  );
  const generationKey = `${finalPrompt}|photo:${referencePhoto?.dataUrl.length ?? 0}:${referencePhoto?.dataUrl.slice(0, 80) ?? ""}`;

  const goTo = useCallback((next: number) => {
    const bounded = Math.min(MAX_STEP, Math.max(1, next));
    setStep((cur) => {
      setDir(bounded > cur ? 1 : -1);
      return bounded;
    });
  }, []);

  const update = useCallback(<K extends keyof Design>(key: K, value: Design[K]) => {
    setDesign((d) => ({ ...d, [key]: value }));
  }, []);

  const applyPreset = useCallback((preset: StylePresetId) => {
    setDesign((d) => applyStylePreset(d, preset));
  }, []);

  const selectGarment = useCallback((garment: GarmentId) => {
    setDesign((d) => {
      const validLength = lengthOptionsFor(garment).some((o) => o.id === d.length);
      const allowedDetails = new Set(detailOptionsFor(garment).map((o) => o.id));
      const materials = materialOptionsFor(garment);
      const materialOk = materials.some((m) => m.id === d.material);
      const shoeOk = shoeOptionsFor(garment).some((s) => s.id === d.shoe);

      return {
        ...d,
        garment,
        length: validLength ? d.length : lengthOptionsFor(garment)[0].id,
        details: d.details.filter((x) => allowedDetails.has(x)),
        material: materialOk ? d.material : materials[0].id,
        shoe: shoeOk ? d.shoe : "none",
      };
    });
  }, []);

  const toggleDetail = useCallback((id: DetailId) => {
    setDesign((d) => ({
      ...d,
      details: d.details.includes(id)
        ? d.details.filter((x) => x !== id)
        : [...d.details, id],
    }));
  }, []);

  const generate = useCallback(
    async (currentPrompt: string, currentKey: string) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setPhase("loading");
      setError(null);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: currentPrompt,
            referenceImageDataUrl: referencePhoto?.dataUrl,
          }),
        });
        const data = (await res.json().catch(() => null)) as
          | { dataUrl?: string; error?: string }
          | null;

        if (!res.ok || !data?.dataUrl) {
          throw new Error(data?.error ?? `이미지 생성에 실패했습니다. (HTTP ${res.status})`);
        }

        lastGenerationKeyRef.current = currentKey;
        setImage(data.dataUrl);
        setPhase("done");
      } catch (e) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
        setPhase("error");
      } finally {
        loadingRef.current = false;
      }
    },
    [referencePhoto],
  );

  useEffect(() => {
    if (
      step === MAX_STEP &&
      !loadingRef.current &&
      lastGenerationKeyRef.current !== generationKey
    ) {
      void generate(finalPrompt, generationKey);
    }
  }, [step, finalPrompt, generationKey, generate]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <StepIndicator step={step} onStepClick={goTo} />

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-8">
        <section className="order-2 min-w-0 rounded-3xl border border-ink/8 bg-white/62 p-4 shadow-[0_18px_50px_-28px_rgba(35,33,31,0.22)] backdrop-blur sm:p-6 lg:order-1">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              {step === 1 && (
                <StepMood
                  applyPreset={applyPreset}
                  referencePhoto={referencePhoto}
                  photoError={photoError}
                  onPhotoChange={(photo) => {
                    setPhotoError(null);
                    setReferencePhoto(photo);
                    lastGenerationKeyRef.current = null;
                  }}
                  onPhotoError={setPhotoError}
                />
              )}
              {step === 2 && (
                <StepShape
                  design={design}
                  selectGarment={selectGarment}
                  update={update}
                />
              )}
              {step === 3 && <StepSurface design={design} update={update} />}
              {step === 4 && (
                <StepStyling
                  design={design}
                  update={update}
                  toggleDetail={toggleDetail}
                />
              )}
              {step === 5 && (
                <StepResult
                  phase={phase}
                  image={image}
                  error={error}
                  loading={phase === "loading"}
                  hasReferencePhoto={Boolean(referencePhoto)}
                  onRegenerate={() => {
                    lastGenerationKeyRef.current = null;
                    void generate(finalPrompt, generationKey);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button type="button" onClick={() => goTo(step - 1)} className="soft-button">
                이전
              </button>
            ) : (
              <span />
            )}
            {step < MAX_STEP && (
              <button type="button" onClick={() => goTo(step + 1)} className="primary-button">
                {step === 4 ? "AI 이미지 생성" : "다음"}
              </button>
            )}
          </div>
        </section>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
          <PreviewPanel design={design} prompt={finalPrompt} referencePhoto={referencePhoto} />
        </aside>
      </div>
    </div>
  );
}

function StepMood({
  applyPreset,
  referencePhoto,
  photoError,
  onPhotoChange,
  onPhotoError,
}: {
  applyPreset: (preset: StylePresetId) => void;
  referencePhoto: ReferencePhoto | null;
  photoError: string | null;
  onPhotoChange: (photo: ReferencePhoto | null) => void;
  onPhotoError: (message: string | null) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="사진과 분위기"
        title="인물 사진을 올리고, 전체 무드를 먼저 잡아요."
        sub="사진을 올리면 AI에게 이 사람의 얼굴, 자세, 체형은 유지하고 옷만 새 디자인으로 입히도록 요청합니다."
      />

      <div className="mb-6">
        <PhotoUploader
          referencePhoto={referencePhoto}
          photoError={photoError}
          onPhotoChange={onPhotoChange}
          onPhotoError={onPhotoError}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset.id)}
            className="group rounded-2xl border border-ink/10 bg-paper/70 p-4 text-left transition hover:border-ink/35 hover:bg-white hover:shadow-md"
          >
            <span className="text-lg font-semibold text-ink">{preset.ko}</span>
            <span className="mt-2 block text-sm leading-relaxed text-ink/55">
              {preset.id === "romantic" && "프릴, 플로럴, 부드러운 컬러를 먼저 깔아둡니다."}
              {preset.id === "minimal" && "선이 단정하고 색 대비가 분명한 착장으로 시작합니다."}
              {preset.id === "vintage" && "체크, 코듀로이, 포켓처럼 손맛 있는 분위기입니다."}
              {preset.id === "casual" && "데일리한 소재와 편한 소품을 중심으로 잡습니다."}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhotoUploader({
  referencePhoto,
  photoError,
  onPhotoChange,
  onPhotoError,
}: {
  referencePhoto: ReferencePhoto | null;
  photoError: string | null;
  onPhotoChange: (photo: ReferencePhoto | null) => void;
  onPhotoError: (message: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="rounded-2xl border border-dashed border-ink/18 bg-white/72 p-4">
      <div className="grid gap-4 sm:grid-cols-[136px_minmax(0,1fr)] sm:items-center">
        <div className="aspect-[3/4] overflow-hidden rounded-xl border border-ink/10 bg-paper">
          {referencePhoto ? (
            <img
              src={referencePhoto.dataUrl}
              alt="업로드한 참고 인물 사진"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs leading-relaxed text-ink/40">
              참고 사진 없음
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">인물 사진 업로드</p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed break-keep text-ink/55">
            사진은 브라우저에서 작게 압축한 뒤 생성 요청에만 사용합니다. 결과는 원본 사진을
            완전히 보존하는 합성이 아니라, AI가 참고해서 다시 그리는 방식입니다.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="primary-button cursor-pointer">
              {busy ? "사진 준비 중" : referencePhoto ? "사진 바꾸기" : "사진 선택"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                disabled={busy}
                onChange={async (event) => {
                  const file = event.currentTarget.files?.[0];
                  event.currentTarget.value = "";
                  if (!file) return;
                  setBusy(true);
                  onPhotoError(null);
                  try {
                    const dataUrl = await compressImage(file);
                    onPhotoChange({ dataUrl, name: file.name });
                  } catch (e) {
                    onPhotoError(e instanceof Error ? e.message : "사진을 불러오지 못했습니다.");
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
            {referencePhoto && (
              <button type="button" className="soft-button" onClick={() => onPhotoChange(null)}>
                사진 제거
              </button>
            )}
          </div>
          {referencePhoto && (
            <p className="mt-2 truncate text-xs text-ink/42">{referencePhoto.name}</p>
          )}
          {photoError && <p className="mt-2 text-sm text-red-600">{photoError}</p>}
        </div>
      </div>
    </div>
  );
}

function StepShape({
  design,
  selectGarment,
  update,
}: {
  design: Design;
  selectGarment: (g: GarmentId) => void;
  update: <K extends keyof Design>(key: K, value: Design[K]) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="옷의 골격"
        title="종류, 핏, 길이를 먼저 정리해요."
        sub="프리뷰의 실루엣이 가장 크게 바뀌는 단계입니다."
      />
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {GARMENTS.map((g) => {
            const selected = g.id === design.garment;
            return (
              <motion.button
                key={g.id}
                type="button"
                onClick={() => selectGarment(g.id)}
                whileTap={{ scale: 0.97 }}
                className={`group flex min-h-28 flex-col items-center justify-center gap-1 rounded-2xl border bg-white/80 p-3 transition ${
                  selected
                    ? "border-ink shadow-[0_12px_28px_-16px_rgba(35,33,31,0.45)]"
                    : "border-ink/10 hover:border-ink/35"
                }`}
              >
                <GarmentIcon
                  garment={g.id}
                  className={`h-16 w-auto ${selected ? "text-ink" : "text-ink/45 group-hover:text-ink/70"}`}
                />
                <span className="text-sm font-medium text-ink/75">{g.ko}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="핏">
            <SegmentGroup name="핏" options={FITS} value={design.fit} onChange={(v) => update("fit", v)} />
          </Field>
          <Field label={isDressLike(design.garment) ? "기장" : "길이"}>
            <SegmentGroup name="길이" options={lengthOptionsFor(design.garment)} value={design.length} onChange={(v) => update("length", v)} />
          </Field>
          {design.garment !== "leggings" && (
            <>
              <Field label="소매">
                <SegmentGroup name="소매" options={SLEEVES} value={design.sleeve} onChange={(v) => update("sleeve", v)} />
              </Field>
              <Field label="넥라인">
                <SegmentGroup name="넥라인" options={NECKLINES} value={design.neckline} onChange={(v) => update("neckline", v)} />
              </Field>
              <Field label="칼라">
                <SegmentGroup name="칼라" options={COLLARS} value={design.collar} onChange={(v) => update("collar", v)} />
              </Field>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StepSurface({
  design,
  update,
}: {
  design: Design;
  update: <K extends keyof Design>(key: K, value: Design[K]) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="색과 촉감"
        title="색상, 패턴, 소재를 한 번에 맞춰요."
        sub="의상 자체의 인상이 결정되는 단계라 미리보기를 보면서 고르는 게 좋습니다."
      />
      <div className="space-y-6">
        <Field label="메인 색상">
          <ColorChips colors={COLORS} value={design.colorId} onChange={(v) => update("colorId", v)} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="패턴">
            <SegmentGroup name="패턴" options={PATTERNS} value={design.pattern} onChange={(v) => update("pattern", v)} />
          </Field>
          <Field label="소재">
            <SegmentGroup name="소재" options={materialOptionsFor(design.garment)} value={design.material} onChange={(v) => update("material", v)} />
          </Field>
        </div>
        <AnimatePresence initial={false}>
          {design.pattern !== "solid" && (
            <motion.div
              key="pattern-color"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Field label="패턴 색상">
                <ColorChips colors={COLORS} value={design.patternColorId} onChange={(v) => update("patternColorId", v)} />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepStyling({
  design,
  update,
  toggleDetail,
}: {
  design: Design;
  update: <K extends keyof Design>(key: K, value: Design[K]) => void;
  toggleDetail: (id: DetailId) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="마지막 스타일링"
        title="장식, 신발, 소품, 배경을 더해요."
        sub="필수 요소는 위에서 끝났고, 여기서는 착장 분위기를 풍성하게 만드는 옵션만 모았습니다."
      />
      <div className="space-y-6">
        <Field label="디테일">
          <ToggleChips options={detailOptionsFor(design.garment)} values={design.details} onToggle={toggleDetail} />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="신발">
            <SegmentGroup name="신발" options={shoeOptionsFor(design.garment)} value={design.shoe} onChange={(v) => update("shoe", v)} />
          </Field>
          <Field label="배경">
            <SegmentGroup name="배경" options={BACKGROUNDS} value={design.background} onChange={(v) => update("background", v)} />
          </Field>
        </div>

        {design.shoe !== "none" && (
          <Field label="신발 색상">
            <ColorChips colors={COLORS} value={design.shoeColorId} onChange={(v) => update("shoeColorId", v)} />
          </Field>
        )}

        <Field label="양말">
          <button
            type="button"
            onClick={() => update("socksEnabled", !design.socksEnabled)}
            className={design.socksEnabled ? "primary-button" : "soft-button"}
          >
            {design.socksEnabled ? "양말 포함" : "양말 추가"}
          </button>
          {design.socksEnabled && (
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-ink/50">양말 색상</p>
                <ColorChips colors={COLORS} value={design.socksColorId} onChange={(v) => update("socksColorId", v)} />
              </div>
              <div>
                <p className="mb-2 text-xs text-ink/50">양말 길이</p>
                <SegmentGroup name="양말 길이" options={SOCK_LENGTHS} value={design.socksLength} onChange={(v) => update("socksLength", v)} />
              </div>
            </div>
          )}
        </Field>

        <Field label="가방 / 소품">
          <ToggleChips
            options={CARRIES.filter((carry) => carry.id !== "none")}
            values={design.carry}
            onToggle={(id) =>
              update(
                "carry",
                design.carry.includes(id)
                  ? design.carry.filter((carry) => carry !== id)
                  : [...design.carry, id],
              )
            }
          />
        </Field>

        {design.carry.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="소품 스타일">
              <SegmentGroup name="소품 스타일" options={CARRY_STYLES} value={design.carryStyle} onChange={(v) => update("carryStyle", v)} />
            </Field>
            <Field label="소품 색상">
              <ColorChips colors={COLORS} value={design.carryColorId} onChange={(v) => update("carryColorId", v)} />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function StepResult({
  phase,
  image,
  error,
  loading,
  hasReferencePhoto,
  onRegenerate,
}: {
  phase: Phase;
  image: string | null;
  error: string | null;
  loading: boolean;
  hasReferencePhoto: boolean;
  onRegenerate: () => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="AI 이미지"
        title={hasReferencePhoto ? "사진 속 사람이 새 옷을 입은 이미지로 만들고 있어요." : "선택한 디자인으로 이미지를 만들고 있어요."}
        sub="완성 후에도 이전 단계로 돌아가 수정하면 새 이미지로 다시 생성됩니다."
      />

      <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_18px_50px_-20px_rgba(35,33,31,0.2)]">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <div className="shimmer absolute inset-0" />
              <motion.div
                className="relative h-12 w-12 rounded-full border-2 border-ink/15 border-t-ink"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              />
              <p className="relative px-6 text-center text-sm text-ink/55">
                이미지를 생성하는 중입니다. 참고 사진을 쓰면 조금 더 걸릴 수 있어요.
              </p>
            </motion.div>
          )}

          {phase === "error" && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
            >
              <p className="text-sm leading-relaxed text-ink/70">{error}</p>
              <button type="button" onClick={onRegenerate} className="primary-button">
                다시 시도
              </button>
            </motion.div>
          )}

          {phase === "done" && image && !loading && (
            <motion.img
              key={image.slice(-32)}
              src={image}
              alt="AI가 생성한 의상 디자인"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>

      {phase === "done" && image && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <button type="button" onClick={onRegenerate} disabled={loading} className="soft-button disabled:opacity-50">
            다시 생성
          </button>
          <a href={image} download="ppungppong-design.jpg" className="primary-button">
            이미지 다운로드
          </a>
        </motion.div>
      )}
    </div>
  );
}

function PreviewPanel({
  design,
  prompt,
  referencePhoto,
}: {
  design: Design;
  prompt: string;
  referencePhoto: ReferencePhoto | null;
}) {
  const summary = useMemo(() => buildSummary(design, referencePhoto), [design, referencePhoto]);

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/8 bg-white/82 shadow-[0_24px_70px_-30px_rgba(35,33,31,0.25)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-ink/40 uppercase">Live Styling Board</p>
          <h2 className="mt-1 font-serif text-xl text-ink">{labelOf(GARMENTS, design.garment)}</h2>
        </div>
        <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">
          실시간
        </span>
      </div>

      {referencePhoto && (
        <div className="border-b border-ink/8 bg-white/55 px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src={referencePhoto.dataUrl}
              alt="참고 인물 사진"
              className="h-14 w-11 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink/75">참고 사진 사용 중</p>
              <p className="truncate text-xs text-ink/42">{referencePhoto.name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[linear-gradient(180deg,#fbf8ef_0%,#f4eee2_100%)] px-5 pt-4">
        <div className="mx-auto max-w-[280px]">
          <Preview design={design} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-2">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-ink/8 bg-paper/70 px-3 py-2">
              <p className="text-[11px] text-ink/42">{item.label}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-ink/80">{item.value}</p>
            </div>
          ))}
        </div>

        <details className="group rounded-2xl border border-ink/8 bg-paper/70 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink/65">
            AI 프롬프트
            <span className="text-xs text-ink/35 group-open:hidden">열기</span>
            <span className="hidden text-xs text-ink/35 group-open:inline">닫기</span>
          </summary>
          <div className="mt-3 border-t border-ink/8 pt-3">
            <div className="mb-2 flex justify-end">
              <CopyButton text={prompt} />
            </div>
            <motion.p
              key={prompt}
              initial={{ opacity: 0.45 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[11px] leading-relaxed break-words text-ink/65"
            >
              {prompt}
            </motion.p>
          </div>
        </details>
      </div>
    </div>
  );
}

function buildSummary(design: Design, referencePhoto: ReferencePhoto | null) {
  const detailLabels = design.details
    .map((id) => DETAILS.find((o) => o.id === id)?.ko)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
  const carryLabels = design.carry
    .map((id) => CARRIES.find((o) => o.id === id)?.ko)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  return [
    { label: "사진", value: referencePhoto ? "인물 사진 적용" : "디자인만 생성" },
    { label: "핏 / 길이", value: `${labelOf(FITS, design.fit)} · ${labelOf(lengthOptionsFor(design.garment), design.length)}` },
    { label: "색 / 패턴", value: `${colorOf(design).ko} · ${labelOf(PATTERNS, design.pattern)}` },
    { label: "소재", value: labelOf(MATERIALS, design.material) },
    { label: "신발", value: design.shoe === "none" ? "없음" : `${shoeColorOf(design).ko} ${labelOf(SHOES, design.shoe)}` },
    { label: "디테일", value: detailLabels || carryLabels || "깔끔하게" },
  ];
}

function StepHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <header className="mb-6">
      <p className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-ink/38 uppercase">{eyebrow}</p>
      <h1 className="max-w-2xl font-serif text-2xl leading-tight text-ink sm:text-[30px]">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed break-keep text-ink/55">{sub}</p>
    </header>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="text-[11px] font-semibold text-ink/45 transition-colors hover:text-ink"
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

function buildFinalPrompt(basePrompt: string, hasReferencePhoto: boolean): string {
  if (!hasReferencePhoto) return basePrompt;

  return [
    "Use the uploaded reference photo as the person reference.",
    "Keep the same person, face, body shape, skin tone, hair, pose, and camera angle as much as possible.",
    "Replace only the outfit with the clothing design described below.",
    "The person must be fully clothed, age-appropriate, non-sexual, natural, and realistic.",
    "Do not change the person's identity. Do not add revealing clothing.",
    `Outfit design: ${basePrompt}`,
  ].join(" ");
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 업로드할 수 있습니다."));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error("12MB 이하의 사진을 올려 주세요."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("사진을 읽지 못했습니다."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("사진을 불러오지 못했습니다."));
      image.onload = () => {
        const maxSide = 720;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("사진을 처리하지 못했습니다."));
          return;
        }
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
