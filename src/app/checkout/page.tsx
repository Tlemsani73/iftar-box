"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Check,
  CreditCard,
  MessageCircle,
  Moon,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import {
  type OrderConfig,
  type CustomerInfo,
  type DeliveryMethod,
  type BoxTheme,
  BOUREK_PRICING,
  HMISS_PRICING,
  SALAD_PRICING,
  INCLUDED,
  computePrices,
  searchParamsToOrder,
  tierFromOrder,
  fmt,
} from "@/lib/order";

/* ─── Theme display map ─── */

const THEME_LABEL: Record<BoxTheme, string> = {
  traditional: "Traditional Tlemcen",
  mixed: "Mixed Algerian",
  light: "Light Ramadan",
};

/* ─── Secure Header ─── */

function SecureHeader({ editUrl }: { editUrl: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <Link
          href={editUrl}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <Moon className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground tracking-tight">
            IftarBox
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Secure Checkout</span>
        </div>
      </div>
    </header>
  );
}

/* ─── Section wrapper ─── */

function Section({
  children,
  step,
  title,
  action,
}: {
  children: React.ReactNode;
  step: number;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {step}
          </span>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ─── Input field ─── */

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          error ? "border-red-400 ring-2 ring-red-100" : "border-border"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Read-only Order Summary ─── */

function OrderSummary({
  order,
  deliveryMethod,
}: {
  order: OrderConfig;
  deliveryMethod: DeliveryMethod;
}) {
  const tier = tierFromOrder(order);
  const prices = computePrices(order, deliveryMethod);
  const isSub = order.orderType === "subscription";

  return (
    <div>
      {/* Plan header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-foreground">
            {isSub
              ? `Ramadan Subscription \u2013 ${order.subDuration} Days`
              : "Iftar Box \u2013 One Day"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {order.boxSize === "single" ? "Single (1\u20132 persons)" : "Family (4\u20136 persons)"}
            {" \u00b7 "}
            {THEME_LABEL[order.boxTheme]}
          </p>
        </div>
        <p className="text-sm font-extrabold text-primary whitespace-nowrap">
          ${fmt(prices.boxPrice)}
          {isSub && (
            <span className="text-xs font-normal text-muted-foreground"> / day</span>
          )}
        </p>
      </div>

      {/* Included items */}
      <div className="border-t border-border pt-3 mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Included
        </p>
        <ul className="space-y-1.5">
          {INCLUDED[order.boxSize].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="w-3.5 h-3.5 text-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Add-ons */}
      {(order.bourekOption > 0 || order.hmissOption !== "none" || order.saladExtra > 0) && (
        <div className="border-t border-border pt-3 mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Add-ons
          </p>
          <div className="space-y-1.5">
            {order.bourekOption > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Boureks ({order.bourekOption === 1 ? "1 pc" : `${order.bourekOption} pcs`})
                </span>
                <span className="font-semibold">
                  +${fmt(BOUREK_PRICING[order.bourekOption as 1 | 6 | 12][tier])}
                </span>
              </div>
            )}
            {order.hmissOption !== "none" && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Hmiss ({order.hmissOption})</span>
                <span className="font-semibold">
                  +${fmt(HMISS_PRICING[order.hmissOption][tier])}
                </span>
              </div>
            )}
            {order.saladExtra > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Extra salad &times;{order.saladExtra}</span>
                <span className="font-semibold">
                  +${fmt(SALAD_PRICING[tier] * order.saladExtra)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Savings badge */}
      {prices.savings > 0 && (
        <div className="rounded-lg bg-accent/10 px-3 py-2 mt-1">
          <p className="text-xs font-semibold text-accent flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            You save ${fmt(prices.savings)} CAD with this subscription
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Price Breakdown ─── */

function PriceBreakdown({
  order,
  deliveryMethod,
}: {
  order: OrderConfig;
  deliveryMethod: DeliveryMethod;
}) {
  const tier = tierFromOrder(order);
  const prices = computePrices(order, deliveryMethod);
  const isSub = order.orderType === "subscription";

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-bold text-foreground mb-3">Price Breakdown</h3>
      <div className="space-y-2.5 text-sm">
        {/* Daily box */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {order.boxSize === "single" ? "Single" : "Family"} Iftar Box
          </span>
          <span className="font-semibold text-foreground">${fmt(prices.boxPrice)} / day</span>
        </div>

        {/* Daily add-ons */}
        {prices.addonsDaily > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Add-ons</span>
            <span className="font-semibold text-foreground">+${fmt(prices.addonsDaily)} / day</span>
          </div>
        )}

        {/* Daily total */}
        <div className="border-t border-border pt-2.5 flex justify-between">
          <span className="font-bold text-foreground">Daily total</span>
          <span className="font-bold text-foreground">${fmt(prices.dailyTotal)} / day</span>
        </div>

        {/* Days multiplier */}
        {prices.days > 1 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              &times; {prices.days} days
            </span>
            <span className="font-semibold text-foreground">${fmt(prices.mealTotal)}</span>
          </div>
        )}

        {/* Subtotal (only show label when there's a delivery fee) */}
        {prices.deliveryFee > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">${fmt(prices.mealTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery fee</span>
              <span className="font-semibold text-foreground">+${fmt(prices.deliveryFee)}</span>
            </div>
          </>
        )}

        {/* Delivery free badge */}
        {deliveryMethod === "delivery" && prices.deliveryFee === 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="font-semibold text-accent">Free with subscription</span>
          </div>
        )}

        {deliveryMethod === "pickup" && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pickup</span>
            <span className="font-semibold text-accent">Free</span>
          </div>
        )}

        {/* Grand total */}
        <div className="border-t border-border pt-2.5 flex justify-between items-baseline">
          <span className="font-bold text-foreground">Total to pay</span>
          <span className="text-lg font-extrabold text-primary">
            ${fmt(prices.grandTotal)} CAD
          </span>
        </div>

        {isSub && (
          <p className="text-xs text-muted-foreground text-right">
            ${fmt(prices.dailyTotal)} / day &times; {prices.days} days
            {prices.deliveryFee > 0 && ` + $${fmt(prices.deliveryFee)} delivery`}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Customer Info Summary (read-only) ─── */

function CustomerSummary({
  info,
  deliveryMethod,
  editUrl,
}: {
  info: CustomerInfo;
  deliveryMethod: DeliveryMethod;
  editUrl: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Your Information
        </p>
        <Link
          href={editUrl}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Edit
        </Link>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium text-foreground">
            {info.firstName} {info.lastName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phone</span>
          <span className="font-medium text-foreground">{info.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium text-foreground">{info.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium text-foreground">
            {deliveryMethod === "pickup" ? "Pickup (Free)" : "Home delivery"}
          </span>
        </div>
        {deliveryMethod === "delivery" && info.address && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address</span>
            <span className="font-medium text-foreground text-right max-w-[200px]">
              {info.address}
              {info.city && `, ${info.city}`}
              {info.postalCode && ` ${info.postalCode}`}
            </span>
          </div>
        )}
        {info.notes && (
          <div className="border-t border-border pt-2">
            <span className="text-muted-foreground text-xs">Notes:</span>
            <p className="text-sm text-foreground mt-0.5">{info.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Checkout Content ─── */

function CheckoutContent() {
  const searchParams = useSearchParams();

  /* Parse order from URL */
  const order = useMemo(() => searchParamsToOrder(searchParams), [searchParams]);

  /* Parse customer info from URL */
  const initialCustomerInfo = useMemo<CustomerInfo>(
    () => ({
      firstName: searchParams.get("firstName") ?? "",
      lastName: searchParams.get("lastName") ?? "",
      phone: searchParams.get("phone") ?? "",
      email: searchParams.get("email") ?? "",
      address: searchParams.get("address") ?? "",
      city: searchParams.get("city") ?? "",
      postalCode: searchParams.get("postalCode") ?? "",
      notes: searchParams.get("notes") ?? "",
    }),
    [searchParams]
  );

  const deliveryMethod: DeliveryMethod =
    searchParams.get("delivery") === "delivery" ? "delivery" : "pickup";

  /* Editable form state (pre-filled from URL) */
  const [name, setName] = useState(
    `${initialCustomerInfo.firstName} ${initialCustomerInfo.lastName}`.trim()
  );
  const [phone, setPhone] = useState(initialCustomerInfo.phone);
  const [email, setEmail] = useState(initialCustomerInfo.email);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const prices = useMemo(
    () => computePrices(order, deliveryMethod),
    [order, deliveryMethod]
  );

  const isSub = order.orderType === "subscription";

  /* URL to go back to product wizard */
  const editUrl = `/product`;

  /* Validation */
  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Enter a valid email address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    /* In production: call Stripe checkout / API */
    setTimeout(() => setSubmitting(false), 2000);
  }

  const ctaText = isSub
    ? "Pay & Confirm My Subscription"
    : "Pay & Confirm My Order";

  return (
    <div className="min-h-screen bg-background">
      <SecureHeader editUrl={editUrl} />

      <main className="max-w-lg mx-auto px-4 pt-6 pb-32 md:pb-12">
        {/* Trust line */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
          <Lock className="w-3.5 h-3.5" />
          Secure payment &ndash; Powered by Stripe
        </div>

        {/* Edit order link */}
        <Link
          href={editUrl}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Edit Order
        </Link>

        {/* 1. Order Summary (read-only) */}
        <Section step={1} title="Order Summary">
          <div className="rounded-2xl border border-border bg-card p-5">
            <OrderSummary order={order} deliveryMethod={deliveryMethod} />
          </div>
        </Section>

        {/* 2. Customer & delivery info (read-only from wizard, editable name/phone/email) */}
        <Section step={2} title="Confirm Your Details">
          {/* Read-only info from wizard */}
          <CustomerSummary
            info={initialCustomerInfo}
            deliveryMethod={deliveryMethod}
            editUrl={editUrl}
          />

          {/* Editable contact override */}
          <div className="rounded-2xl border border-border bg-card p-5 mt-4 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Confirm contact for this order
            </p>
            <Field
              label="Full name"
              placeholder="Mohamed Ben Ali"
              value={name}
              onChange={(v) => {
                setName(v);
                if (errors.name) setErrors((e) => ({ ...e, name: "" }));
              }}
              error={errors.name}
              required
            />
            <Field
              label="Phone number (WhatsApp)"
              type="tel"
              placeholder="+1 514 000 0000"
              value={phone}
              onChange={(v) => {
                setPhone(v);
                if (errors.phone) setErrors((e) => ({ ...e, phone: "" }));
              }}
              error={errors.phone}
              required
            />
            <Field
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(v) => {
                setEmail(v);
                if (errors.email) setErrors((e) => ({ ...e, email: "" }));
              }}
              error={errors.email}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              No account needed. We&apos;ll send confirmation via WhatsApp &amp; email.
            </p>
          </div>
        </Section>

        {/* 3. Payment (Stripe placeholder) */}
        <Section step={3} title="Payment">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 flex flex-col items-center justify-center text-center">
              <CreditCard className="w-8 h-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">
                Stripe Checkout
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Credit / Debit Card &middot; Apple Pay &middot; Google Pay
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Secure payment &ndash; no data stored on our servers
            </p>
          </div>
        </Section>

        {/* 4. Price Breakdown */}
        <PriceBreakdown order={order} deliveryMethod={deliveryMethod} />

        {/* CTA (desktop) */}
        <div className="hidden md:block mt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? "Processing..." : ctaText}
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            You&apos;ll receive confirmation on WhatsApp
          </p>
        </div>
      </main>

      {/* Sticky Bottom CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-border">
        <div className="max-w-lg mx-auto px-4 pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Total
              </p>
              <p className="text-base font-extrabold text-primary">
                ${fmt(prices.grandTotal)} CAD
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? "Processing..." : "Pay Now"}
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Secure checkout &middot; Confirmation via WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page (with Suspense boundary for useSearchParams) ─── */

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Moon className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
