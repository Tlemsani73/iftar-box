import {
  MessageCircle,
  Clock,
  ChefHat,
  Moon,
  ShieldCheck,
  Users,
  CalendarCheck,
  UtensilsCrossed,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/15141234567?text=I%20want%20to%20order%20an%20Iftar%20Box";
const PRODUCT_URL = "/product";
const CHECKOUT_URL = "/checkout";

/* ─── Sticky Top Bar ─── */
function TopBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Moon className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-foreground tracking-tight">
            IftarBox
          </span>
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Order via WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-background">
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-12 md:pt-16 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-primary mb-5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Limited daily capacity
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
              Daily Ramadan Iftar Box
              <br />
              <span className="text-primary">Ready at Maghrib</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              Fresh, homemade Iftar prepared daily. Subscription-based. Limited
              spots in Montreal.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 md:justify-start justify-center">
              <Link
                href={CHECKOUT_URL}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
              >
                Reserve My Ramadan Iftar
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </a>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="flex-1 mt-10 md:mt-0 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center shadow-xl overflow-hidden">
              <div className="text-center p-6">
                <UtensilsCrossed className="w-20 h-20 text-primary/40 mx-auto mb-4" />
                <p className="text-sm text-primary/60 font-medium">
                  Replace with your Iftar Box photo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Product Preview ─── */
function ProductPreview() {
  const contents = [
    "Harira (traditional soup)",
    "2 Boureks",
    "Fresh salad",
    "Bread + dates + sharbat",
  ];

  return (
    <section id="product" className="py-14 md:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
          What&apos;s Inside Your Iftar Box
        </h2>
        <Link
          href={PRODUCT_URL}
          className="block max-w-md mx-auto rounded-2xl border border-border bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
        >
          {/* Image placeholder */}
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
            <UtensilsCrossed className="w-16 h-16 text-primary/30" />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Ramadan Iftar Box
            </h3>
            <ul className="space-y-2 mb-4">
              {contents.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground italic mb-4">
              Same menu every day for consistency &amp; quality
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              View box details
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ─── Subscription Plans ─── */
function SubscriptionTeaser() {
  const plans = [
    {
      name: "Single Day",
      price: 25,
      unit: "/ day",
      description: "Try it once",
      highlight: false,
    },
    {
      name: "10-Day Pack",
      price: 22,
      unit: "/ day",
      description: "Save $30 total",
      highlight: false,
    },
    {
      name: "Full Ramadan",
      price: 19,
      unit: "/ day",
      description: "30 days – Best value",
      highlight: true,
      badge: "Most chosen",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-3">
          Choose Your Plan
        </h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">
          Subscribe and never miss an Iftar
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col items-center text-center transition-shadow ${
                plan.highlight
                  ? "border-primary bg-white shadow-xl ring-2 ring-primary/20 scale-[1.02]"
                  : "border-border bg-card shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-bold text-foreground mt-2">
                {plan.name}
              </h3>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-extrabold text-foreground">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {plan.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                {plan.description}
              </p>
              <Link
                href={CHECKOUT_URL}
                className={`w-full rounded-xl py-3 text-sm font-bold transition-opacity hover:opacity-90 text-center ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-foreground text-background"
                }`}
              >
                Choose my plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const steps = [
    {
      icon: CalendarCheck,
      title: "Subscribe online",
      description: "Pick your plan in 60 seconds",
    },
    {
      icon: ChefHat,
      title: "We cook daily",
      description: "Fresh preparation every day",
    },
    {
      icon: Moon,
      title: "Enjoy at Maghrib",
      description: "Your Iftar is ready on time",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary mb-1">
                Step {i + 1}
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Trust & Reassurance ─── */
function TrustSection() {
  const points = [
    { icon: UtensilsCrossed, text: "Fixed daily menu – no surprises" },
    { icon: Clock, text: "On-time every day at Maghrib" },
    { icon: ShieldCheck, text: "Clean & safe preparation" },
    { icon: Users, text: "Ideal for families & professionals" },
  ];

  return (
    <section className="py-14 md:py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
          Why Families Trust Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {points.map((point) => (
            <div
              key={point.text}
              className="flex items-center gap-4 rounded-xl bg-card border border-border p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <point.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {point.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCTA() {
  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-background to-orange-50">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Don&apos;t Miss a Single Iftar
        </h2>
        <p className="text-muted-foreground mb-8 text-sm max-w-md mx-auto">
          Spots fill up fast. Secure your daily Iftar now and let us handle the
          cooking this Ramadan.
        </p>
        <Link
          href={CHECKOUT_URL}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          Secure My Ramadan Iftar Subscription
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

/* ─── Sticky Bottom CTA (Mobile) ─── */
function StickyBottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-border px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            Ramadan Iftar Box
          </p>
          <p className="text-[10px] text-muted-foreground">
            Limited Capacity
          </p>
        </div>
        <Link
          href={CHECKOUT_URL}
          className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity"
        >
          Reserve Now
        </Link>
      </div>
    </div>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-foreground text-background/60 py-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} IftarBox Montreal. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <ProductPreview />
        <SubscriptionTeaser />
        <HowItWorks />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
      <StickyBottomCTA />
    </>
  );
}
