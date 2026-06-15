"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  COLLARS,
  COLORS,
  DEFAULT_DESIGN,
  Design,
  DetailId,
  FITS,
  GARMENTS,
  GarmentId,
  NECKLINES,
  PATTERNS,
  SLEEVES,
  buildPrompt,
  detailOptionsFor,
  isDressLike,
  lengthOptionsFor,
  materialOptionsFor,
  shoeOptionsFor,
} from "@/lib/design";
import Preview from "./Preview";
import GarmentIcon from "./GarmentIcon";
import StepIndicator from "./StepIndicator";
import { ColorChips, Field, SegmentGroup, ToggleChips } from "./controls";

type Phase = "idle" | "loading" | "done" | "error";

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -36 }),
};

export default function Designer() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN);

  const [phase, setPhase] = useState<Phase>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastPromptRef = useRef<string | null>(null);
  const loadingRef = useRef(false);

  const prompt = buildPrompt(design);

  const goTo = useCallback((next: number) => {
    setStep((cur) => {
      setDir(next > cur ? 1 : -1);
      return next;
    });
  }, []);

  const update = useCallback(<K extends keyof Design>(key: K, value: Design[K]) => {
    setDesign((d) => ({ ...d, [key]: value }));
  }, []);

  const selectGarment = useCallback(
    (garment: GarmentId) => {
      setDesign((d) => {
        const valid = lengthOptionsFor(garment).some((o) => o.id === d.length);
        const allowed = new Set(detailOptionsFor(garment).map((o) => o.id));
        const mats = materialOptionsFor(garment);
        const materialOk = mats.some((m) => m.id === d.material);
        const shoeOk = shoeOptionsFor(garment).some((s) => s.id === d.shoe);
        return {
          ...d,
          garment,
          length: valid ? d.length : "midi",
          details: d.details.filter((x) => allowed.has(x)),
          material: materialOk ? d.material : mats[0].id,
          shoe: shoeOk ? d.shoe : "none",
        };
      });
    },
    [],
  );

  const toggleDetail = useCallback((id: DetailId) => {
    setDesign((d) => ({
      ...d,
      details: d.details.includes(id)
        ? d.details.filter((x) => x !== id)
        : [...d.details, id],
    }));
  }, []);

  const generate = useCallback(async (currentPrompt: string) => {
    if (loadingRef.current) return; // 중복 클릭 방지
    loadingRef.current = true;
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      const data = (await res.json().catch(() => null)) as
        | { dataUrl?: string; error?: string }
        | null;
      if (!res.ok || !data?.dataUrl) {
        throw new Error(data?.error ?? `요청이 실패했습니다. (HTTP ${res.status})`);
      }
      lastPromptRef.current = currentPrompt;
      setImage(data.dataUrl);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      setPhase("error");
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // 3단계 진입 시(또는 디자인이 바뀐 채 재진입 시) 자동 생성
  useEffect(() => {
    if (step === 3 && !loadingRef.current && lastPromptRef.current !== prompt) {
      void generate(prompt);
    }
  }, [step, prompt, generate]);

  const loading = phase === "loading";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <StepIndicator step={step} onStepClick={goTo} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-10">
        {/* ---- left: step content ---- */}
        <div className="order-2 min-w-0 lg:order-1">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.section
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {step === 1 && (
                <StepGarment
                  value={design.garment}
                  onSelect={(g) => {
                    selectGarment(g);
                    setTimeout(() => goTo(2), 220);
                  }}
                />
              )}
              {step === 2 && (
                <StepDetails
                  design={design}
                  update={update}
                  toggleDetail={toggleDetail}
                />
              )}
              {step === 3 && (
                <StepResult
                  phase={phase}
                  image={image}
                  error={error}
                  loading={loading}
                  onRegenerate={() => {
                    lastPromptRef.current = null;
                    void generate(prompt);
                  }}
                />
              )}
            </motion.section>
          </AnimatePresence>

          {/* nav */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink/70 transition-colors hover:border-ink/50 hover:text-ink"
              >
                ← 이전
              </button>
            ) : (
              <span />
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                className="rounded-full bg-ink px-7 py-2.5 text-sm font-medium text-paper shadow-md transition-transform hover:scale-[1.03] active:scale-95"
              >
                {step === 2 ? "AI 이미지 생성 →" : "다음 →"}
              </button>
            )}
          </div>
        </div>

        {/* ---- right: live preview (작은 화면에서는 위로) ---- */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-ink/8 bg-white/80 p-4 shadow-[0_18px_50px_-20px_rgba(35,33,31,0.18)] backdrop-blur sm:p-5">
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="font-serif text-lg text-ink">실시간 미리보기</h2>
              <span className="text-xs text-ink/45">
                {GARMENTS.find((g) => g.id === design.garment)?.ko}
              </span>
            </div>
            <div className="mx-auto max-w-[240px] lg:max-w-none">
              <Preview design={design} />
            </div>
            <div className="mt-3 rounded-2xl border border-ink/8 bg-paper p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-widest text-ink/45 uppercase">
                  Image Prompt
                </p>
                <CopyButton text={prompt} />
              </div>
              <motion.p
                key={prompt}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[11.5px] leading-relaxed break-keep text-ink/70"
              >
                {prompt}
              </motion.p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- step 1 ---------- */

function StepGarment({
  value,
  onSelect,
}: {
  value: GarmentId;
  onSelect: (g: GarmentId) => void;
}) {
  return (
    <div>
      <StepHeading
        title="어떤 옷을 만들까요?"
        sub="디자인할 옷의 종류를 선택해 주세요."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {GARMENTS.map((g) => {
          const selected = g.id === value;
          return (
            <motion.button
              key={g.id}
              type="button"
              onClick={() => onSelect(g.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              className={`group flex flex-col items-center gap-1 rounded-2xl border bg-white/80 p-4 pb-3 shadow-sm transition-[border-color,box-shadow] duration-200 ${
                selected
                  ? "border-ink shadow-[0_12px_30px_-12px_rgba(35,33,31,0.35)]"
                  : "border-ink/10 hover:border-ink/35 hover:shadow-md"
              }`}
            >
              <GarmentIcon
                garment={g.id}
                className={`h-24 w-auto transition-colors duration-200 ${
                  selected ? "text-ink" : "text-ink/45 group-hover:text-ink/70"
                }`}
              />
              <span
                className={`text-sm ${selected ? "font-semibold text-ink" : "text-ink/65"}`}
              >
                {g.ko}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- step 2 ---------- */

function StepDetails({
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
        title="디테일을 다듬어 볼까요?"
        sub="선택할 때마다 오른쪽 미리보기와 프롬프트가 함께 바뀝니다."
      />
      <div className="space-y-6">
        <Field label="핏">
          <SegmentGroup
            name="핏"
            options={FITS}
            value={design.fit}
            onChange={(v) => update("fit", v)}
          />
        </Field>
        <Field label={isDressLike(design.garment) ? "기장 (미니 · 미디 · 맥시)" : "기장"}>
          <SegmentGroup
            name="기장"
            options={lengthOptionsFor(design.garment)}
            value={design.length}
            onChange={(v) => update("length", v)}
          />
        </Field>
        {design.garment !== "leggings" && (
          <>
            <Field label="소매">
              <SegmentGroup
                name="소매"
                options={SLEEVES}
                value={design.sleeve}
                onChange={(v) => update("sleeve", v)}
              />
            </Field>
            <Field label="넥라인">
              <SegmentGroup
                name="넥라인"
                options={NECKLINES}
                value={design.neckline}
                onChange={(v) => update("neckline", v)}
              />
            </Field>
            <Field label="깃 (칼라)">
              <SegmentGroup
                name="칼라"
                options={COLLARS}
                value={design.collar}
                onChange={(v) => update("collar", v)}
              />
            </Field>
          </>
        )}
        <Field label="색상">
          <ColorChips
            colors={COLORS}
            value={design.colorId}
            onChange={(v) => update("colorId", v)}
          />
        </Field>
        <Field label="패턴">
          <SegmentGroup
            name="패턴"
            options={PATTERNS}
            value={design.pattern}
            onChange={(v) => update("pattern", v)}
          />
          <AnimatePresence initial={false}>
            {design.pattern !== "solid" && (
              <motion.div
                key="pattern-color"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="mt-3 mb-2 text-xs text-ink/50">패턴 색상</p>
                <div className="p-1">
                  <ColorChips
                    colors={COLORS}
                    value={design.patternColorId}
                    onChange={(v) => update("patternColorId", v)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Field>
        <Field label="소재">
          <SegmentGroup
            name="소재"
            options={materialOptionsFor(design.garment)}
            value={design.material}
            onChange={(v) => update("material", v)}
          />
        </Field>
        <Field label="디테일 (중복 선택 가능)">
          <ToggleChips
            options={detailOptionsFor(design.garment)}
            values={design.details}
            onToggle={toggleDetail}
          />
        </Field>
        <Field label="신발">
          <SegmentGroup
            name="신발"
            options={shoeOptionsFor(design.garment)}
            value={design.shoe}
            onChange={(v) => update("shoe", v)}
          />
          <AnimatePresence initial={false}>
            {design.shoe !== "none" && (
              <motion.div
                key="shoe-color"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="mt-3 mb-2 text-xs text-ink/50">신발 색상</p>
                <div className="p-1">
                  <ColorChips
                    colors={COLORS}
                    value={design.shoeColorId}
                    onChange={(v) => update("shoeColorId", v)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Field>
      </div>
    </div>
  );
}

/* ---------- step 3 ---------- */

function StepResult({
  phase,
  image,
  error,
  loading,
  onRegenerate,
}: {
  phase: Phase;
  image: string | null;
  error: string | null;
  loading: boolean;
  onRegenerate: () => void;
}) {
  return (
    <div>
      <StepHeading
        title="AI가 디자인을 완성하고 있어요"
        sub="AI가 선택하신 디테일로 스튜디오 화보를 생성합니다."
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
              <p className="relative text-sm text-ink/55">
                이미지를 생성하는 중입니다… (10~20초)
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
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
                ⚠️
              </span>
              <p className="text-sm leading-relaxed text-ink/70">{error}</p>
              <button
                type="button"
                onClick={onRegenerate}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-transform hover:scale-[1.03] active:scale-95"
              >
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
          <button
            type="button"
            onClick={onRegenerate}
            disabled={loading}
            className="rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink/75 transition-colors hover:border-ink/50 hover:text-ink disabled:opacity-50"
          >
            ↺ 재생성
          </button>
          <a
            href={image}
            download="ppungppong-design.jpg"
            className="rounded-full bg-ink px-7 py-2.5 text-sm font-medium text-paper shadow-md transition-transform hover:scale-[1.03] active:scale-95"
          >
            ↓ 이미지 다운로드
          </a>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- shared ---------- */

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-serif text-2xl text-ink sm:text-[28px]">{title}</h1>
      <p className="mt-1.5 text-sm text-ink/55">{sub}</p>
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
      className="text-[11px] text-ink/45 transition-colors hover:text-ink"
    >
      {copied ? "복사됨 ✓" : "복사"}
    </button>
  );
}
