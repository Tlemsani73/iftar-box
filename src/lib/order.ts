export type BoxSize = "single" | "family";
export type BoxTheme = "traditional" | "mixed" | "light";
export type OrderType = "one-day" | "subscription";
export type SubDuration = 10 | 30;
export type BourekOption = 0 | 1 | 6 | 12;
export type HmissOption = "none" | "small" | "large";
export type PriceTier = "one-day" | "sub-10" | "sub-30";
export type DeliveryMethod = "pickup" | "delivery";

/* ─── Ramadan 2026 dates ─── */
export const RAMADAN_START = "2026-02-18";
export const RAMADAN_END = "2026-03-19";

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
};

export interface OrderConfig {
  boxSize: BoxSize;
  boxTheme: BoxTheme;
  orderType: OrderType;
  subDuration: SubDuration;
  bourekOption: BourekOption;
  hmissOption: HmissOption;
  saladExtra: number;
  startDate: string; // YYYY-MM-DD within Ramadan
}

export function getPriceTier(orderType: OrderType, subDuration: SubDuration): PriceTier {
  if (orderType === "one-day") return "one-day";
  return subDuration === 10 ? "sub-10" : "sub-30";
}

export function tierFromOrder(order: OrderConfig): PriceTier {
  return getPriceTier(order.orderType, order.subDuration);
}

/* ─── Pricing constants (3-tier) ─── */

export const BOX_PRICING = {
  single: { "one-day": 23, "sub-10": 20, "sub-30": 18 },
  family: { "one-day": 85, "sub-10": 73, "sub-30": 65 },
} as const;

export const BOUREK_PRICING = {
  1:  { "one-day": 2.5, "sub-10": 2, "sub-30": 2 },
  6:  { "one-day": 14,  "sub-10": 12, "sub-30": 12 },
  12: { "one-day": 26,  "sub-10": 22, "sub-30": 22 },
} as const;

export const HMISS_PRICING = {
  small: { "one-day": 5, "sub-10": 4, "sub-30": 4 },
  large: { "one-day": 9, "sub-10": 8, "sub-30": 8 },
} as const;

export const SALAD_PRICING = { "one-day": 4, "sub-10": 3, "sub-30": 3 } as const;

export const DELIVERY_FEE_ONEDAY = 5;

export const INCLUDED = {
  single: [
    "Harira (soup)",
    "2 Boureks",
    "Fresh salad",
    "Bread, dates & sharbat",
  ],
  family: [
    "Harira ×4",
    "Boureks ×8",
    "Salad ×4",
    "Bread, dates & sharbat (family)",
  ],
} as const;

export function computePrices(order: OrderConfig, deliveryMethod: DeliveryMethod = "pickup") {
  const tier = tierFromOrder(order);
  const boxPrice = BOX_PRICING[order.boxSize][tier];

  let addonsDaily = 0;
  if (order.bourekOption > 0) {
    addonsDaily += BOUREK_PRICING[order.bourekOption as 1 | 6 | 12][tier];
  }
  if (order.hmissOption !== "none") {
    addonsDaily += HMISS_PRICING[order.hmissOption][tier];
  }
  addonsDaily += SALAD_PRICING[tier] * order.saladExtra;

  const dailyTotal = boxPrice + addonsDaily;
  const days = order.orderType === "one-day" ? 1 : order.subDuration;
  const mealTotal = dailyTotal * days;

  let deliveryFee = 0;
  if (deliveryMethod === "delivery" && order.orderType === "one-day") {
    deliveryFee = DELIVERY_FEE_ONEDAY;
  }

  const grandTotal = mealTotal + deliveryFee;

  let savings = 0;
  if (order.orderType === "subscription") {
    const oneDayBox = BOX_PRICING[order.boxSize]["one-day"];
    let oneDayAddons = 0;
    if (order.bourekOption > 0) {
      oneDayAddons += BOUREK_PRICING[order.bourekOption as 1 | 6 | 12]["one-day"];
    }
    if (order.hmissOption !== "none") {
      oneDayAddons += HMISS_PRICING[order.hmissOption]["one-day"];
    }
    oneDayAddons += SALAD_PRICING["one-day"] * order.saladExtra;
    savings = ((oneDayBox + oneDayAddons) - (boxPrice + addonsDaily)) * days;
  }

  return { boxPrice, addonsDaily, dailyTotal, days, mealTotal, deliveryFee, grandTotal, savings };
}

export function orderToSearchParams(order: OrderConfig): string {
  const p = new URLSearchParams();
  p.set("box", order.boxSize);
  p.set("theme", order.boxTheme);
  p.set("type", order.orderType);
  p.set("duration", String(order.subDuration));
  p.set("boureks", String(order.bourekOption));
  p.set("hmiss", order.hmissOption);
  p.set("salad", String(order.saladExtra));
  if (order.startDate) p.set("start", order.startDate);
  return p.toString();
}

export function searchParamsToOrder(params: URLSearchParams): OrderConfig {
  const box = params.get("box");
  const theme = params.get("theme");
  const type = params.get("type");
  const duration = params.get("duration");
  const boureks = params.get("boureks");
  const hmiss = params.get("hmiss");
  const salad = params.get("salad");

  return {
    boxSize: box === "family" ? "family" : "single",
    boxTheme: (["traditional", "mixed", "light"].includes(theme || "")
      ? theme
      : "traditional") as BoxTheme,
    orderType: type === "one-day" ? "one-day" : "subscription",
    subDuration: duration === "10" ? 10 : 30,
    bourekOption: ([0, 1, 6, 12].includes(Number(boureks))
      ? Number(boureks)
      : 0) as BourekOption,
    hmissOption: (["none", "small", "large"].includes(hmiss || "")
      ? hmiss
      : "none") as HmissOption,
    saladExtra: Math.max(0, Math.min(4, Number(salad) || 0)),
    startDate: params.get("start") ?? "",
  };
}

export function fmt(n: number) {
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}
