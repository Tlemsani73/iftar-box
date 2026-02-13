"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  UtensilsCrossed,
  AlertTriangle,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import ConfigureBox from "@/components/steps/ConfigureBox";
import AddOns from "@/components/steps/AddOns";
import CustomerInfoStep, { type CustomerInfoHandle } from "@/components/steps/CustomerInfo";
import ReviewOrder from "@/components/steps/ReviewOrder";
import {
  type OrderConfig,
  type CustomerInfo,
  type DeliveryMethod,
  RAMADAN_START,
  orderToSearchParams,
  computePrices,
  fmt,
} from "@/lib/order";

/* ─── Steps ─── */

const STEPS = ["Configure", "Add-ons", "Your Info", "Review"];

const MOBILE_CTA_LABELS = [
  "Add-ons",
  "Your Info",
  "Review",
  "Proceed to Payment",
];

/* ─── Image Carousel (preserved from original) ─── */

const slides = [
  {
    label: "Single Iftar Box",
    description: "Complete meal for one",
    gradient: "from-amber-100 to-orange-50",
  },
  {
    label: "Family Iftar Box",
    description: "4 generous portions",
    gradient: "from-orange-100 to-amber-50",
  },
  {
    label: "Boureks",
    description: "Crispy meat bricks",
    gradient: "from-amber-50 to-orange-100",
  },
  {
    label: "Hmiss & Extras",
    description: "Flavorful add-ons",
    gradient: "from-green-50 to-emerald-50",
  },
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative w-full">
      <div
        className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${slides[current].gradient} flex flex-col items-center justify-center overflow-hidden`}
      >
        <UtensilsCrossed className="w-16 h-16 text-primary/25 mb-3" />
        <p className="text-lg font-bold text-foreground/70">
          {slides[current].label}
        </p>
        <p className="text-sm text-muted-foreground">
          {slides[current].description}
        </p>
      </div>

      <button
        onClick={() =>
          setCurrent((c) => (c - 1 + slides.length) % slides.length)
        }
        aria-label="Previous image"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        aria-label="Next image"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Default state ─── */

const DEFAULT_ORDER: OrderConfig = {
  boxSize: "single",
  boxTheme: "traditional",
  orderType: "subscription",
  subDuration: 30,
  bourekOption: 0,
  hmissOption: "none",
  saladExtra: 0,
  startDate: RAMADAN_START,
};

const DEFAULT_CUSTOMER: CustomerInfo = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

/* ─── Page ─── */

export default function ProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState<OrderConfig>(DEFAULT_ORDER);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(DEFAULT_CUSTOMER);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");

  // Track direction for slide animation
  const directionRef = useRef<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);

  // Ref to trigger CustomerInfo validation from the mobile bar
  const customerInfoRef = useRef<CustomerInfoHandle | null>(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const goNext = useCallback(() => {
    directionRef.current = "forward";
    setCurrentStep((s) => Math.min(s + 1, 3));
    setAnimKey((k) => k + 1);
  }, []);

  const goBack = useCallback(() => {
    directionRef.current = "back";
    setCurrentStep((s) => Math.max(s - 1, 0));
    setAnimKey((k) => k + 1);
  }, []);

  function handleConfirm() {
    const params = new URLSearchParams(orderToSearchParams(order));
    params.set("firstName", customerInfo.firstName);
    params.set("lastName", customerInfo.lastName);
    params.set("phone", customerInfo.phone);
    params.set("email", customerInfo.email);
    params.set("delivery", deliveryMethod);
    if (customerInfo.address) params.set("address", customerInfo.address);
    if (customerInfo.city) params.set("city", customerInfo.city);
    if (customerInfo.postalCode) params.set("postalCode", customerInfo.postalCode);
    if (customerInfo.notes) params.set("notes", customerInfo.notes);
    router.push(`/checkout?${params.toString()}`);
  }

  // Mobile CTA handler — routes through each step's own logic
  function handleMobileCTA() {
    if (currentStep === 2) {
      // Trigger CustomerInfo validation before advancing
      customerInfoRef.current?.tryAdvance();
    } else if (currentStep === 3) {
      handleConfirm();
    } else {
      goNext();
    }
  }

  const prices = computePrices(order, deliveryMethod);
  const slideClass =
    directionRef.current === "forward"
      ? "animate-slide-in-right"
      : "animate-slide-in-left";

  return (
    <>
      <TopBar />

      <main className="min-h-screen bg-background">
        {/* ── Hero header ── */}
        <section className="bg-gradient-to-b from-orange-50 to-background">
          <div className="max-w-5xl mx-auto px-4 pt-6 pb-4 md:pt-10 md:pb-6">
            <div className="flex flex-col md:flex-row md:items-start md:gap-10">
              {/* Carousel — sidebar on desktop, above wizard on mobile */}
              <div className="hidden md:block md:w-72 lg:w-80 shrink-0">
                <ImageCarousel />
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-primary mb-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Limited daily capacity
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-foreground">
                  Build Your Iftar Box
                </h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                  Configure your perfect Ramadan meal in 4 easy steps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Step indicator ── */}
        <div className="sticky top-14 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-5xl mx-auto">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>
        </div>

        {/* ── Mobile carousel (shown only on small screens, only on step 0) ── */}
        {currentStep === 0 && (
          <div className="md:hidden px-4 pt-6 pb-2 max-w-sm mx-auto">
            <ImageCarousel />
          </div>
        )}

        {/* ── Step content with slide animation ── */}
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32 md:pb-16 overflow-hidden">
          <div key={animKey} className={slideClass}>
            {currentStep === 0 && (
              <ConfigureBox
                order={order}
                onOrderChange={setOrder}
                onNext={goNext}
              />
            )}

            {currentStep === 1 && (
              <AddOns
                order={order}
                onOrderChange={setOrder}
                onNext={goNext}
                onBack={goBack}
              />
            )}

            {currentStep === 2 && (
              <CustomerInfoStep
                customerInfo={customerInfo}
                onInfoChange={setCustomerInfo}
                deliveryMethod={deliveryMethod}
                onDeliveryChange={setDeliveryMethod}
                onNext={goNext}
                onBack={goBack}
                handleRef={customerInfoRef}
              />
            )}

            {currentStep === 3 && (
              <ReviewOrder
                order={order}
                customerInfo={customerInfo}
                deliveryMethod={deliveryMethod}
                onBack={goBack}
                onConfirm={handleConfirm}
              />
            )}
          </div>
        </div>
      </main>

      {/* ── Unified mobile bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-border">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <p className="text-sm font-extrabold text-primary">
                ${fmt(prices.dailyTotal)}
                <span className="text-[10px] font-normal text-muted-foreground ml-1">
                  / day
                </span>
                {prices.days > 1 && (
                  <span className="text-[10px] font-normal text-muted-foreground ml-1">
                    &middot; ${fmt(prices.grandTotal)} total
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {currentStep > 0 && (
                <button
                  onClick={goBack}
                  className="rounded-xl border-2 border-border px-3 py-2.5 text-sm font-bold text-foreground hover:border-primary/40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleMobileCTA}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity"
              >
                {MOBILE_CTA_LABELS[currentStep]}
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
