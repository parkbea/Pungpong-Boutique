"use client";

import { motion } from "framer-motion";
import { ColorOption, Option } from "@/lib/design";
import { isLight } from "@/lib/silhouette";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold tracking-wide text-ink/70">
        {label}
      </p>
      {children}
    </div>
  );
}

/** Segmented single-select button group. */
export function SegmentGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-ink/10 bg-white/70 p-1 shadow-sm"
    >
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={`relative rounded-lg px-3.5 py-2 text-sm transition-colors duration-200 sm:py-1.5 ${
              selected ? "text-paper" : "text-ink/65 hover:text-ink"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 rounded-lg bg-ink shadow"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{opt.ko}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select toggle chips (for details). */
export function ToggleChips<T extends string>({
  options,
  values,
  onToggle,
}: {
  options: Option<T>[];
  values: T[];
  onToggle: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = values.includes(opt.id);
        return (
          <motion.button
            key={opt.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.94 }}
            className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 sm:py-1.5 ${
              selected
                ? "border-ink bg-ink text-paper shadow"
                : "border-ink/15 bg-white/70 text-ink/65 hover:border-ink/40 hover:text-ink"
            }`}
          >
            {opt.ko}
          </motion.button>
        );
      })}
    </div>
  );
}

/** Round color swatches. */
export function ColorChips({
  colors,
  value,
  onChange,
}: {
  colors: ColorOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label="색상" className="flex flex-wrap gap-2.5">
      {colors.map((c) => {
        const selected = c.id === value;
        return (
          <motion.button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={c.ko}
            title={c.ko}
            onClick={() => onChange(c.id)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            className={`relative h-9 w-9 rounded-full border shadow-sm transition-shadow ${
              selected ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
            } ${isLight(c.hex) ? "border-ink/20" : "border-transparent"}`}
            style={{ backgroundColor: c.hex }}
          >
            {selected && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                viewBox="0 0 16 16"
                className="absolute inset-0 m-auto h-4 w-4"
                fill="none"
                stroke={isLight(c.hex) ? "#23211F" : "#FFFFFF"}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8.5 6.5 12 13 4.5" />
              </motion.svg>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
