"use client";

import { motion, AnimatePresence } from "framer-motion";
import { COLORS, Design, colorOf, patternColorOf, shoeColorOf } from "@/lib/design";
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

      <BackgroundOverlay design={design} />

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

      {/* accessories */}
      <AccessoryOverlay design={design} />

      {/* shoes — base of the figure */}
      <ShoeOverlay design={design} baseY={VIEW_H - 22} />
    </svg>
  );
}

function BackgroundOverlay({ design }: { design: Design }) {
  return (
    <motion.g
      key={`bg-${design.background}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      {design.background === "flower" && (
        <>
          <rect width={VIEW_W} height={VIEW_H} fill="#F8F4EA" />
          <path d={`M 0,315 C 55,286 91,334 142,304 C 194,274 241,305 320,280 L 320,470 L 0,470 Z`} fill="#C9DBB0" />
          <path d={`M 0,338 C 72,315 126,348 182,326 C 233,306 274,325 320,304 L 320,470 L 0,470 Z`} fill="#8EA86B" opacity="0.75" />
          {[
            [36, 356, "#F0C3CD"], [72, 331, "#D4A937"], [108, 366, "#FFFFFF"],
            [232, 342, "#F0C3CD"], [276, 365, "#FFFFFF"], [298, 322, "#D4A937"],
          ].map((point) => {
            const [x, y, fill] = point as [number, number, string];
            return (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <circle cx="0" cy="0" r="3.5" fill={fill} />
              <circle cx="-4" cy="0" r="2.6" fill={fill} opacity="0.8" />
              <circle cx="4" cy="0" r="2.6" fill={fill} opacity="0.8" />
              <line x1="0" y1="4" x2="0" y2="16" stroke="#557246" strokeWidth="1.2" />
            </g>
            );
          })}
        </>
      )}
      {design.background === "france" && (
        <>
          <rect width={VIEW_W} height={VIEW_H} fill="#EEF2F0" />
          <rect x="0" y="314" width={VIEW_W} height="156" fill="#D8CEC0" />
          <path d="M 34,278 L 66,74 L 98,278 M 48,188 L 84,188 M 40,236 L 92,236 M 58,126 L 74,126" fill="none" stroke="#7A7169" strokeWidth="3" strokeLinecap="round" />
          <path d="M 216,118 L 300,118 L 300,316 L 216,316 Z" fill="#E4D7C4" stroke="rgba(35,33,31,0.14)" />
          {[138, 176, 214, 252].map((y) => (
            <path key={y} d={`M 229,${y} L 287,${y}`} stroke="rgba(35,33,31,0.16)" strokeWidth="2" />
          ))}
          <path d="M 0,340 C 72,326 134,340 198,324 C 246,312 286,322 320,316" fill="none" stroke="rgba(35,33,31,0.15)" strokeWidth="3" />
        </>
      )}
      {design.background === "sea" && (
        <>
          <rect width={VIEW_W} height={VIEW_H} fill="#DDEEF3" />
          <rect x="0" y="258" width={VIEW_W} height="96" fill="#88C8D5" />
          <rect x="0" y="354" width={VIEW_W} height="116" fill="#E9D2A7" />
          {[276, 306, 336].map((y) => (
            <path key={y} d={`M 0,${y} C 46,${y - 18} 84,${y + 14} 132,${y} S 222,${y - 18} 320,${y}`} fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="3" />
          ))}
          <circle cx="262" cy="78" r="25" fill="#F5C85C" opacity="0.9" />
        </>
      )}
      {design.background === "space" && (
        <>
          <rect width={VIEW_W} height={VIEW_H} fill="#15172D" />
          {[28, 68, 112, 238, 282, 302].map((x, i) => (
            <circle key={x} cx={x} cy={38 + (i % 3) * 52} r={i % 2 ? 1.8 : 2.6} fill="#F7F1D5" />
          ))}
          <circle cx="72" cy="112" r="28" fill="#6F78B8" opacity="0.9" />
          <circle cx="66" cy="104" r="9" fill="#97A0D2" opacity="0.62" />
          <path d="M 218,82 C 244,68 278,72 298,92 C 268,88 242,94 218,112 C 225,102 225,92 218,82 Z" fill="#DDAA5B" opacity="0.86" />
          <rect x="0" y="358" width={VIEW_W} height="112" fill="#242545" />
        </>
      )}
      {design.background === "room" && (
        <>
          <rect width={VIEW_W} height={VIEW_H} fill="#F6EFE4" />
          <rect x="0" y="322" width={VIEW_W} height="148" fill="#D8BFA2" />
          <path d="M 0,322 L 320,322" stroke="rgba(35,33,31,0.14)" strokeWidth="2" />
          <rect x="28" y="92" width="64" height="84" rx="3" fill="#E7D7C7" stroke="rgba(35,33,31,0.12)" />
          <path d="M 40,122 L 80,122 M 40,146 L 80,146" stroke="rgba(35,33,31,0.13)" strokeWidth="2" />
          <path d="M 242,242 L 292,242 L 302,322 L 232,322 Z" fill="#C6A684" opacity="0.75" />
        </>
      )}
      {design.background === "zoo" && (
        <>
          <rect width={VIEW_W} height={VIEW_H} fill="#F4EEDA" />
          <rect x="0" y="326" width={VIEW_W} height="144" fill="#AFCB7E" />
          <path d="M 28,154 C 42,104 100,84 160,84 C 220,84 278,104 292,154" fill="none" stroke="#9A7A50" strokeWidth="8" strokeLinecap="round" />
          <rect x="66" y="134" width="188" height="42" rx="5" fill="#C99C5B" stroke="#8C6A42" strokeWidth="2" />
          <text x="160" y="163" textAnchor="middle" fontSize="25" fontFamily="Georgia, serif" fontWeight="700" fill="#FFF2D0">ZOO</text>
          <path d="M 76,176 L 76,322 M 244,176 L 244,322" stroke="#8C6A42" strokeWidth="6" strokeLinecap="round" />
          {[24, 50, 270, 296].map((x) => (
            <g key={x} opacity="0.8">
              <line x1={x} y1="216" x2={x} y2="330" stroke="#9A7A50" strokeWidth="3" />
              <path d={`M ${x - 12},248 L ${x + 12},248 M ${x - 12},286 L ${x + 12},286`} stroke="#9A7A50" strokeWidth="2" />
            </g>
          ))}
          <path d="M 0,332 C 56,314 112,338 168,320 C 226,302 270,318 320,304 L 320,470 L 0,470 Z" fill="#8FAE5E" opacity="0.62" />
          <g transform="translate(44 265)">
            <ellipse cx="27" cy="45" rx="28" ry="18" fill="#9FB4BE" />
            <circle cx="5" cy="35" r="13" fill="#9FB4BE" />
            <path d="M -2,44 C -18,50 -16,69 -1,63" fill="none" stroke="#9FB4BE" strokeWidth="8" strokeLinecap="round" />
            <circle cx="0" cy="32" r="2" fill="#3D3028" />
          </g>
          <g transform="translate(252 238)">
            <path d="M 4,10 L 18,10 L 22,72 L 8,72 Z" fill="#D6A95E" />
            <circle cx="11" cy="0" r="11" fill="#D6A95E" />
            <path d="M 10,-11 L 6,-24 M 15,-10 L 20,-23" stroke="#B9853B" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="0" cy="76" rx="20" ry="12" fill="#D6A95E" />
            <circle cx="7" cy="-2" r="1.7" fill="#3D3028" />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={5 + i * 4} cy={24 + i * 8} r="2.2" fill="#B9853B" opacity="0.75" />
            ))}
          </g>
        </>
      )}
    </motion.g>
  );
}

function AccessoryOverlay({ design }: { design: Design }) {
  const sockColor = COLORS.find((c) => c.id === design.socksColorId) ?? COLORS[0];
  const carryColor = COLORS.find((c) => c.id === design.carryColorId) ?? COLORS[2];
  const sockStroke = isLight(sockColor.hex) ? "rgba(35,33,31,0.36)" : darken(sockColor.hex, 0.42);
  const sockShade = isLight(sockColor.hex) ? "rgba(35,33,31,0.08)" : "rgba(255,255,255,0.2)";
  const sockHighlight = isLight(sockColor.hex) ? "rgba(35,33,31,0.28)" : "rgba(255,255,255,0.38)";
  const carryStroke = isLight(carryColor.hex) ? "rgba(35,33,31,0.36)" : darken(carryColor.hex, 0.42);
  const carryShade = isLight(carryColor.hex) ? "rgba(35,33,31,0.1)" : "rgba(255,255,255,0.22)";
  const carryHighlight = isLight(carryColor.hex) ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.32)";
  const baseY = VIEW_H - 24;

  const sockHeight = design.socksLength === "ankle" ? 30 : design.socksLength === "knee" ? 86 : design.socksLength === "over" ? 112 : 58;
  const topY = baseY - sockHeight;
  const bottomY = baseY - 12;

  return (
    <g>
      {design.socksEnabled && (
        <motion.g
          key={`socks-${design.socksLength}-${sockColor.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 190, damping: 23 }}
        >
          {([-1, 1] as const).map((side) => {
            const x = CX + side * 28;
            const calf = design.socksLength === "ankle" ? 7 : design.socksLength === "mid" ? 9 : 10.5;
            const ankle = 7.5;
            const toeDir = side;
            const sockPath = [
              `M ${x - calf},${topY + 8}`,
              `C ${x - calf - 2},${topY + 30} ${x - ankle - 1},${bottomY - 42} ${x - ankle},${bottomY - 12}`,
              `C ${x - ankle},${bottomY - 4} ${x - 3},${bottomY} ${x + toeDir * 5},${bottomY}`,
              `C ${x + toeDir * 14},${bottomY} ${x + toeDir * 20},${bottomY + 4} ${x + toeDir * 18},${bottomY + 8}`,
              `C ${x + toeDir * 9},${bottomY + 10} ${x - toeDir * 2},${bottomY + 9} ${x + ankle * toeDir},${bottomY + 4}`,
              `C ${x + ankle},${bottomY - 22} ${x + calf + 1},${topY + 30} ${x + calf},${topY + 8}`,
              `Z`,
            ].join(" ");
            return (
              <g key={side}>
                <path d={sockPath} fill={sockColor.hex} stroke={sockStroke} strokeWidth="1.35" strokeLinejoin="round" />
                <path
                  d={`M ${x - calf + 3},${topY + 13} C ${x - 2},${topY + 38} ${x - 2},${bottomY - 28} ${x - 2},${bottomY - 7}`}
                  fill="none"
                  stroke={sockShade}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${x + toeDir * 7},${bottomY + 5} C ${x + toeDir * 15},${bottomY + 7} ${x + toeDir * 19},${bottomY + 7} ${x + toeDir * 22},${bottomY + 9}`}
                  fill="none"
                  stroke={sockStroke}
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <rect x={x - calf - 2} y={topY + 2} width={(calf + 2) * 2} height="10" rx="5" fill={darken(sockColor.hex, 0.12)} stroke={sockStroke} strokeOpacity="0.45" />
                {[0, 1, 2].map((i) => (
                  <line
                    key={i}
                    x1={x - 6 + i * 6}
                    y1={topY + 5}
                    x2={x - 6 + i * 6}
                    y2={topY + 11}
                    stroke={sockHighlight}
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            );
          })}
        </motion.g>
      )}

      {design.carry.includes("bouquet") && (
        <motion.g
          key={`bouquet-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX + 62}, 138) rotate(-9)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        >
          <path d="M -7,2 C -10,24 -8,38 -4,54 M 7,2 C 10,24 8,38 4,54 M 0,0 C 0,22 0,38 0,55" stroke="rgba(75,92,55,0.58)" strokeWidth="1.7" strokeLinecap="round" fill="none" />
          {[-15, -6, 4, 14].map((x, i) => (
            <path
              key={x}
              d={`M ${x},${-5 - i * 3} C ${x - 12},${-19 - i * 2} ${x - 5},${-34 - i * 2} ${x + 4},${-26 - i * 2} C ${x + 13},${-34 - i * 2} ${x + 21},${-18 - i * 2} ${x},${-5 - i * 3} Z`}
              fill={i % 2 ? darken(carryColor.hex, 0.1) : carryColor.hex}
              stroke={carryStroke}
              strokeWidth="1"
            />
          ))}
          <path d="M -13,12 C -7,18 7,18 13,12 L 7,31 C 3,35 -3,35 -7,31 Z" fill="rgba(245,239,226,0.72)" stroke="rgba(35,33,31,0.22)" strokeWidth="1" />
          {design.carryStyle === "bow" && (
            <g fill={darken(carryColor.hex, 0.2)} stroke={carryStroke} strokeWidth="0.8">
              <path d="M -1,24 C -14,16 -18,28 -3,29 Z" />
              <path d="M 1,24 C 14,16 18,28 3,29 Z" />
              <circle cx="0" cy="26" r="3" />
            </g>
          )}
          {design.carryStyle === "floral" && (
            <g fill="rgba(255,255,255,0.86)">
              <circle cx="-8" cy="-25" r="2.2" />
              <circle cx="9" cy="-31" r="2.2" />
              <circle cx="15" cy="-17" r="2" />
            </g>
          )}
        </motion.g>
      )}

      {design.carry.includes("backpack") && (
        <motion.g
          key={`backpack-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX - 76}, 168) scale(0.82)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 23 }}
        >
          <path d="M 18,-6 C 8,-6 1,2 0,15 L -4,61 C -5,72 4,81 18,81 C 32,81 41,72 40,61 L 36,15 C 35,2 28,-6 18,-6 Z" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1.5" />
          <path d="M 7,13 C 11,5 25,5 29,13" fill="none" stroke={carryStroke} strokeWidth="2.3" strokeLinecap="round" />
          <path d="M 0,18 C -15,28 -13,54 -2,66 M 36,18 C 51,28 49,54 38,66" fill="none" stroke={carryStroke} strokeOpacity="0.55" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 4,31 L 32,31 L 29,56 C 27,63 9,63 7,56 Z" fill={carryShade} stroke={carryStroke} strokeOpacity="0.65" strokeWidth="1" />
          <path d="M 10,39 L 26,39" stroke={carryHighlight} strokeWidth="1.4" strokeLinecap="round" />
          {design.carryStyle !== "minimal" && (
            <path d="M 7,3 C 12,-3 24,-3 29,3" fill="none" stroke={carryHighlight} strokeWidth="1.4" strokeLinecap="round" />
          )}
          {design.carryStyle === "bow" && (
            <g transform="translate(18 24)" fill={carryHighlight} stroke={carryStroke} strokeWidth="0.8">
              <path d="M 0,0 C -11,-8 -15,5 -2,5 Z" />
              <path d="M 0,0 C 11,-8 15,5 2,5 Z" />
              <circle cx="0" cy="2" r="2.5" />
            </g>
          )}
          {design.carryStyle === "floral" && (
            <g fill={carryHighlight}>
              <circle cx="13" cy="23" r="2" />
              <circle cx="18" cy="20" r="2" />
              <circle cx="23" cy="23" r="2" />
            </g>
          )}
        </motion.g>
      )}

      {design.carry.includes("handbag") && (
        <motion.g
          key={`handbag-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX + 58}, 210) rotate(5) scale(0.82)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 23 }}
        >
          <path d="M -17,-10 C -17,-32 17,-32 17,-10" fill="none" stroke={carryStroke} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M -26,-8 C -23,-20 23,-20 26,-8 L 31,45 C 24,55 -24,55 -31,45 Z" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M -22,2 C -12,9 12,9 22,2" fill="none" stroke={carryHighlight} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M -16,17 L 16,17 L 13,36 C 8,41 -8,41 -13,36 Z" fill={carryShade} stroke={carryStroke} strokeOpacity="0.55" strokeWidth="1" />
          <circle cx="0" cy="27" r="2.8" fill={carryHighlight} stroke={carryStroke} strokeWidth="0.8" />
          {design.carryStyle === "bow" && (
            <g transform="translate(0 7)" fill={carryHighlight} stroke={carryStroke} strokeWidth="0.8">
              <path d="M 0,0 C -13,-9 -16,8 -2,7 Z" />
              <path d="M 0,0 C 13,-9 16,8 2,7 Z" />
              <circle cx="0" cy="4" r="2.8" />
            </g>
          )}
          {design.carryStyle === "floral" && (
            <g fill={carryHighlight}>
              <circle cx="-10" cy="11" r="2.2" />
              <circle cx="-5" cy="8" r="2.2" />
              <circle cx="0" cy="11" r="2.2" />
            </g>
          )}
        </motion.g>
      )}

      {design.carry.includes("doll") && (
        <motion.g
          key={`doll-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX + 66}, 218) rotate(7)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 23 }}
        >
          <ellipse cx="0" cy="26" rx="20" ry="25" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1.5" />
          <circle cx="0" cy="-2" r="18" fill={darken(carryColor.hex, 0.04)} stroke={carryStroke} strokeWidth="1.4" />
          <circle cx="-11" cy="-18" r="7" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1" />
          <circle cx="11" cy="-18" r="7" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1" />
          <circle cx="-6" cy="-4" r="2" fill="#2E2924" />
          <circle cx="6" cy="-4" r="2" fill="#2E2924" />
          <path d="M -5,4 Q 0,8 5,4" fill="none" stroke="#2E2924" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M -18,24 C -36,24 -31,48 -16,42 M 18,24 C 36,24 31,48 16,42" fill="none" stroke={carryStroke} strokeWidth="5" strokeLinecap="round" />
          {design.carryStyle === "bow" && (
            <g transform="translate(0 -26)" fill={carryHighlight} stroke={carryStroke} strokeWidth="0.8">
              <path d="M 0,0 C -10,-8 -13,5 -2,5 Z" />
              <path d="M 0,0 C 10,-8 13,5 2,5 Z" />
              <circle cx="0" cy="2" r="2.4" />
            </g>
          )}
          {design.carryStyle === "floral" && (
            <circle cx="0" cy="23" r="4" fill={carryHighlight} />
          )}
        </motion.g>
      )}

      {design.carry.includes("wand") && (
        <motion.g
          key={`wand-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX + 67}, 154) rotate(-18)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 21 }}
        >
          <line x1="0" y1="28" x2="0" y2="104" stroke={carryStroke} strokeWidth="5" strokeLinecap="round" />
          <line x1="0" y1="28" x2="0" y2="104" stroke={carryColor.hex} strokeWidth="2.8" strokeLinecap="round" />
          <path d={starPath(0, 12, 18, 7)} fill={carryColor.hex} stroke={carryStroke} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M -30,-10 L -22,-18 M 28,-10 L 36,-18 M 27,37 L 39,41" stroke={carryHighlight} strokeWidth="2" strokeLinecap="round" />
          {design.carryStyle === "bow" && (
            <g transform="translate(0 58)" fill={carryHighlight} stroke={carryStroke} strokeWidth="0.8">
              <path d="M 0,0 C -11,-7 -13,6 -2,6 Z" />
              <path d="M 0,0 C 11,-7 13,6 2,6 Z" />
            </g>
          )}
        </motion.g>
      )}

      {design.carry.includes("balloon") && (
        <motion.g
          key={`balloon-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX + 77}, 94)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 170, damping: 22 }}
        >
          <path d="M -4,77 C -20,118 -8,144 -24,178" fill="none" stroke="rgba(35,33,31,0.32)" strokeWidth="1.4" strokeDasharray="4 4" />
          <path d="M 0,0 C 35,0 40,47 7,66 L 0,77 L -7,66 C -40,47 -35,0 0,0 Z" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1.5" />
          <path d="M -14,12 C -24,29 -19,48 -5,57" fill="none" stroke={carryHighlight} strokeWidth="3" strokeLinecap="round" />
          {design.carryStyle === "floral" && (
            <g fill={carryHighlight}>
              <circle cx="-3" cy="28" r="3" />
              <circle cx="4" cy="25" r="3" />
              <circle cx="8" cy="32" r="3" />
            </g>
          )}
        </motion.g>
      )}

      {design.carry.includes("phone") && (
        <motion.g
          key={`phone-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX + 68}, 202) rotate(-8)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 23 }}
        >
          <rect x="-16" y="-28" width="32" height="58" rx="7" fill={carryStroke} />
          <rect x="-12" y="-22" width="24" height="44" rx="3" fill={carryColor.hex} />
          <circle cx="0" cy="25" r="2" fill={carryHighlight} />
          <path d="M -7,-12 L 7,-12 M -7,-4 L 7,-4 M -7,4 L 2,4" stroke={carryHighlight} strokeWidth="1.4" strokeLinecap="round" />
          {design.carryStyle === "floral" && (
            <circle cx="8" cy="-16" r="2.2" fill={carryHighlight} />
          )}
        </motion.g>
      )}

      {design.carry.includes("headphones") && (
        <motion.g
          key={`headphones-${design.carryStyle}-${carryColor.id}`}
          transform={`translate(${CX}, 50)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 23 }}
        >
          <path d="M -35,34 C -33,0 33,0 35,34" fill="none" stroke={carryStroke} strokeWidth="5" strokeLinecap="round" />
          <path d="M -35,34 C -33,0 33,0 35,34" fill="none" stroke={carryColor.hex} strokeWidth="2.4" strokeLinecap="round" />
          <rect x="-50" y="28" width="20" height="34" rx="8" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1.4" />
          <rect x="30" y="28" width="20" height="34" rx="8" fill={carryColor.hex} stroke={carryStroke} strokeWidth="1.4" />
          <path d="M -44,37 L -44,53 M 44,37 L 44,53" stroke={carryHighlight} strokeWidth="1.5" strokeLinecap="round" />
          {design.carryStyle === "bow" && (
            <g transform="translate(0 4)" fill={carryHighlight} stroke={carryStroke} strokeWidth="0.8">
              <path d="M 0,0 C -12,-8 -15,7 -2,7 Z" />
              <path d="M 0,0 C 12,-8 15,7 2,7 Z" />
            </g>
          )}
        </motion.g>
      )}
    </g>
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
