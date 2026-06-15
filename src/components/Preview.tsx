"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Design, colorOf, patternColorOf, shoeColorOf } from "@/lib/design";
import {
  buildShapes,
  darken,
  isLight,
  VIEW_W,
  VIEW_H,
} from "@/lib/silhouette";

const SPRING = { type: "spring", stiffness: 170, damping: 24 } as const;
const CX = VIEW_W / 2;

export default function Preview({ design }: { design: Design }) {
  const s = buildShapes(design);
  const color = colorOf(design);
  const stroke = isLight(color.hex) ? "rgba(35,33,31,0.4)" : darken(color.hex, 0.3);
  const markColor = isLight(color.hex) ? "rgba(35,33,31,0.5)" : "rgba(255,255,255,0.75)";
  const ink = patternColorOf(design).hex;

  const patternFill =
    design.pattern === "solid" ? "none" : `url(#pat-${design.pattern})`;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full"
      role="img"
      aria-label="의상 실루엣 미리보기"
    >
      <defs>
        <pattern id="pat-stripe" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="7" height="14" fill={ink} fillOpacity="0.55" />
        </pattern>
        <pattern id="pat-check" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="20" fill={ink} fillOpacity="0.3" />
          <rect width="20" height="10" fill={ink} fillOpacity="0.3" />
        </pattern>
        <pattern id="pat-gingham" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="12" fill={ink} fillOpacity="0.32" />
          <rect width="12" height="6" fill={ink} fillOpacity="0.32" />
        </pattern>
        <pattern id="pat-dot" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2.6" fill={ink} fillOpacity="0.65" />
          <circle cx="15" cy="15" r="2.6" fill={ink} fillOpacity="0.65" />
        </pattern>
        <pattern id="pat-floral" width="30" height="30" patternUnits="userSpaceOnUse">
          <g fill={ink} fillOpacity="0.55">
            <circle cx="9" cy="9" r="2.2" />
            <circle cx="13.5" cy="9" r="2.2" />
            <circle cx="11.2" cy="5.5" r="2.2" />
            <circle cx="11.2" cy="12.5" r="2.2" />
            <circle cx="11.2" cy="9" r="1.2" fillOpacity="0.95" />
            <circle cx="24" cy="22" r="1.6" />
          </g>
        </pattern>
        <pattern id="pat-zigzag" width="16" height="11" patternUnits="userSpaceOnUse">
          <path
            d="M0,8 L4,3 L8,8 L12,3 L16,8"
            fill="none"
            stroke={ink}
            strokeOpacity="0.6"
            strokeWidth="1.8"
          />
        </pattern>
        <pattern id="pat-heart" width="22" height="22" patternUnits="userSpaceOnUse">
          <g fill={ink} fillOpacity="0.6">
            <path d={heartPath(6, 6, 4)} />
            <path d={heartPath(17, 17, 4)} />
          </g>
        </pattern>
        <pattern id="pat-star" width="24" height="24" patternUnits="userSpaceOnUse">
          <g fill={ink} fillOpacity="0.65">
            <path d={starPath(6, 6, 4.2, 1.8)} />
            <path d={starPath(18, 18, 4.2, 1.8)} />
          </g>
        </pattern>
        <pattern id="pat-leopard" width="28" height="28" patternUnits="userSpaceOnUse">
          <g fill={ink}>
            <ellipse cx="7" cy="8" rx="3.2" ry="2.2" fillOpacity="0.4" />
            <path d="M3,5 a6,5 0 0 1 8,0" fill="none" stroke={ink} strokeOpacity="0.6" strokeWidth="1.4" />
            <path d="M4,11.5 a5,4 0 0 0 7,-0.5" fill="none" stroke={ink} strokeOpacity="0.6" strokeWidth="1.4" />
            <ellipse cx="20" cy="20" rx="3" ry="2.4" fillOpacity="0.4" />
            <path d="M16,17 a6,5 0 0 1 8,0.5" fill="none" stroke={ink} strokeOpacity="0.6" strokeWidth="1.4" />
            <circle cx="21" cy="6" r="1.4" fillOpacity="0.5" />
            <circle cx="6" cy="21" r="1.4" fillOpacity="0.5" />
          </g>
        </pattern>
      </defs>

      {/* mannequin stand */}
      <g stroke="rgba(35,33,31,0.18)" strokeWidth="2" fill="none">
        {design.garment !== "leggings" && (
          <ellipse cx={CX} cy={s.topY - (design.garment === "hoodie" ? 44 : 16)} rx="11" ry="14" fill="rgba(35,33,31,0.06)" />
        )}
        <line x1={CX} y1={s.hemY} x2={CX} y2={VIEW_H - 14} strokeDasharray="3 5" />
        <line x1={CX - 34} y1={VIEW_H - 12} x2={CX + 34} y2={VIEW_H - 12} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* hood — behind body */}
      <motion.path
        initial={false}
        animate={{ d: s.hoodD, opacity: s.hoodOpacity, fill: color.hex }}
        transition={SPRING}
        stroke={stroke}
        strokeWidth="1.5"
      />

      {/* sleeves */}
      {([s.leftSleeveD, s.rightSleeveD] as const).map((d, i) => (
        <g key={i}>
          <motion.path
            initial={false}
            animate={{ d, opacity: s.sleeveOpacity, fill: color.hex }}
            transition={SPRING}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {patternFill !== "none" && (
            <motion.path
              initial={false}
              animate={{ d, opacity: s.sleeveOpacity }}
              transition={SPRING}
              fill={patternFill}
              stroke="none"
            />
          )}
        </g>
      ))}

      {/* body (상의·원피스) */}
      <motion.path
        initial={false}
        animate={{ d: s.bodyD, fill: color.hex, opacity: s.bodyOpacity }}
        transition={SPRING}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {patternFill !== "none" && (
        <motion.path
          initial={false}
          animate={{ d: s.bodyD, opacity: s.bodyOpacity }}
          transition={SPRING}
          fill={patternFill}
          stroke="none"
        />
      )}

      {/* leggings (하의) */}
      <motion.path
        initial={false}
        animate={{ d: s.leggingsD, fill: color.hex, opacity: s.leggingsOpacity }}
        transition={SPRING}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {patternFill !== "none" && (
        <motion.path
          initial={false}
          animate={{ d: s.leggingsD, opacity: s.leggingsOpacity }}
          transition={SPRING}
          fill={patternFill}
          stroke="none"
        />
      )}
      <motion.line
        initial={false}
        animate={{
          x1: CX - s.leggingsBandHalf,
          x2: CX + s.leggingsBandHalf,
          y1: s.leggingsBandY,
          y2: s.leggingsBandY,
          opacity: s.leggingsOpacity,
        }}
        transition={SPRING}
        stroke={markColor}
        strokeWidth="1.5"
      />

      {/* collar (깃) */}
      <CollarOverlay design={design} s={s} fill={darken(color.hex, 0.12)} accent={darken(color.hex, 0.32)} stroke={stroke} />

      {/* zipper (jumper) */}
      <motion.line
        initial={false}
        animate={{ y1: s.zipY1, y2: s.zipY2, opacity: s.zipOpacity }}
        transition={SPRING}
        x1={CX}
        x2={CX}
        stroke={markColor}
        strokeWidth="2"
        strokeDasharray="4 3"
      />

      {/* kangaroo pocket (hoodie) */}
      <motion.path
        initial={false}
        animate={{ d: s.pocketD, opacity: s.pocketOpacity }}
        transition={SPRING}
        fill="none"
        stroke={markColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* knit ribbing */}
      <motion.g
        initial={false}
        animate={{ opacity: s.ribOpacity }}
        transition={{ duration: 0.3 }}
        stroke={markColor}
        strokeWidth="1.2"
      >
        {s.ribXs.map((x, i) => (
          <motion.line
            key={i}
            initial={false}
            animate={{ x1: x, x2: x, y1: s.hemY - 14, y2: s.hemY - 2 }}
            transition={SPRING}
          />
        ))}
      </motion.g>

      {/* ---- detail overlays ---- */}
      <AnimatePresence>
        {design.details.includes("belt") && (
          <motion.g
            key="belt"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.6 }}
            style={{ originX: "50%", originY: `${s.waistY}px` }}
          >
            <motion.rect
              initial={false}
              animate={{
                x: CX - s.waistHalf - 4,
                y: s.waistY - 8,
                width: s.waistHalf * 2 + 8,
              }}
              transition={SPRING}
              height="16"
              rx="3"
              fill={darken(color.hex, 0.45)}
              stroke="rgba(0,0,0,0.25)"
            />
            <rect x={CX - 8} y={s.waistY - 5} width="16" height="10" rx="2" fill="none" stroke={isLight(color.hex) ? "#fff" : "rgba(255,255,255,0.8)"} strokeWidth="2" />
          </motion.g>
        )}

        {design.details.includes("button") && (
          <motion.g
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            fill={markColor}
          >
            {[0, 1, 2, 3, 4].map((i) => {
              const top = s.topY + s.neckDepth + 16;
              const bottom = s.hemY - 18;
              const y = top + ((bottom - top) / 4) * i;
              return (
                <motion.circle
                  key={i}
                  initial={false}
                  animate={{ cy: y }}
                  transition={SPRING}
                  cx={CX}
                  r="3.4"
                />
              );
            })}
          </motion.g>
        )}

        {design.details.includes("frill") && (
          <motion.path
            key={`frill-${Math.round(s.hemY)}-${Math.round(s.hemHalf)}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            d={frillPath(CX, s.hemY + 4, s.hemHalf)}
            fill="none"
            stroke={markColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {design.details.includes("shirring") && (
          <motion.g
            key="shirring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            stroke={markColor}
            strokeWidth="1.4"
            fill="none"
          >
            {[-2, -1, 0, 1, 2].map((i) => (
              <motion.path
                key={i}
                initial={false}
                animate={{
                  d: shirringPath(CX + i * 13, Math.max(s.waistY - 26, s.topY + 8)),
                }}
                transition={SPRING}
              />
            ))}
          </motion.g>
        )}

        {design.details.includes("embroidery") && (
          <motion.g
            key="embroidery"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={SPRING}
            style={{
              originX: `${CX - s.waistHalf * 0.5}px`,
              originY: `${s.underarmY + 16}px`,
            }}
            fill={markColor}
          >
            {[0, 72, 144, 216, 288].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <motion.circle
                  key={deg}
                  initial={false}
                  animate={{
                    cx: CX - s.waistHalf * 0.5 + Math.cos(rad) * 6,
                    cy: s.underarmY + 16 + Math.sin(rad) * 6,
                  }}
                  transition={SPRING}
                  r="3"
                />
              );
            })}
            <motion.circle
              initial={false}
              animate={{ cx: CX - s.waistHalf * 0.5, cy: s.underarmY + 16 }}
              transition={SPRING}
              r="2.4"
              fill={isLight(color.hex) ? "#D4A937" : "#F3EDE2"}
            />
          </motion.g>
        )}

        {design.details.includes("pocket") && (
          <motion.g
            key="pocket"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            stroke={markColor}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          >
            {["leggings", "onepiece", "jumper"].includes(design.garment) ? (
              <>
                <motion.path
                  initial={false}
                  animate={{ d: `M ${CX - s.waistHalf * 0.78},${s.waistY + 24} L ${CX - s.waistHalf * 0.3},${s.waistY + 46}` }}
                  transition={SPRING}
                />
                <motion.path
                  initial={false}
                  animate={{ d: `M ${CX + s.waistHalf * 0.78},${s.waistY + 24} L ${CX + s.waistHalf * 0.3},${s.waistY + 46}` }}
                  transition={SPRING}
                />
              </>
            ) : (
              <motion.rect
                initial={false}
                animate={{ x: CX - s.waistHalf * 0.62 - 10, y: s.underarmY + 10 }}
                transition={SPRING}
                width="21"
                height="17"
                rx="3"
              />
            )}
          </motion.g>
        )}

        {design.details.includes("ribbon") && (
          <motion.g
            key="ribbon"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ originX: `${CX}px`, originY: `${s.waistY}px` }}
            fill={markColor}
          >
            <motion.path initial={false} animate={{ d: `M ${CX},${s.waistY - 2} L ${CX - 13},${s.waistY - 9} L ${CX - 12},${s.waistY + 5} Z` }} transition={SPRING} />
            <motion.path initial={false} animate={{ d: `M ${CX},${s.waistY - 2} L ${CX + 13},${s.waistY - 9} L ${CX + 12},${s.waistY + 5} Z` }} transition={SPRING} />
            <motion.path initial={false} animate={{ d: `M ${CX - 1},${s.waistY} L ${CX - 6},${s.waistY + 20} L ${CX - 1},${s.waistY + 17} Z` }} transition={SPRING} />
            <motion.path initial={false} animate={{ d: `M ${CX + 1},${s.waistY} L ${CX + 6},${s.waistY + 20} L ${CX + 1},${s.waistY + 17} Z` }} transition={SPRING} />
            <motion.circle initial={false} animate={{ cy: s.waistY - 2 }} transition={SPRING} cx={CX} r="3.2" />
          </motion.g>
        )}

        {design.details.includes("slit") && (
          <motion.line
            key="slit"
            initial={{
              opacity: 0,
              x1: CX + s.hemHalf * 0.45,
              x2: CX + s.hemHalf * 0.52,
              y1: s.hemY - 2,
              y2: s.hemY - 48,
            }}
            animate={{
              opacity: 1,
              x1: CX + s.hemHalf * 0.45,
              x2: CX + s.hemHalf * 0.52,
              y1: s.hemY - 2,
              y2: s.hemY - 48,
            }}
            exit={{ opacity: 0 }}
            transition={SPRING}
            stroke={markColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}

        {design.details.includes("pleats") && (
          <motion.g
            key="pleats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            stroke={markColor}
            strokeWidth="1.3"
          >
            {[-2, -1, 0, 1, 2].map((i) => (
              <motion.line
                key={i}
                initial={false}
                animate={{
                  x1: CX + i * s.waistHalf * 0.38,
                  y1: s.waistY + 8,
                  x2: CX + i * s.hemHalf * 0.42,
                  y2: s.hemY - 6,
                }}
                transition={SPRING}
              />
            ))}
          </motion.g>
        )}

        {design.details.includes("lacetrim") && (
          <motion.path
            key={`lace-${Math.round(s.hemY)}-${Math.round(s.hemHalf)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            d={frillPath(CX, s.hemY - 12, s.hemHalf * 0.92)}
            fill="none"
            stroke={markColor}
            strokeWidth="1.3"
            strokeDasharray="3 2.5"
          />
        )}

        {design.details.includes("drawstring") && (
          <motion.g
            key="drawstring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            stroke={markColor}
            strokeWidth="1.6"
            fill={markColor}
            strokeLinecap="round"
          >
            {(() => {
              const y0 =
                design.garment === "hoodie"
                  ? s.topY + s.neckDepth + 2
                  : s.waistY + 4;
              return (
                <>
                  <motion.path initial={false} animate={{ d: `M ${CX - 5},${y0} L ${CX - 8},${y0 + 22}` }} transition={SPRING} />
                  <motion.path initial={false} animate={{ d: `M ${CX + 5},${y0} L ${CX + 8},${y0 + 22}` }} transition={SPRING} />
                  <motion.circle initial={false} animate={{ cx: CX - 8, cy: y0 + 24 }} transition={SPRING} r="2" />
                  <motion.circle initial={false} animate={{ cx: CX + 8, cy: y0 + 24 }} transition={SPRING} r="2" />
                </>
              );
            })()}
          </motion.g>
        )}

        {design.details.includes("sidestripe") && (
          <motion.g
            key="sidestripe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            stroke={markColor}
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <motion.line
              initial={false}
              animate={{
                x1: CX - s.waistHalf + 4,
                y1: s.waistY + 8,
                x2: CX - s.hemHalf + 6,
                y2: s.hemY - 5,
              }}
              transition={SPRING}
            />
            <motion.line
              initial={false}
              animate={{
                x1: CX + s.waistHalf - 4,
                y1: s.waistY + 8,
                x2: CX + s.hemHalf - 6,
                y2: s.hemY - 5,
              }}
              transition={SPRING}
            />
          </motion.g>
        )}

        {design.details.includes("beads") && (
          <motion.g
            key="beads"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            fill={markColor}
          >
            {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
              <motion.circle
                key={i}
                initial={false}
                animate={{
                  cx: CX + i * 8,
                  cy: s.topY + s.neckDepth + 10 + i * i * 0.9,
                }}
                transition={SPRING}
                r="1.8"
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* shoes — base of the figure */}
      <ShoeOverlay design={design} baseY={VIEW_H - 22} />
    </svg>
  );
}

function ShoeOverlay({ design, baseY }: { design: Design; baseY: number }) {
  const show = design.shoe !== "none";
  const col = shoeColorOf(design);
  const fill = col.hex;
  const stroke = isLight(fill) ? "rgba(35,33,31,0.5)" : darken(fill, 0.35);
  const sole = darken(fill, 0.45);
  const gap = 16;
  const y = baseY;

  // 한쪽 발 모양(왼/오 대칭). side: -1 왼발, +1 오른발. x0 = 발뒤꿈치 기준 x.
  function shoePaths(side: -1 | 1) {
    const x0 = CX + side * 4; // 뒤꿈치 안쪽
    const dir = side; // 발끝 방향
    switch (design.shoe) {
      case "heels":
        return {
          body: `M ${x0},${y - 16} L ${x0 + dir * 4},${y - 16} L ${x0 + dir * 26},${y - 2} L ${x0 + dir * 26},${y} L ${x0 + dir * 3},${y} Z`,
          extra: `M ${x0},${y} L ${x0 - dir * 1},${y + 14} L ${x0 + dir * 3},${y + 14} L ${x0 + dir * 3},${y} Z`,
        };
      case "boots":
        return {
          body: `M ${x0 - dir * 2},${y - 40} L ${x0 + dir * 9},${y - 40} L ${x0 + dir * 9},${y - 4} L ${x0 + dir * 27},${y - 4} L ${x0 + dir * 27},${y} L ${x0 - dir * 2},${y} Z`,
          extra: "",
        };
      case "sneakers":
        return {
          body: `M ${x0 - dir * 2},${y - 4} C ${x0 - dir * 2},${y - 18} ${x0 + dir * 8},${y - 19} ${x0 + dir * 14},${y - 12} L ${x0 + dir * 27},${y - 5} L ${x0 + dir * 27},${y - 1} L ${x0 - dir * 2},${y - 1} Z`,
          extra: `M ${x0 - dir * 3},${y - 1} L ${x0 + dir * 28},${y - 1} L ${x0 + dir * 28},${y + 3} L ${x0 - dir * 3},${y + 3} Z`,
        };
      case "sandals":
        return {
          body: `M ${x0 - dir * 1},${y - 2} L ${x0 + dir * 26},${y - 2} L ${x0 + dir * 26},${y + 1} L ${x0 - dir * 1},${y + 1} Z`,
          extra: `M ${x0 + dir * 6},${y - 2} L ${x0 + dir * 16},${y - 14} M ${x0 + dir * 18},${y - 2} L ${x0 + dir * 16},${y - 14}`,
        };
      case "loafers":
        return {
          body: `M ${x0 - dir * 2},${y - 3} C ${x0 - dir * 2},${y - 15} ${x0 + dir * 10},${y - 16} ${x0 + dir * 18},${y - 11} L ${x0 + dir * 27},${y - 4} L ${x0 + dir * 27},${y} L ${x0 - dir * 2},${y} Z`,
          extra: `M ${x0 + dir * 6},${y - 11} l ${dir * 6},0`,
        };
      case "slippers":
        return {
          body: `M ${x0 - dir * 2},${y - 2} L ${x0 + dir * 24},${y - 2} L ${x0 + dir * 24},${y + 2} L ${x0 - dir * 2},${y + 2} Z`,
          extra: `M ${x0 + dir * 2},${y - 2} C ${x0 + dir * 6},${y - 12} ${x0 + dir * 18},${y - 12} ${x0 + dir * 22},${y - 2}`,
        };
      case "flats":
      default:
        return {
          body: `M ${x0 - dir * 2},${y - 2} C ${x0 - dir * 2},${y - 12} ${x0 + dir * 12},${y - 13} ${x0 + dir * 20},${y - 8} L ${x0 + dir * 27},${y - 3} L ${x0 + dir * 27},${y} L ${x0 - dir * 2},${y} Z`,
          extra: "",
        };
    }
  }

  const strokeOnly = design.shoe === "sandals";

  return (
    <AnimatePresence>
      {show && (
        <motion.g
          key={`shoe-${design.shoe}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
        >
          {([-1, 1] as const).map((side) => {
            const p = shoePaths(side);
            const tx = side * gap;
            return (
              <g key={side} transform={`translate(${tx}, 0)`}>
                {!strokeOnly && (
                  <path d={p.body} fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
                )}
                {design.shoe === "sneakers" && (
                  <path d={p.extra} fill={sole} stroke={stroke} strokeWidth="1" />
                )}
                {strokeOnly && (
                  <>
                    <path d={p.body} fill={fill} stroke={stroke} strokeWidth="1.4" />
                    <path d={p.extra} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
                  </>
                )}
                {(design.shoe === "heels" || design.shoe === "boots") && p.extra && (
                  <path d={p.extra} fill={sole} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />
                )}
                {(design.shoe === "loafers" || design.shoe === "slippers") && p.extra && (
                  <path d={p.extra} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
                )}
              </g>
            );
          })}
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function CollarOverlay({
  design,
  s,
  fill,
  accent,
  stroke,
}: {
  design: Design;
  s: ReturnType<typeof buildShapes>;
  fill: string;
  accent: string;
  stroke: string;
}) {
  const show = design.collar !== "none" && design.garment !== "leggings";
  const nh = s.neckHalf;
  const ty = s.topY;
  const nd = s.neckDepth;
  const sh = s.shoulderHalf;
  const shy = s.shoulderY;

  const shirtL = `M ${CX - nh - 2},${ty - 2} L ${CX - nh - 15},${ty + 19} L ${CX - 3},${ty + nd + 5} Z`;
  const shirtR = `M ${CX + nh + 2},${ty - 2} L ${CX + nh + 15},${ty + 19} L ${CX + 3},${ty + nd + 5} Z`;
  const mandarinD = [
    `M ${CX - nh - 3},${ty}`,
    `C ${CX - nh * 0.5},${ty - 9} ${CX + nh * 0.5},${ty - 9} ${CX + nh + 3},${ty}`,
    `L ${CX + nh - 1},${ty + 7}`,
    `C ${CX + nh * 0.4},${ty - 2} ${CX - nh * 0.4},${ty - 2} ${CX - nh + 1},${ty + 7}`,
    `Z`,
  ].join(" ");
  const sailorL = `M ${CX - nh - 1},${ty - 1} L ${CX - sh + 2},${shy + 22} L ${CX - 12},${shy + 34} L ${CX - 3},${ty + nd + 8} Z`;
  const sailorR = `M ${CX + nh + 1},${ty - 1} L ${CX + sh - 2},${shy + 22} L ${CX + 12},${shy + 34} L ${CX + 3},${ty + nd + 8} Z`;
  const bowY = ty + nd * 0.55 + 8;
  const bowL = `M ${CX},${bowY} C ${CX - 19},${bowY - 13} ${CX - 21},${bowY + 11} ${CX},${bowY + 3} Z`;
  const bowR = `M ${CX},${bowY} C ${CX + 19},${bowY - 13} ${CX + 21},${bowY + 11} ${CX},${bowY + 3} Z`;
  const tailL = `M ${CX - 1},${bowY + 2} L ${CX - 9},${bowY + 26} L ${CX - 1},${bowY + 22} Z`;
  const tailR = `M ${CX + 1},${bowY + 2} L ${CX + 9},${bowY + 26} L ${CX + 1},${bowY + 22} Z`;

  return (
    <AnimatePresence>
      {show && design.collar === "shirt" && (
        <motion.g
          key="col-shirt"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          <motion.path initial={false} animate={{ d: shirtL }} transition={SPRING} />
          <motion.path initial={false} animate={{ d: shirtR }} transition={SPRING} />
        </motion.g>
      )}
      {show && design.collar === "mandarin" && (
        <motion.path
          key="col-mandarin"
          initial={{ opacity: 0, y: -5 }}
          exit={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0, d: mandarinD }}
          transition={SPRING}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      )}
      {show && design.collar === "sailor" && (
        <motion.g
          key="col-sailor"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          <motion.path initial={false} animate={{ d: sailorL }} transition={SPRING} />
          <motion.path initial={false} animate={{ d: sailorR }} transition={SPRING} />
        </motion.g>
      )}
      {show && design.collar === "ribbon" && (
        <motion.g
          key="col-ribbon"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          style={{ originX: `${CX}px`, originY: `${bowY}px` }}
          fill={accent}
          stroke={stroke}
          strokeWidth="1"
          strokeLinejoin="round"
        >
          <motion.path initial={false} animate={{ d: bowL }} transition={SPRING} />
          <motion.path initial={false} animate={{ d: bowR }} transition={SPRING} />
          <motion.path initial={false} animate={{ d: tailL }} transition={SPRING} />
          <motion.path initial={false} animate={{ d: tailR }} transition={SPRING} />
          <motion.circle
            initial={false}
            animate={{ cy: bowY + 1 }}
            transition={SPRING}
            cx={CX}
            r="4.2"
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function heartPath(cx: number, cy: number, s: number): string {
  return [
    `M ${cx},${cy + 0.55 * s}`,
    `C ${cx - 1.15 * s},${cy - 0.35 * s} ${cx - 0.5 * s},${cy - 1.05 * s} ${cx},${cy - 0.35 * s}`,
    `C ${cx + 0.5 * s},${cy - 1.05 * s} ${cx + 1.15 * s},${cy - 0.35 * s} ${cx},${cy + 0.55 * s}`,
    `Z`,
  ].join(" ");
}

function starPath(cx: number, cy: number, R: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = (Math.PI / 5) * i - Math.PI / 2;
    const d = i % 2 === 0 ? R : r;
    pts.push(`${(cx + Math.cos(rad) * d).toFixed(2)},${(cy + Math.sin(rad) * d).toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

function frillPath(cx: number, y: number, half: number): string {
  const waves = 8;
  const w = (half * 2) / waves;
  let d = `M ${(cx - half).toFixed(1)},${y.toFixed(1)}`;
  for (let i = 0; i < waves; i++) {
    const x0 = cx - half + i * w;
    d += ` Q ${(x0 + w / 2).toFixed(1)},${(y + 8).toFixed(1)} ${(x0 + w).toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

function shirringPath(x: number, y: number): string {
  return [
    `M ${x.toFixed(1)},${y.toFixed(1)}`,
    `q 3,5 0,10`,
    `q -3,5 0,10`,
    `q 3,5 0,10`,
  ].join(" ");
}
