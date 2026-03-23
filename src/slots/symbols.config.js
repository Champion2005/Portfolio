export const GRID_COLUMNS = 7;
export const GRID_ROWS = 6;
export const MIN_CLUSTER_SIZE = 5;
export const WILD_SYMBOL_ID = "WILD";
export const PAYTABLE_CAP_CLUSTER_SIZE = 12;
export const PAYTABLE_CAP_MULTIPLIER = 100;
export const PAYTABLE_CURVE_EXPONENT = 2.2;

export const SLOT_SYMBOLS = [
  {
    id: "n1",
    label: "CSS Shield",
    kind: "premium",
    renderType: "asset",
    assetPath: "/slots/assets/n1.svg",
    weight: 1.25,
    payoutTier: 8,
    basePayoutMultiplier: 2.5,
  },
  {
    id: "n2",
    label: "Snake",
    kind: "premium",
    renderType: "asset",
    assetPath: "/slots/assets/n2.webp",
    weight: 3.6,
    payoutTier: 6,
    basePayoutMultiplier: 1.2,
  },
  {
    id: "A",
    label: "A",
    kind: "basic",
    renderType: "text",
    weight: 25,
    payoutTier: 4,
    basePayoutMultiplier: 0.5,
  },
  {
    id: "K",
    label: "K",
    kind: "basic",
    renderType: "text",
    weight: 24,
    payoutTier: 3,
    basePayoutMultiplier: 0.35,
  },
  {
    id: "Q",
    label: "Q",
    kind: "basic",
    renderType: "text",
    weight: 23,
    payoutTier: 2,
    basePayoutMultiplier: 0.2,
  },
  {
    id: "J",
    label: "J",
    kind: "basic",
    renderType: "text",
    weight: 22,
    payoutTier: 1,
    basePayoutMultiplier: 0.1,
  },
  {
    id: "WILD",
    label: "WILD",
    kind: "special",
    renderType: "asset",
    assetPath: "/slots/assets/WILD.svg",
    weight: 0.5,
    payoutTier: 0,
  },
];
