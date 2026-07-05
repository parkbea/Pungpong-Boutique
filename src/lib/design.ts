export type GarmentId =
  | "tshirt"
  | "blouse"
  | "shirt"
  | "onepiece"
  | "dress"
  | "jumper"
  | "hoodie"
  | "knit"
  | "leggings";

export type FitId = "slim" | "regular" | "over" | "aline";
export type LengthId = "crop" | "midi" | "long" | "mini" | "maxi";
export type SleeveId = "sleeveless" | "short" | "long" | "puff" | "wide";
export type NecklineId = "round" | "v" | "off" | "halter" | "square";
export type PatternId =
  | "solid"
  | "stripe"
  | "check"
  | "gingham"
  | "floral"
  | "dot"
  | "zigzag"
  | "heart"
  | "star"
  | "leopard";
export type SockLengthId = "ankle" | "mid" | "knee" | "over";
export type CarryId =
  | "none"
  | "bouquet"
  | "backpack"
  | "handbag"
  | "doll"
  | "wand"
  | "balloon"
  | "phone"
  | "headphones";
export type CarryStyleId = "simple" | "minimal" | "bow" | "floral";
export type BackgroundId = "flower" | "france" | "sea" | "space" | "room" | "zoo";
export type StylePresetId = "romantic" | "minimal" | "vintage" | "casual";
export type MaterialId =
  | "cotton"
  | "denim"
  | "knit"
  | "silk"
  | "chiffon"
  | "lace"
  | "padding"
  | "corduroy"
  | "leather"
  | "fleece"
  | "wool"
  | "velvet"
  | "tweed"
  | "spandex";
export type ShoeId =
  | "none"
  | "heels"
  | "flats"
  | "sneakers"
  | "boots"
  | "sandals"
  | "loafers"
  | "slippers";
export type DetailId =
  | "frill"
  | "shirring"
  | "belt"
  | "button"
  | "embroidery"
  | "pocket"
  | "ribbon"
  | "slit"
  | "pleats"
  | "lacetrim"
  | "drawstring"
  | "sidestripe"
  | "beads";
export type CollarId = "none" | "shirt" | "mandarin" | "sailor" | "ribbon";

export interface Option<T extends string> {
  id: T;
  ko: string;
  en: string;
}

export const GARMENTS: Option<GarmentId>[] = [
  { id: "tshirt", ko: "티셔츠", en: "t-shirt" },
  { id: "blouse", ko: "블라우스", en: "blouse" },
  { id: "shirt", ko: "셔츠", en: "button-up shirt" },
  { id: "onepiece", ko: "원피스", en: "one-piece dress" },
  { id: "dress", ko: "드레스", en: "elegant dress" },
  { id: "jumper", ko: "점퍼", en: "zip-up jumper jacket" },
  { id: "hoodie", ko: "후드", en: "hoodie" },
  { id: "knit", ko: "니트", en: "knit sweater" },
  { id: "leggings", ko: "레깅스", en: "leggings" },
];

export const FITS: Option<FitId>[] = [
  { id: "slim", ko: "슬림", en: "slim-fit" },
  { id: "regular", ko: "레귤러", en: "regular-fit" },
  { id: "over", ko: "오버", en: "oversized" },
  { id: "aline", ko: "A라인", en: "A-line" },
];

export const LENGTHS_BASIC: Option<LengthId>[] = [
  { id: "crop", ko: "크롭", en: "crop" },
  { id: "midi", ko: "미디", en: "midi" },
  { id: "long", ko: "롱", en: "long" },
];

export const LENGTHS_DRESS: Option<LengthId>[] = [
  { id: "mini", ko: "미니", en: "mini" },
  { id: "midi", ko: "미디", en: "midi" },
  { id: "maxi", ko: "맥시", en: "maxi" },
];

export const SLEEVES: Option<SleeveId>[] = [
  { id: "sleeveless", ko: "민소매", en: "sleeveless" },
  { id: "short", ko: "반팔", en: "short" },
  { id: "long", ko: "긴팔", en: "long" },
  { id: "puff", ko: "퍼프", en: "puff" },
  { id: "wide", ko: "와이드", en: "wide" },
];

export const NECKLINES: Option<NecklineId>[] = [
  { id: "round", ko: "라운드", en: "round" },
  { id: "v", ko: "브이", en: "V" },
  { id: "off", ko: "오프숄더", en: "off-shoulder" },
  { id: "halter", ko: "홀터", en: "halter" },
  { id: "square", ko: "스퀘어", en: "square" },
];

export const PATTERNS: Option<PatternId>[] = [
  { id: "solid", ko: "무지", en: "solid plain" },
  { id: "stripe", ko: "스트라이프", en: "striped" },
  { id: "check", ko: "체크", en: "checked" },
  { id: "gingham", ko: "깅엄", en: "gingham check" },
  { id: "floral", ko: "플로럴", en: "floral" },
  { id: "dot", ko: "도트", en: "polka dot" },
  { id: "zigzag", ko: "지그재그", en: "zigzag chevron" },
  { id: "heart", ko: "하트", en: "heart-print" },
  { id: "star", ko: "별", en: "star-print" },
  { id: "leopard", ko: "레오파드", en: "leopard-print" },
];

export const COLLARS: Option<CollarId>[] = [
  { id: "none", ko: "없음", en: "" },
  { id: "shirt", ko: "셔츠 칼라", en: "a classic shirt collar" },
  { id: "mandarin", ko: "차이나 칼라", en: "a mandarin collar" },
  { id: "sailor", ko: "세일러 칼라", en: "a wide sailor collar" },
  { id: "ribbon", ko: "리본 타이", en: "a ribbon bow tie collar" },
];

export const SOCK_LENGTHS: Option<SockLengthId>[] = [
  { id: "ankle", ko: "발목", en: "ankle" },
  { id: "mid", ko: "중간", en: "mid-calf" },
  { id: "knee", ko: "무릎", en: "knee-high" },
  { id: "over", ko: "오버니", en: "over-the-knee" },
];

export const CARRIES: Option<CarryId>[] = [
  { id: "none", ko: "없음", en: "" },
  { id: "bouquet", ko: "꽃다발", en: "a bouquet" },
  { id: "backpack", ko: "백팩", en: "a backpack" },
  { id: "handbag", ko: "핸드백", en: "a handbag" },
  { id: "doll", ko: "인형", en: "a plush doll" },
  { id: "wand", ko: "마술봉", en: "a magic wand" },
  { id: "balloon", ko: "풍선", en: "a balloon" },
  { id: "phone", ko: "휴대폰", en: "a smartphone" },
  { id: "headphones", ko: "헤드폰", en: "headphones" },
];

export const CARRY_STYLES: Option<CarryStyleId>[] = [
  { id: "simple", ko: "심플", en: "simple" },
  { id: "minimal", ko: "미니멀", en: "minimal" },
  { id: "bow", ko: "리본", en: "bow-accented" },
  { id: "floral", ko: "플로럴", en: "floral" },
];

export const BACKGROUNDS: Option<BackgroundId>[] = [
  { id: "flower", ko: "꽃밭", en: "flower field" },
  { id: "france", ko: "프랑스", en: "Paris street in France" },
  { id: "sea", ko: "바다", en: "seaside beach" },
  { id: "space", ko: "우주", en: "outer space" },
  { id: "room", ko: "방", en: "cozy room" },
  { id: "zoo", ko: "동물원", en: "zoo" },
];

export const STYLE_PRESETS: Option<StylePresetId>[] = [
  { id: "romantic", ko: "로맨틱", en: "romantic" },
  { id: "minimal", ko: "미니멀", en: "minimal" },
  { id: "vintage", ko: "빈티지", en: "vintage" },
  { id: "casual", ko: "캐주얼", en: "casual" },
];

export interface GarmentScoped<T extends string> extends Option<T> {
  for?: GarmentId[];
}

export type DetailOption = GarmentScoped<DetailId>;
export type MaterialOption = GarmentScoped<MaterialId>;

const ALL_TOPS: GarmentId[] = [
  "tshirt",
  "blouse",
  "shirt",
  "onepiece",
  "dress",
  "jumper",
  "hoodie",
  "knit",
];

const ALL_GARMENTS: GarmentId[] = [...ALL_TOPS, "leggings"];

export const MATERIALS: MaterialOption[] = [
  { id: "cotton", ko: "코튼", en: "cotton", for: ALL_GARMENTS },
  { id: "denim", ko: "데님", en: "denim", for: ["shirt", "jumper", "onepiece", "dress", "leggings"] },
  { id: "knit", ko: "니트", en: "soft knit fabric", for: ["knit", "blouse", "onepiece", "dress", "hoodie"] },
  { id: "silk", ko: "실크", en: "silk", for: ["blouse", "shirt", "onepiece", "dress"] },
  { id: "chiffon", ko: "시폰", en: "chiffon", for: ["blouse", "onepiece", "dress"] },
  { id: "lace", ko: "레이스", en: "lace", for: ["blouse", "onepiece", "dress"] },
  { id: "padding", ko: "패딩", en: "quilted puffer padding", for: ["jumper", "hoodie"] },
  { id: "corduroy", ko: "코듀로이", en: "corduroy", for: ["jumper", "shirt", "onepiece", "dress", "leggings"] },
  { id: "leather", ko: "레더", en: "leather", for: ["jumper", "onepiece", "dress", "leggings"] },
  { id: "fleece", ko: "플리스", en: "soft fleece", for: ["jumper", "hoodie", "knit"] },
  { id: "wool", ko: "울", en: "wool", for: ["knit", "jumper", "onepiece", "dress"] },
  { id: "velvet", ko: "벨벳", en: "velvet", for: ["onepiece", "dress", "blouse", "leggings"] },
  { id: "tweed", ko: "트위드", en: "tweed", for: ["jumper", "onepiece", "dress"] },
  { id: "spandex", ko: "스판덱스", en: "stretch spandex", for: ["leggings", "tshirt"] },
];

export function materialOptionsFor(garment: GarmentId): MaterialOption[] {
  return MATERIALS.filter((m) => !m.for || m.for.includes(garment));
}

export const SHOES: Option<ShoeId>[] = [
  { id: "none", ko: "없음", en: "" },
  { id: "heels", ko: "구두", en: "high-heeled pumps" },
  { id: "flats", ko: "플랫", en: "flat shoes" },
  { id: "sneakers", ko: "운동화", en: "sneakers" },
  { id: "boots", ko: "부츠", en: "ankle boots" },
  { id: "sandals", ko: "샌들", en: "strappy sandals" },
  { id: "loafers", ko: "로퍼", en: "loafers" },
  { id: "slippers", ko: "슬리퍼", en: "slippers" },
];

export const DETAILS: DetailOption[] = [
  { id: "frill", ko: "프릴", en: "frill", for: ["tshirt", "blouse", "shirt", "onepiece", "dress", "knit"] },
  { id: "shirring", ko: "셔링", en: "shirring", for: ["blouse", "onepiece", "dress"] },
  { id: "belt", ko: "벨트", en: "a waist belt", for: ["shirt", "blouse", "onepiece", "dress", "jumper"] },
  { id: "button", ko: "버튼", en: "decorative buttons", for: ["shirt", "blouse", "jumper", "knit", "onepiece", "dress"] },
  { id: "embroidery", ko: "자수", en: "embroidery", for: ALL_TOPS },
  { id: "pocket", ko: "포켓", en: "patch pockets", for: ["tshirt", "shirt", "onepiece", "jumper", "hoodie", "leggings"] },
  { id: "ribbon", ko: "리본", en: "a ribbon bow", for: ["blouse", "onepiece", "dress", "knit"] },
  { id: "slit", ko: "슬릿", en: "a side slit", for: ["onepiece", "dress"] },
  { id: "pleats", ko: "플리츠", en: "pleats", for: ["blouse", "onepiece", "dress"] },
  { id: "lacetrim", ko: "레이스 트림", en: "delicate lace trim", for: ["tshirt", "blouse", "onepiece", "dress"] },
  { id: "drawstring", ko: "드로스트링", en: "a drawstring", for: ["hoodie", "jumper", "leggings"] },
  { id: "sidestripe", ko: "사이드 라인", en: "contrast side stripes", for: ["leggings", "jumper", "hoodie"] },
  { id: "beads", ko: "비즈", en: "bead embellishments", for: ["onepiece", "dress"] },
];

export function detailOptionsFor(garment: GarmentId): DetailOption[] {
  return DETAILS.filter((d) => !d.for || d.for.includes(garment));
}

export interface ColorOption {
  id: string;
  ko: string;
  en: string;
  hex: string;
}

export const COLORS: ColorOption[] = [
  { id: "ivory", ko: "아이보리", en: "ivory", hex: "#F3EDE2" },
  { id: "white", ko: "화이트", en: "pure white", hex: "#FFFFFF" },
  { id: "black", ko: "블랙", en: "black", hex: "#23211F" },
  { id: "charcoal", ko: "차콜", en: "charcoal gray", hex: "#55514C" },
  { id: "beige", ko: "베이지", en: "warm beige", hex: "#D9C5A3" },
  { id: "pink", ko: "블러시 핑크", en: "blush pink", hex: "#F0C3CD" },
  { id: "lavender", ko: "라벤더", en: "soft lavender", hex: "#C4B5E0" },
  { id: "skyblue", ko: "스카이 블루", en: "sky blue", hex: "#A9CBE8" },
  { id: "mint", ko: "민트", en: "mint green", hex: "#B5E0D0" },
  { id: "sage", ko: "세이지", en: "sage green", hex: "#9DAF8B" },
  { id: "mustard", ko: "머스터드", en: "mustard yellow", hex: "#D4A937" },
  { id: "burgundy", ko: "버건디", en: "deep burgundy", hex: "#7B2D3B" },
  { id: "navy", ko: "네이비", en: "navy blue", hex: "#2D3A5C" },
  { id: "red", ko: "레드", en: "vivid red", hex: "#C03A2E" },
];

export interface Design {
  garment: GarmentId;
  fit: FitId;
  length: LengthId;
  sleeve: SleeveId;
  neckline: NecklineId;
  collar: CollarId;
  colorId: string;
  pattern: PatternId;
  patternColorId: string;
  material: MaterialId;
  details: DetailId[];
  shoe: ShoeId;
  shoeColorId: string;
  socksEnabled: boolean;
  socksColorId: string;
  socksLength: SockLengthId;
  carry: CarryId[];
  carryColorId: string;
  carryStyle: CarryStyleId;
  background: BackgroundId;
}

export const DEFAULT_DESIGN: Design = {
  garment: "tshirt",
  fit: "regular",
  length: "midi",
  sleeve: "short",
  neckline: "round",
  collar: "none",
  colorId: "ivory",
  pattern: "solid",
  patternColorId: "navy",
  material: "cotton",
  details: [],
  shoe: "none",
  shoeColorId: "black",
  socksEnabled: false,
  socksColorId: "white",
  socksLength: "mid",
  carry: [],
  carryColorId: "black",
  carryStyle: "simple",
  background: "room",
};

export function applyStylePreset(design: Design, preset: StylePresetId): Design {
  const presetMap: Record<StylePresetId, Partial<Design>> = {
    romantic: {
      colorId: "pink",
      pattern: "floral",
      patternColorId: "burgundy",
      material: "chiffon",
      details: ["frill", "ribbon"],
      socksEnabled: true,
      socksColorId: "ivory",
      socksLength: "knee",
      carry: ["bouquet"],
      carryColorId: "pink",
      carryStyle: "bow",
      background: "flower",
      shoe: "heels",
      shoeColorId: "black",
    },
    minimal: {
      colorId: "black",
      pattern: "solid",
      patternColorId: "white",
      material: "cotton",
      details: [],
      socksEnabled: false,
      socksLength: "mid",
      carry: [],
      carryColorId: "black",
      carryStyle: "minimal",
      background: "room",
      shoe: "loafers",
      shoeColorId: "black",
    },
    vintage: {
      colorId: "mustard",
      pattern: "check",
      patternColorId: "burgundy",
      material: "corduroy",
      details: ["embroidery", "pocket"],
      socksEnabled: true,
      socksColorId: "beige",
      socksLength: "knee",
      carry: ["backpack"],
      carryColorId: "navy",
      carryStyle: "minimal",
      background: "france",
      shoe: "boots",
      shoeColorId: "beige",
    },
    casual: {
      colorId: "skyblue",
      pattern: "stripe",
      patternColorId: "navy",
      material: "denim",
      details: ["pocket"],
      socksEnabled: true,
      socksColorId: "white",
      socksLength: "ankle",
      carry: ["handbag"],
      carryColorId: "beige",
      carryStyle: "simple",
      background: "sea",
      shoe: "sneakers",
      shoeColorId: "white",
    },
  };

  return { ...design, ...presetMap[preset] };
}

export function isDressLike(garment: GarmentId): boolean {
  return garment === "onepiece" || garment === "dress";
}

export function lengthOptionsFor(garment: GarmentId): Option<LengthId>[] {
  return isDressLike(garment) ? LENGTHS_DRESS : LENGTHS_BASIC;
}

function find<T extends string>(options: Option<T>[], id: T): Option<T> {
  return options.find((o) => o.id === id) ?? options[0];
}

export function labelOf<T extends string>(options: Option<T>[], id: T): string {
  return find(options, id).ko;
}

export function colorOf(design: Design): ColorOption {
  return COLORS.find((c) => c.id === design.colorId) ?? COLORS[0];
}

export function patternColorOf(design: Design): ColorOption {
  return COLORS.find((c) => c.id === design.patternColorId) ?? COLORS[0];
}

export function shoeColorOf(design: Design): ColorOption {
  return COLORS.find((c) => c.id === design.shoeColorId) ?? COLORS[2];
}

export function shoeOptionsFor(garment: GarmentId): Option<ShoeId>[] {
  const map: Record<GarmentId, ShoeId[]> = {
    tshirt: ["sneakers", "flats", "loafers", "sandals", "slippers"],
    blouse: ["heels", "flats", "loafers", "sandals"],
    shirt: ["sneakers", "loafers", "flats", "boots"],
    onepiece: ["heels", "flats", "sandals", "boots"],
    dress: ["heels", "sandals", "flats"],
    jumper: ["sneakers", "boots", "loafers"],
    hoodie: ["sneakers", "slippers", "boots"],
    knit: ["boots", "loafers", "flats", "sneakers"],
    leggings: ["sneakers", "slippers", "boots", "flats"],
  };
  const allowed = map[garment] ?? [];
  return SHOES.filter((s) => s.id === "none" || allowed.includes(s.id));
}

function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

export function buildPrompt(design: Design): string {
  const garment = find(GARMENTS, design.garment);
  const fit = find(FITS, design.fit);
  const length = find(lengthOptionsFor(design.garment), design.length);
  const sleeve = find(SLEEVES, design.sleeve);
  const neckline = find(NECKLINES, design.neckline);
  const pattern = find(PATTERNS, design.pattern);
  const material = find(MATERIALS, design.material);
  const collar = find(COLLARS, design.collar);
  const color = colorOf(design);
  const patternColor = patternColorOf(design);
  const socksColor = COLORS.find((c) => c.id === design.socksColorId) ?? COLORS[0];
  const socksLength = find(SOCK_LENGTHS, design.socksLength);
  const carryStyle = find(CARRY_STYLES, design.carryStyle);
  const carryColor = COLORS.find((c) => c.id === design.carryColorId) ?? COLORS[2];
  const background = find(BACKGROUNDS, design.background);

  const patternText =
    design.pattern === "solid"
      ? "a solid plain design"
      : `${article(patternColor.en)} ${patternColor.en} ${pattern.en} pattern`;

  const neckText =
    `${neckline.en} neckline` +
    (design.collar !== "none" ? ` with ${collar.en}` : "");

  const applicable = new Set(detailOptionsFor(design.garment).map((o) => o.id));
  const detailNames = design.details
    .filter((d) => applicable.has(d))
    .map((d) => DETAILS.find((o) => o.id === d)?.en)
    .filter((x): x is string => Boolean(x));
  const detailText =
    detailNames.length === 0
      ? "a clean minimal finish"
      : detailNames.length === 1
        ? `${detailNames[0]} details`
        : `${detailNames.slice(0, -1).join(", ")} and ${detailNames[detailNames.length - 1]} details`;

  const sleeveText =
    design.sleeve === "sleeveless"
      ? "sleeveless design"
      : `${sleeve.en} sleeves`;

  const fitArticle = article(fit.en) === "an" ? "An" : "A";

  const socksText = design.socksEnabled
    ? `${socksColor.en} ${socksLength.en} socks`
    : null;
  const carryTexts = design.carry
    .filter((id) => id !== "none")
    .map((id) => {
      const carry = find(CARRIES, id);
      if (id === "bouquet") return `${carryColor.en} ${carryStyle.en} bouquet`;
      if (id === "headphones") return `${carryColor.en} ${carryStyle.en} headphones`;
      return `${carryColor.en} ${carryStyle.en} ${carry.en}`;
    });
  const accessoryText = [
    socksText,
    carryTexts.length > 0 ? `carrying ${carryTexts.join(", ")}` : null,
  ]
    .filter((x): x is string => Boolean(x))
    .join(" and ");
  const accessorySentence = accessoryText ? `, with ${accessoryText}` : "";
  const backgroundText = `${background.en} background`;

  const shoe = find(SHOES, design.shoe);
  const shoeColor = shoeColorOf(design);
  const styledWith =
    design.shoe !== "none"
      ? ` Styled with ${shoeColor.en} ${shoe.en}, full-body styling.`
      : "";
  const displayText =
    design.shoe !== "none"
      ? `Studio fashion photography, full-body front view, ${backgroundText}, headless mannequin display (no face), photorealistic, high detail.`
      : `Studio product photography, front view, ${backgroundText}, mannequin display (no face), photorealistic, high detail.`;

  if (design.garment === "leggings") {
    const capFit = fit.en.charAt(0).toUpperCase() + fit.en.slice(1);
    return (
      `${capFit} women's leggings in ${color.en}, made of ${material.en}, ` +
      `featuring ${patternText} with ${detailText}, high-waisted, ${length.en}-length${accessorySentence}.` +
      `${styledWith} ${displayText}`
    );
  }

  return (
    `${fitArticle} ${fit.en} women's ${garment.en} in ${color.en}, made of ${material.en}, ` +
    `featuring ${patternText} with ${detailText}, ${neckText}, ` +
    `${sleeveText}, ${length.en}-length${accessorySentence}.` +
    `${styledWith} ${displayText}`
  );
}
