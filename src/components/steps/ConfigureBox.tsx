"use client";

import { ChevronRight, Check } from "lucide-react";
import {
  type OrderConfig,
  type BoxSize,
  type BoxTheme,
  type OrderType,
  type SubDuration,
  BOX_PRICING,
  RAMADAN_START,
  computePrices,
  fmt,
} from "@/lib/order";
import { cn } from "@/lib/utils";
import RamadanCalendar from "@/components/RamadanCalendar";

/* ─── Constants ─── */

const THEMES: { value: BoxTheme; icon: string; label: string; subtitle: string }[] = [
  {
    value: "traditional",
    icon: "\u{1F3FA}",
    label: "Traditional Tlemcen",
    subtitle: "Harira, Bourek, traditional salads",
  },
  {
    value: "mixed",
    icon: "\u{1F37D}\uFE0F",
    label: "Mixed Algerian",
    subtitle: "A taste of all regions",
  },
  {
    value: "light",
    icon: "\u{1F957}",
    label: "Light Ramadan",
    subtitle: "Lighter soups, fresh salads",
  },
];

const ORDER_OPTIONS: {
  orderType: OrderType;
  subDuration: SubDuration;
  label: string;
  badge?: string;
  badgeColor?: string;
}[] = [
  {
    orderType: "one-day",
    subDuration: 10,
    label: "One-Day",
  },
  {
    orderType: "subscription",
    subDuration: 10,
    label: "10-Day",
    badge: "Save 13%",
    badgeColor: "text-accent bg-accent/10",
  },
  {
    orderType: "subscription",
    subDuration: 30,
    label: "30-Day",
    badge: "Best value",
    badgeColor: "text-primary-foreground bg-primary",
  },
];

/* ─── Component ─── */

interface ConfigureBoxProps {
  order: OrderConfig;
  onOrderChange: (updated: OrderConfig) => void;
  onNext: () => void;
}

export default function ConfigureBox({ order, onOrderChange, onNext }: ConfigureBoxProps) {
  const prices = computePrices(order);

  function set<K extends keyof OrderConfig>(key: K, value: OrderConfig[K]) {
    onOrderChange({ ...order, [key]: value });
  }

  /* Determine which order option is active */
  const activeOptionIdx = order.orderType === "one-day"
    ? 0
    : order.subDuration === 10
      ? 1
      : 2;

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* ─── Left: Selections ─── */}
      <div className="flex-1 min-w-0">
        {/* Section A — Box Theme */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            Choose Your Box Theme
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Each theme features a curated Algerian menu
          </p>

          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => {
              const selected = order.boxTheme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => set("boxTheme", t.value)}
                  className={cn(
                    "relative rounded-2xl border-2 p-4 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  {selected && (
                    <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                  <span className="text-2xl leading-none block mb-2">{t.icon}</span>
                  <h3 className="text-sm font-bold text-foreground leading-snug">
                    {t.label}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    {t.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section B — Box Size */}
        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            Box Size
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Same quality, different portions
          </p>

          <div className="grid grid-cols-2 gap-4">
            {(["single", "family"] as BoxSize[]).map((size) => {
              const selected = order.boxSize === size;
              const label = size === "single" ? "Single" : "Family";
              const sub = size === "single" ? "1\u20132 persons" : "4\u20136 persons";
              const tier =
                order.orderType === "one-day"
                  ? "one-day"
                  : order.subDuration === 10
                    ? "sub-10"
                    : "sub-30";
              const price = BOX_PRICING[size][tier as keyof (typeof BOX_PRICING)["single"]];

              return (
                <button
                  key={size}
                  onClick={() => set("boxSize", size)}
                  className={cn(
                    "relative rounded-2xl border-2 p-5 text-left transition-all",
                    selected
                      ? "border-primary bg-white shadow-lg ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  {selected && (
                    <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </span>
                  )}
                  {size === "family" && (
                    <span className="absolute -top-2.5 left-4 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Better value
                    </span>
                  )}
                  <h3 className="text-base font-bold text-foreground">{label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                  <p className="text-lg font-extrabold text-primary mt-3">
                    ${fmt(price)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      / day
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section C — Order Type (segmented control) */}
        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            Order Type
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Subscribers save on every meal &amp; add-on
          </p>

          <div className="flex rounded-xl border-2 border-border bg-muted/50 p-1">
            {ORDER_OPTIONS.map((opt, idx) => {
              const active = idx === activeOptionIdx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const isFull = opt.orderType === "subscription" && opt.subDuration === 30;
                    onOrderChange({
                      ...order,
                      orderType: opt.orderType,
                      subDuration: opt.subDuration,
                      startDate: isFull ? RAMADAN_START : "",
                    });
                  }}
                  className={cn(
                    "flex-1 relative rounded-lg py-3 px-2 text-center text-sm font-bold transition-all",
                    active
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                  {opt.badge && (
                    <span
                      className={cn(
                        "absolute -top-2 right-1 sm:relative sm:top-auto sm:right-auto sm:ml-1.5 inline-block text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap",
                        opt.badgeColor
                      )}
                    >
                      {opt.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section D — Ramadan Calendar */}
        <RamadanCalendar
          order={order}
          onStartDateChange={(date) => set("startDate", date)}
        />

        {/* Continue button (desktop) */}
        <div className="mt-10 hidden lg:block">
          <button
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            Continue to Add-ons
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── Right: Price Summary (desktop sidebar) ─── */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24">
          <PriceSummary order={order} />
        </div>
      </div>

    </div>
  );
}

/* ─── Price Summary Card ─── */

function PriceSummary({ order }: { order: OrderConfig }) {
  const prices = computePrices(order);
  const isSubscription = order.orderType === "subscription";

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Your Selection</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Theme</span>
          <span className="font-semibold text-foreground">
            {THEMES.find((t) => t.value === order.boxTheme)?.label}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Box</span>
          <span className="font-semibold text-foreground">
            {order.boxSize === "single" ? "Single" : "Family"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-semibold text-foreground">
            {order.orderType === "one-day"
              ? "One-day"
              : `${order.subDuration}-day sub`}
          </span>
        </div>

        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-bold text-foreground">Price / day</span>
          <span
            key={prices.dailyTotal}
            className="text-lg font-extrabold text-primary animate-price-pop"
          >
            ${fmt(prices.dailyTotal)}
          </span>
        </div>

        {isSubscription && (
          <>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{prices.days} days total</span>
              <span className="font-semibold">${fmt(prices.mealTotal)} CAD</span>
            </div>
            {prices.savings > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-accent font-semibold">You save</span>
                <span className="text-accent font-bold">${fmt(prices.savings)}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
