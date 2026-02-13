"use client";

import { useState, useEffect, type MutableRefObject } from "react";
import { ChevronRight, ChevronLeft, Check, Lock, Phone } from "lucide-react";
import type { CustomerInfo as CustomerInfoType, DeliveryMethod } from "@/lib/order";
import { cn } from "@/lib/utils";

/* ─── Validation ─── */

type Errors = Partial<Record<"firstName" | "lastName" | "phone" | "email" | "address" | "city" | "postalCode", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(info: CustomerInfoType, delivery: DeliveryMethod): Errors {
  const e: Errors = {};
  if (!info.firstName.trim()) e.firstName = "First name is required";
  if (!info.lastName.trim()) e.lastName = "Last name is required";
  if (!info.phone.trim()) e.phone = "Phone number is required";
  if (!info.email.trim()) {
    e.email = "Email is required";
  } else if (!EMAIL_RE.test(info.email)) {
    e.email = "Enter a valid email address";
  }
  if (delivery === "delivery") {
    if (!info.address?.trim()) e.address = "Street address is required";
    if (!info.city?.trim()) e.city = "City is required";
    if (!info.postalCode?.trim()) e.postalCode = "Postal code is required";
  }
  return e;
}

/* ─── Field component ─── */

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

/* ─── Component ─── */

export interface CustomerInfoHandle {
  tryAdvance: () => void;
}

interface CustomerInfoProps {
  customerInfo: CustomerInfoType;
  onInfoChange: (info: CustomerInfoType) => void;
  deliveryMethod: DeliveryMethod;
  onDeliveryChange: (method: DeliveryMethod) => void;
  onNext: () => void;
  onBack: () => void;
  handleRef?: MutableRefObject<CustomerInfoHandle | null>;
}

export default function CustomerInfo({
  customerInfo,
  onInfoChange,
  deliveryMethod,
  onDeliveryChange,
  onNext,
  onBack,
  handleRef,
}: CustomerInfoProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  function update<K extends keyof CustomerInfoType>(key: K, value: CustomerInfoType[K]) {
    const next = { ...customerInfo, [key]: value };
    onInfoChange(next);
    // Clear field error on edit after first submit attempt
    if (touched) {
      const fresh = validate(next, deliveryMethod);
      setErrors((prev) => ({ ...prev, [key]: fresh[key as keyof Errors] }));
    }
  }

  function handleNext() {
    setTouched(true);
    const e = validate(customerInfo, deliveryMethod);
    setErrors(e);
    if (Object.keys(e).length === 0) onNext();
  }

  // Expose handleNext so the parent's mobile bar can trigger validation
  useEffect(() => {
    if (handleRef) handleRef.current = { tryAdvance: handleNext };
  });

  const inputCls =
    "w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      {/* Section A — Your Information */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
          Your Information
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          We&apos;ll use this to confirm your order
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" error={errors.firstName}>
            <input
              type="text"
              value={customerInfo.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Ahmed"
              className={cn(inputCls, errors.firstName && "border-red-400 ring-red-100")}
            />
          </Field>

          <Field label="Last name" error={errors.lastName}>
            <input
              type="text"
              value={customerInfo.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Benali"
              className={cn(inputCls, errors.lastName && "border-red-400 ring-red-100")}
            />
          </Field>

          <Field label="Phone number" error={errors.phone}>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(514) 555-1234"
              className={cn(inputCls, errors.phone && "border-red-400 ring-red-100")}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              For order updates via WhatsApp / SMS
            </p>
          </Field>

          <Field label="Email address" error={errors.email}>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="ahmed@example.com"
              className={cn(inputCls, errors.email && "border-red-400 ring-red-100")}
            />
          </Field>
        </div>
      </section>

      {/* Section B — Delivery Method */}
      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
          Delivery Method
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Choose how you&apos;d like to receive your Iftar
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pickup */}
          <button
            type="button"
            onClick={() => onDeliveryChange("pickup")}
            className={cn(
              "relative rounded-2xl border-2 p-5 text-left transition-all",
              deliveryMethod === "pickup"
                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            {deliveryMethod === "pickup" && (
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </span>
            )}
            <span className="text-2xl leading-none block mb-2">{"\u{1F4CD}"}</span>
            <h3 className="text-sm font-bold text-foreground">
              Pickup &mdash; Free
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Pick up in Montreal
            </p>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Address shared after order confirmation
            </p>
          </button>

          {/* Delivery */}
          <button
            type="button"
            onClick={() => onDeliveryChange("delivery")}
            className={cn(
              "relative rounded-2xl border-2 p-5 text-left transition-all",
              deliveryMethod === "delivery"
                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            {deliveryMethod === "delivery" && (
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </span>
            )}
            <span className="text-2xl leading-none block mb-2">{"\u{1F69A}"}</span>
            <h3 className="text-sm font-bold text-foreground">
              Home Delivery
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              $5 one-time &middot; Free with subscription
            </p>
          </button>
        </div>

        {/* Address fields (shown when delivery selected) */}
        {deliveryMethod === "delivery" && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-5 space-y-4">
            <Field label="Street address" error={errors.address}>
              <input
                type="text"
                value={customerInfo.address ?? ""}
                onChange={(e) => update("address", e.target.value)}
                placeholder="1234 Rue Saint-Denis"
                className={cn(inputCls, errors.address && "border-red-400 ring-red-100")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="City" error={errors.city}>
                <input
                  type="text"
                  value={customerInfo.city ?? ""}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Montr\u00e9al"
                  className={cn(inputCls, errors.city && "border-red-400 ring-red-100")}
                />
              </Field>

              <Field label="Postal code" error={errors.postalCode}>
                <input
                  type="text"
                  value={customerInfo.postalCode ?? ""}
                  onChange={(e) => update("postalCode", e.target.value)}
                  placeholder="H2X 1K4"
                  className={cn(inputCls, errors.postalCode && "border-red-400 ring-red-100")}
                />
              </Field>
            </div>
          </div>
        )}
      </section>

      {/* Section C — Special Notes */}
      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
          Special Notes
          <span className="text-sm font-normal text-muted-foreground ml-2">Optional</span>
        </h2>
        <textarea
          value={customerInfo.notes ?? ""}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Allergies, buzzer code, delivery instructions..."
          rows={3}
          className={cn(inputCls, "mt-3 resize-none")}
        />
      </section>

      {/* Trust badges */}
      <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Secure checkout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          WhatsApp support available
        </span>
      </div>

      {/* ── Bottom nav (desktop) ── */}
      <div className="mt-10 hidden md:flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-border px-6 py-3 text-sm font-bold text-foreground hover:border-primary/40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          Review Order
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
