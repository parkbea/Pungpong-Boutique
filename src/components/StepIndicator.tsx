"use client";

import { motion } from "framer-motion";

const STEPS = ["사진·무드", "형태", "색·소재", "스타일링", "생성"];

export default function StepIndicator({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <nav aria-label="디자인 진행 단계" className="mx-auto w-full max-w-3xl">
      <ol className="grid grid-cols-5 gap-1 rounded-2xl border border-ink/10 bg-white/70 p-1 shadow-sm backdrop-blur">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => n < step && onStepClick(n)}
                disabled={n >= step}
                className={`relative flex h-12 w-full items-center justify-center rounded-xl text-xs font-semibold transition-colors sm:text-sm ${
                  active
                    ? "text-paper"
                    : done
                      ? "text-ink/75 hover:bg-ink/5"
                      : "text-ink/35"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="step-pill"
                    className="absolute inset-0 rounded-xl bg-ink shadow-md"
                    transition={{ type: "spring", stiffness: 360, damping: 34 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
