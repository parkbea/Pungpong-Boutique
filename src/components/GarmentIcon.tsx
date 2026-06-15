import { DEFAULT_DESIGN, Design, GarmentId, isDressLike } from "@/lib/design";
import { buildShapes, VIEW_W, VIEW_H } from "@/lib/silhouette";

function iconDesign(garment: GarmentId): Design {
  return {
    ...DEFAULT_DESIGN,
    garment,
    fit: garment === "dress" ? "aline" : DEFAULT_DESIGN.fit,
    length: garment === "dress" ? "maxi" : garment === "leggings" ? "long" : "midi",
    neckline: garment === "dress" ? "v" : DEFAULT_DESIGN.neckline,
    sleeve: isDressLike(garment)
      ? "sleeveless"
      : garment === "tshirt"
        ? "short"
        : garment === "blouse"
          ? "puff"
          : "long",
  };
}

export default function GarmentIcon({
  garment,
  className,
}: {
  garment: GarmentId;
  className?: string;
}) {
  const s = buildShapes(iconDesign(garment));
  const ink = "currentColor";
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={className} aria-hidden>
      <g fill="rgba(35,33,31,0.06)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
        {s.hoodOpacity > 0 && <path d={s.hoodD} />}
        {s.sleeveOpacity > 0 && (
          <>
            <path d={s.leftSleeveD} />
            <path d={s.rightSleeveD} />
          </>
        )}
        {s.bodyOpacity > 0 && <path d={s.bodyD} />}
        {s.leggingsOpacity > 0 && <path d={s.leggingsD} />}
      </g>
      {s.zipOpacity > 0 && (
        <line
          x1={VIEW_W / 2}
          y1={s.zipY1}
          x2={VIEW_W / 2}
          y2={s.zipY2}
          stroke={ink}
          strokeWidth="5"
          strokeDasharray="8 6"
        />
      )}
      {s.pocketOpacity > 0 && (
        <path d={s.pocketD} fill="none" stroke={ink} strokeWidth="5" />
      )}
      {s.ribOpacity > 0 &&
        s.ribXs.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={s.hemY - 16}
            x2={x}
            y2={s.hemY - 2}
            stroke={ink}
            strokeWidth="4"
          />
        ))}
    </svg>
  );
}
