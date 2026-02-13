"use client";

import { ChevronRight, ChevronLeft, Flame, CookingPot, Salad } from "lucide-react";
import {
  type OrderConfig,
  type BourekOption,
  type HmissOption,
  BOUREK_PRICING,
  HMISS_PRICING,
  SALAD_PRICING,
  tierFromOrder,
  computePrices,
  fmt,
} from "@/lib/order";
import { cn } from "@/lib/utils";

/* ─── Option data ─── */

const BOUREK_OPTIONS: { value: BourekOption; label: string }[] = [
  { value: 0, label: "None" },
  { value: 1, label: "1 piece" },
  { value: 6, label: "6 pieces" },
  { value: 12, label: "12 pieces" },
];

const HMISS_OPTIONS: { value: HmissOption; label: string }[] = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "large", label: "Large" },
];

/* ─── Component ─── */

interface AddOnsProps {
  order: OrderConfig;
  onOrderChange: (updated: OrderConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AddOns({ order, onOrderChange, onNext, onBack }: AddOnsProps) {
  const tier = tierFromOrder(order);
  const prices = computePrices(order);

  function set<K extends keyof OrderConfig>(key: K, value: OrderConfig[K]) {
    onOrderChange({ ...order, [key]: value });
  }

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
        Customize Your Box
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        Add extras to make your iftar special
        {order.orderType === "subscription" && (
          <span className="ml-1 font-semibold text-accent">&mdash; subscriber prices applied</span>
        )}
      </p>

      {/* Add-on grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ── Boureks ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden col-span-2 sm:col-span-1">
          {/* Image placeholder */}
          <div className="aspect-[3/2] bg-gradient-to-br from-amber-100 to-orange-50 flex flex-col items-center justify-center">
            <Flame className="w-10 h-10 text-primary/25 mb-1" />
            <p className="text-xs text-muted-foreground">Crispy meat bricks</p>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Boureks</h3>

            <div className="space-y-2">
              {BOUREK_OPTIONS.map((opt) => {
                const selected = order.bourekOption === opt.value;
                const price =
                  opt.value === 0
                    ? null
                    : BOUREK_PRICING[opt.value as 1 | 6 | 12][tier];

                return (
                  <button
                    key={opt.value}
                    onClick={() => set("bourekOption", opt.value)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    {/* Radio dot */}
                    <span
                      className={cn(
                        "shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        selected ? "border-primary" : "border-border"
                      )}
                    >
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </span>

                    <span
                      className={cn(
                        "flex-1",
                        selected ? "font-bold text-foreground" : "text-foreground"
                      )}
                    >
                      {opt.label}
                    </span>

                    {price !== null && (
                      <span className="text-xs font-semibold text-primary shrink-0">
                        +${fmt(price)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Hmiss ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden col-span-2 sm:col-span-1">
          {/* Image placeholder */}
          <div className="aspect-[3/2] bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center">
            <CookingPot className="w-10 h-10 text-red-400/40 mb-1" />
            <p className="text-xs text-muted-foreground">Roasted pepper &amp; tomato dip</p>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Hmiss</h3>

            <div className="space-y-2">
              {HMISS_OPTIONS.map((opt) => {
                const selected = order.hmissOption === opt.value;
                const price =
                  opt.value === "none"
                    ? null
                    : HMISS_PRICING[opt.value][tier];

                return (
                  <button
                    key={opt.value}
                    onClick={() => set("hmissOption", opt.value)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        selected ? "border-primary" : "border-border"
                      )}
                    >
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </span>

                    <span
                      className={cn(
                        "flex-1",
                        selected ? "font-bold text-foreground" : "text-foreground"
                      )}
                    >
                      {opt.label}
                    </span>

                    {price !== null && (
                      <span className="text-xs font-semibold text-primary shrink-0">
                        +${fmt(price)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Extra Salad ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden col-span-2 sm:col-span-1">
          {/* Image placeholder */}
          <div className="aspect-[3/2] bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center">
            <Salad className="w-10 h-10 text-accent/30 mb-1" />
            <p className="text-xs text-muted-foreground">Fresh garden salad</p>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-1">Extra Salad</h3>
            <p className="text-[11px] text-muted-foreground mb-4">
              An additional fresh salad portion
            </p>

            {/* Toggle */}
            <button
              onClick={() => set("saladExtra", order.saladExtra > 0 ? 0 : 1)}
              className={cn(
                "w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-all",
                order.saladExtra > 0
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Toggle track */}
                <span
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                    order.saladExtra > 0 ? "bg-primary" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                      order.saladExtra > 0 ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </span>
                <span className={order.saladExtra > 0 ? "font-bold text-foreground" : "text-foreground"}>
                  {order.saladExtra > 0 ? "Added" : "Add salad"}
                </span>
              </div>

              <span className="text-xs font-semibold text-primary">
                +${fmt(SALAD_PRICING[tier])}/day
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Daily add-on total ── */}
      {prices.addonsDaily > 0 && (
        <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 px-5 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Add-ons total
          </span>
          <span className="text-base font-extrabold text-primary">
            +${fmt(prices.addonsDaily)}
            <span className="text-xs font-normal text-muted-foreground ml-1">/ day</span>
          </span>
        </div>
      )}

      {/* ── Bottom nav (desktop) ── */}
      <div className="mt-10 hidden md:flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-border px-6 py-3 text-sm font-bold text-foreground hover:border-primary/40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Daily total</p>
            <p key={prices.dailyTotal} className="text-lg font-extrabold text-primary animate-price-pop">
              ${fmt(prices.dailyTotal)}
            </p>
          </div>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            Continue to Your Info
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
