"use client";

import { motion } from "framer-motion";

const STEPS = ["옷 종류", "디테일", "AI 생성"];

export default function StepIndicator({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <nav aria-label="진행 단계" className="mx-auto flex w-full max-w-md items-center">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => n < step && onStepClick(n)}
              disabled={n >= step}
              className={`group flex flex-col items-center gap-1.5 ${
                done ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors duration-300 ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : done
                      ? "border-ink/60 bg-ink/5 text-ink group-hover:bg-ink/10"
                      : "border-ink/20 text-ink/35"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                ) : (
                  n
                )}
                {active && (
                  <motion.span
                    layoutId="step-ring"
                    className="absolute -inset-1.5 rounded-full border border-ink/25"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
              </span>
              <span
                className={`text-[11px] tracking-wide whitespace-nowrap sm:text-xs ${
                  active ? "font-semibold text-ink" : done ? "text-ink/70" : "text-ink/35"
                }`}
              >
                {label}
              </span>
            </button>
            {n < STEPS.length && (
              <div className="relative mx-2 mb-5 h-px flex-1 bg-ink/15 sm:mx-3">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-ink"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
