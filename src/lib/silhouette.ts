import { Design, isDressLike } from "./design";

/**
 * Parametric garment silhouette generator.
 *
 * Every body path and sleeve path is emitted with an identical command
 * structure regardless of the selected options, so Framer Motion can
 * interpolate the `d` attribute smoothly between any two designs.
 */

export const VIEW_W = 320;
export const VIEW_H = 470;
const CX = VIEW_W / 2;

const SLEEVE_ANGLE = (24 * Math.PI) / 180;

export interface SilhouetteShapes {
  bodyD: string;
  bodyOpacity: number;
  leggingsD: string;
  leggingsOpacity: number;
  leggingsBandY: number;
  leggingsBandHalf: number;
  leftSleeveD: string;
  rightSleeveD: string;
  sleeveOpacity: number;
  hoodD: string;
  hoodOpacity: number;
  pocketD: string;
  pocketOpacity: number;
  zipY1: number;
  zipY2: number;
  zipOpacity: number;
  ribOpacity: number;
  ribXs: number[];
  topY: number;
  neckDepth: number;
  neckHalf: number;
  shoulderHalf: number;
  shoulderY: number;
  underarmY: number;
  waistY: number;
  waistHalf: number;
  hemY: number;
  hemHalf: number;
}

const pt = (x: number, y: number) => `${x.toFixed(1)},${y.toFixed(1)}`;

export function buildShapes(design: Design): SilhouetteShapes {
  // --- widths by fit ---
  let shoulder = 58;
  let waist = 52;
  if (design.fit === "slim") {
    shoulder = 53;
    waist = 42;
  } else if (design.fit === "over") {
    shoulder = 68;
    waist = 66;
  } else if (design.fit === "aline") {
    shoulder = 55;
    waist = 48;
  }

  // garment bulk adjustments
  if (design.garment === "jumper" || design.garment === "hoodie") {
    shoulder += 5;
    waist += 7;
  } else if (design.garment === "knit") {
    shoulder += 2;
    waist += 3;
  } else if (design.garment === "blouse" || isDressLike(design.garment)) {
    waist -= 3;
  }

  // --- vertical landmarks ---
  const offShoulder = design.neckline === "off";
  const topY = offShoulder ? 72 : 56;
  const shoulderY = topY + 26;
  const underarmY = shoulderY + 50;
  const waistY = 202;

  // --- hem ---
  let hemY: number;
  if (isDressLike(design.garment)) {
    hemY = design.length === "mini" ? 300 : design.length === "maxi" ? 432 : 365;
  } else {
    hemY = design.length === "crop" ? 218 : design.length === "long" ? 302 : 260;
    if (design.garment === "jumper") hemY = Math.min(hemY, 280);
  }

  let flare = 4;
  if (design.fit === "aline") flare = (hemY - waistY) * 0.42 + 10;
  else if (isDressLike(design.garment)) flare = (hemY - waistY) * 0.22 + 6;
  else if (design.fit === "over") flare = 8;
  const hemHalf = waist + flare;

  // --- neckline ---
  let neckHalf = 24;
  let neckDepth = 26;
  let neckCtrl = 0.55; // control-point spread: ~0 => V point, ~1 => square
  switch (design.neckline) {
    case "v":
      neckHalf = 26;
      neckDepth = 54;
      neckCtrl = 0.12;
      break;
    case "square":
      neckHalf = 26;
      neckDepth = 40;
      neckCtrl = 1.05;
      break;
    case "halter":
      neckHalf = 13;
      neckDepth = 62;
      neckCtrl = 0.15;
      break;
    case "off":
      neckHalf = shoulder * 0.86;
      neckDepth = 16;
      neckCtrl = 0.6;
      break;
  }

  const armHalf = shoulder - 3;

  const lN = { x: CX - neckHalf, y: topY };
  const rN = { x: CX + neckHalf, y: topY };
  const lS = { x: CX - shoulder, y: shoulderY };
  const rS = { x: CX + shoulder, y: shoulderY };
  const lU = { x: CX - armHalf, y: underarmY };
  const rU = { x: CX + armHalf, y: underarmY };
  const lW = { x: CX - waist, y: waistY };
  const rW = { x: CX + waist, y: waistY };
  const lH = { x: CX - hemHalf, y: hemY };
  const rH = { x: CX + hemHalf, y: hemY };

  const hemCurve = 10 + hemHalf * 0.06;
  const sideMidY = waistY + (hemY - waistY) * 0.5;

  const bodyD = [
    `M ${pt(lN.x, lN.y)}`,
    `L ${pt(lS.x, lS.y)}`,
    `C ${pt(lS.x - 1, shoulderY + 20)} ${pt(lU.x - 1, underarmY - 16)} ${pt(lU.x, lU.y)}`,
    `C ${pt(lU.x + 2, underarmY + 28)} ${pt(lW.x - 1, waistY - 24)} ${pt(lW.x, lW.y)}`,
    `C ${pt(lW.x - flare * 0.25, sideMidY)} ${pt(lH.x, hemY - 22)} ${pt(lH.x, lH.y)}`,
    `Q ${pt(CX, hemY + hemCurve)} ${pt(rH.x, rH.y)}`,
    `C ${pt(rH.x, hemY - 22)} ${pt(rW.x + flare * 0.25, sideMidY)} ${pt(rW.x, rW.y)}`,
    `C ${pt(rW.x + 1, waistY - 24)} ${pt(rU.x - 2, underarmY + 28)} ${pt(rU.x, rU.y)}`,
    `C ${pt(rU.x + 1, underarmY - 16)} ${pt(rS.x + 1, shoulderY + 20)} ${pt(rS.x, rS.y)}`,
    `L ${pt(rN.x, rN.y)}`,
    `C ${pt(CX + neckHalf * neckCtrl, topY + neckDepth)} ${pt(CX - neckHalf * neckCtrl, topY + neckDepth)} ${pt(lN.x, lN.y)}`,
    `Z`,
  ].join(" ");

  // --- sleeves ---
  let sleeveLen = 64;
  let cuffHalf = 21;
  let bulge = 1.05;
  let sleeveOpacity = 1;
  switch (design.sleeve) {
    case "sleeveless":
      sleeveLen = 8;
      cuffHalf = 18;
      sleeveOpacity = 0;
      break;
    case "long":
      sleeveLen = 168;
      cuffHalf = 16;
      break;
    case "puff":
      sleeveLen = 62;
      cuffHalf = 13;
      bulge = 2.1;
      break;
    case "wide":
      sleeveLen = 160;
      cuffHalf = 34;
      bulge = 1.25;
      break;
  }
  if (design.fit === "over") {
    cuffHalf += 4;
    sleeveLen += 6;
  }

  const dirY = Math.cos(SLEEVE_ANGLE);
  const dirXMag = Math.sin(SLEEVE_ANGLE);

  function sleeveD(side: -1 | 1): string {
    const S = side === -1 ? lS : rS;
    const U = side === -1 ? lU : rU;
    const dx = side * dirXMag;
    const dy = dirY;
    // perpendicular pointing toward the body (and slightly downward)
    const px = -side * dy;
    const py = dirXMag;
    const rootX = (S.x + U.x) / 2;
    const rootY = (S.y + U.y) / 2;
    const ccx = rootX + dx * sleeveLen;
    const ccy = rootY + dy * sleeveLen;
    const outer = { x: ccx - px * cuffHalf, y: ccy - py * cuffHalf };
    const inner = { x: ccx + px * cuffHalf, y: ccy + py * cuffHalf };
    const oc = {
      x: S.x + dx * sleeveLen * 0.5 - px * cuffHalf * bulge,
      y: S.y + dy * sleeveLen * 0.5 - py * cuffHalf * bulge,
    };
    const ic = {
      x: U.x + dx * sleeveLen * 0.45 + px * cuffHalf * 0.4,
      y: U.y + dy * sleeveLen * 0.45 + py * cuffHalf * 0.4,
    };
    return [
      `M ${pt(S.x, S.y)}`,
      `C ${pt(oc.x, oc.y)} ${pt(outer.x - dx * 6, outer.y - dy * 6)} ${pt(outer.x, outer.y)}`,
      `L ${pt(inner.x, inner.y)}`,
      `C ${pt(ic.x, ic.y)} ${pt(U.x + dx * 4, U.y + dy * 4)} ${pt(U.x, U.y)}`,
      `Z`,
    ].join(" ");
  }

  // --- hood (hoodie only) ---
  const hood = design.garment === "hoodie";
  const hoodD = [
    `M ${pt(CX - neckHalf - 8, topY + 4)}`,
    `C ${pt(CX - neckHalf - 14, topY - 26)} ${pt(CX - 14, topY - 34)} ${pt(CX, topY - 34)}`,
    `C ${pt(CX + 14, topY - 34)} ${pt(CX + neckHalf + 14, topY - 26)} ${pt(CX + neckHalf + 8, topY + 4)}`,
    `Q ${pt(CX, topY + 14)} ${pt(CX - neckHalf - 8, topY + 4)}`,
    `Z`,
  ].join(" ");

  // --- kangaroo pocket (hoodie only) ---
  const pw = waist * 0.62;
  const pTop = hemY - 56;
  const pBot = hemY - 14;
  const pocketD = [
    `M ${pt(CX - pw, pTop)}`,
    `L ${pt(CX + pw, pTop)}`,
    `L ${pt(CX + pw * 0.78, pBot)}`,
    `L ${pt(CX - pw * 0.78, pBot)}`,
    `Z`,
  ].join(" ");

  // --- zipper line (jumper only) ---
  const zip = design.garment === "jumper";

  // --- ribbing marks (knit only) ---
  const rib = design.garment === "knit";
  const ribXs: number[] = [];
  for (let i = -3; i <= 3; i++) ribXs.push(CX + i * (hemHalf / 4));

  // --- leggings (별도 패스 구조, 상의와는 크로스페이드 전환) ---
  const isLeg = design.garment === "leggings";
  let legWaist = 44;
  let ankleHalf = 11;
  if (design.fit === "slim") {
    legWaist = 38;
    ankleHalf = 9;
  } else if (design.fit === "over") {
    legWaist = 52;
    ankleHalf = 16;
  } else if (design.fit === "aline") {
    legWaist = 46;
    ankleHalf = 24; // 플레어
  }
  const legHemY =
    design.length === "crop" || design.length === "mini"
      ? 296
      : design.length === "long" || design.length === "maxi"
        ? 430
        : 365;
  const wTop = 150;
  const hipY = 196;
  const hip = legWaist + 10;
  const crotchY = 234;
  const legC = 17; // 다리 중심선의 좌우 오프셋

  const lOut = CX - legC - ankleHalf;
  const lIn = CX - legC + ankleHalf;
  const rIn = CX + legC - ankleHalf;
  const rOut = CX + legC + ankleHalf;

  const leggingsD = [
    `M ${pt(CX - legWaist, wTop)}`,
    `C ${pt(CX - hip, wTop + 18)} ${pt(CX - hip, hipY - 10)} ${pt(CX - hip, hipY)}`,
    `C ${pt(CX - hip + 2, hipY + 42)} ${pt(lOut - 2, legHemY - 42)} ${pt(lOut, legHemY)}`,
    `L ${pt(lIn, legHemY)}`,
    `C ${pt(lIn - 2, legHemY - 62)} ${pt(CX - 6, crotchY + 32)} ${pt(CX, crotchY)}`,
    `C ${pt(CX + 6, crotchY + 32)} ${pt(rIn + 2, legHemY - 62)} ${pt(rIn, legHemY)}`,
    `L ${pt(rOut, legHemY)}`,
    `C ${pt(rOut + 2, legHemY - 42)} ${pt(CX + hip - 2, hipY + 42)} ${pt(CX + hip, hipY)}`,
    `C ${pt(CX + hip, hipY - 10)} ${pt(CX + legWaist, wTop + 18)} ${pt(CX + legWaist, wTop)}`,
    `Q ${pt(CX, wTop - 6)} ${pt(CX - legWaist, wTop)}`,
    `Z`,
  ].join(" ");

  return {
    bodyD,
    bodyOpacity: isLeg ? 0 : 1,
    leggingsD,
    leggingsOpacity: isLeg ? 1 : 0,
    leggingsBandY: wTop + 10,
    leggingsBandHalf: legWaist - 3,
    leftSleeveD: sleeveD(-1),
    rightSleeveD: sleeveD(1),
    sleeveOpacity: isLeg ? 0 : sleeveOpacity,
    hoodD,
    hoodOpacity: hood ? 1 : 0,
    pocketD,
    pocketOpacity: hood ? 1 : 0,
    zipY1: topY + neckDepth + 4,
    zipY2: hemY - 8,
    zipOpacity: zip ? 1 : 0,
    ribOpacity: rib ? 1 : 0,
    ribXs,
    // 디테일 오버레이 기준점 — 레깅스는 하의 기준으로 치환
    topY: isLeg ? wTop : topY,
    neckDepth: isLeg ? 0 : neckDepth,
    neckHalf,
    shoulderHalf: shoulder,
    shoulderY,
    underarmY: isLeg ? hipY - 10 : underarmY,
    waistY: isLeg ? wTop + 10 : waistY,
    waistHalf: isLeg ? legWaist : waist,
    hemY: isLeg ? legHemY : hemY,
    hemHalf: isLeg ? legC + ankleHalf + 4 : hemHalf,
  };
}

/** Slightly darken a hex color for strokes / pattern marks. */
export function darken(hex: string, amount = 0.35): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const f = (v: number) => Math.max(0, Math.round(v * (1 - amount)));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

/** Whether a color is light enough to need a visible outline. */
export function isLight(hex: string): boolean {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
