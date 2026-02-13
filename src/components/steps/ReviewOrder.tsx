"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import type {
  OrderConfig,
  CustomerInfo,
  DeliveryMethod,
  BoxTheme,
} from "@/lib/order";
import {
  BOUREK_PRICING,
  HMISS_PRICING,
  SALAD_PRICING,
  tierFromOrder,
  computePrices,
  fmt,
} from "@/lib/order";
import { cn } from "@/lib/utils";

/* ─── Theme display map ─── */

const THEME_META: Record<BoxTheme, { icon: string; label: string }> = {
  traditional: { icon: "\u{1F3FA}", label: "Traditional Tlemcen" },
  mixed: { icon: "\u{1F37D}\uFE0F", label: "Mixed Algerian" },
  light: { icon: "\u{1F957}", label: "Light Ramadan" },
};

/* ─── Helpers ─── */

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>
        {label}
      </span>
      <span
        className={cn(
          "font-semibold",
          accent ? "text-accent" : muted ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-foreground sm:text-right">{value}</span>
    </div>
  );
}

/* ─── Component ─── */

interface ReviewOrderProps {
  order: OrderConfig;
  customerInfo: CustomerInfo;
  deliveryMethod: DeliveryMethod;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ReviewOrder({
  order,
  customerInfo,
  deliveryMethod,
  onBack,
  onConfirm,
}: ReviewOrderProps) {
  const tier = tierFromOrder(order);
  const prices = computePrices(order, deliveryMethod);
  const theme = THEME_META[order.boxTheme];
  const isSubscription = order.orderType === "subscription";

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
        Review Your Order
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        Double-check everything before confirming
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Section A: Order Summary ─── */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-bold text-foreground mb-5">
              Order Summary
            </h3>

            <div className="space-y-3">
              {/* Theme */}
              <Row
                label={`${theme.icon} ${theme.label}`}
                value=""
                muted
              />

              {/* Box */}
              <Row
                label={`${order.boxSize === "single" ? "Single" : "Family"} Iftar Box`}
                value={`$${fmt(prices.boxPrice)} / day`}
              />

              {/* Plan */}
              <Row
                label={isSubscription ? `${order.subDuration}-day subscription` : "One-day order"}
                value={`${prices.days} day${prices.days > 1 ? "s" : ""}`}
                muted
              />

              {/* Add-ons */}
              {order.bourekOption > 0 && (
                <Row
                  label={`Boureks (${order.bourekOption === 1 ? "1 pc" : `${order.bourekOption} pcs`})`}
                  value={`+$${fmt(BOUREK_PRICING[order.bourekOption as 1 | 6 | 12][tier])} / day`}
                  muted
                />
              )}

              {order.hmissOption !== "none" && (
                <Row
                  label={`Hmiss (${order.hmissOption})`}
                  value={`+$${fmt(HMISS_PRICING[order.hmissOption][tier])} / day`}
                  muted
                />
              )}

              {order.saladExtra > 0 && (
                <Row
                  label={`Extra salad \u00d7${order.saladExtra}`}
                  value={`+$${fmt(SALAD_PRICING[tier] * order.saladExtra)} / day`}
                  muted
                />
              )}

              {/* Separator */}
              <div className="border-t border-border my-1" />

              {/* Daily total */}
              <div className="flex justify-between text-sm">
                <span className="font-bold text-foreground">Daily total</span>
                <span className="font-bold text-foreground">${fmt(prices.dailyTotal)}</span>
              </div>

              {/* Days × daily */}
              {prices.days > 1 && (
                <Row
                  label={`${prices.days} days \u00d7 $${fmt(prices.dailyTotal)}`}
                  value={`$${fmt(prices.mealTotal)}`}
                  muted
                />
              )}

              {/* Delivery fee */}
              <Row
                label="Delivery"
                value={prices.deliveryFee > 0 ? `$${fmt(prices.deliveryFee)}` : "Free"}
                muted
              />

              {/* Grand total */}
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-foreground">Grand Total</span>
                <span className="text-2xl font-extrabold text-primary">
                  ${fmt(prices.grandTotal)}
                  <span className="text-xs font-normal text-muted-foreground ml-1">CAD</span>
                </span>
              </div>

              {/* Savings */}
              {isSubscription && prices.savings > 0 && (
                <div className="rounded-lg bg-accent/10 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent">
                    You save vs one-day ordering
                  </span>
                  <span className="text-sm font-bold text-accent">
                    ${fmt(prices.savings)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Section B: Your Information ─── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Contact</h3>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="space-y-2">
              <InfoRow label="Name" value={`${customerInfo.firstName} ${customerInfo.lastName}`} />
              <InfoRow label="Phone" value={customerInfo.phone} />
              <InfoRow label="Email" value={customerInfo.email} />
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Delivery</h3>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="space-y-2">
              <InfoRow
                label="Method"
                value={deliveryMethod === "pickup" ? "Pickup (Free)" : "Home delivery"}
              />
              {deliveryMethod === "delivery" && (
                <>
                  {customerInfo.address && (
                    <InfoRow label="Address" value={customerInfo.address} />
                  )}
                  {(customerInfo.city || customerInfo.postalCode) && (
                    <InfoRow
                      label="City"
                      value={[customerInfo.city, customerInfo.postalCode].filter(Boolean).join(", ")}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {customerInfo.notes && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground">Notes</h3>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{customerInfo.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Section C: Confirm ─── */}
      <div className="mt-10">
        {/* Desktop */}
        <div className="hidden md:flex flex-col items-center">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-12 py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            Proceed to Payment
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground mt-3 text-center max-w-sm">
            By confirming, you agree to our terms of service.
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 text-center max-w-sm">
            {isSubscription
              ? `Your subscription renews daily for ${order.subDuration} days. You can cancel anytime.`
              : "You will be charged once for this single-day order."}
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Go back and edit
          </button>
        </div>

      </div>
    </div>
  );
}
