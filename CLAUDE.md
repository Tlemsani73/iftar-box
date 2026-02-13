# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

Node.js is not on the default PATH. Prefix all npm/npx commands:
```bash
export PATH="/c/Program Files/nodejs:$PATH"
```

Shell is Git Bash (mingw) on Windows. Interactive CLI prompts may block — avoid them.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint via next lint
npm run start    # Serve production build
```

No test framework is configured yet.

## Architecture

**Next.js App Router** — three-page funnel for a Ramadan Iftar meal subscription service in Montreal.

### Pages

- `src/app/page.tsx` — **Landing page** (server component). Marketing sections: Hero (with `public/hero-video.mp4`), ProductPreview, SubscriptionTeaser, HowItWorks, TrustSection, FinalCTA. Links to `/product`.
- `src/app/product/page.tsx` — **Product configurator** (`"use client"`). Multi-step wizard (Configure → Add-ons → Your Info → Review) using `StepIndicator` and step components from `src/components/steps/`. Builds checkout URL with `orderToSearchParams()` and navigates to `/checkout?...`.
- `src/app/checkout/page.tsx` — **Checkout** (`"use client"`). Reads order from URL via `searchParamsToOrder()`. Has order summary, customer info, delivery method (pickup free vs delivery $5), and price breakdown. Stripe payment section is a **placeholder** — `handleSubmit()` is a no-op. Wraps `useSearchParams()` in a `<Suspense>` boundary. Does NOT yet use the shared TopBar/Footer components.

### Shared Components

- `src/components/TopBar.tsx` — Sticky header with logo + WhatsApp CTA. Used by landing and product pages.
- `src/components/Footer.tsx` — Site footer. Used by landing and product pages.
- `src/components/MobileCTA.tsx` — Sticky bottom CTA bar (`md:hidden`). Used by landing page.
- `src/components/StepIndicator.tsx` — Step progress bar for the product wizard.
- `src/components/steps/` — Wizard step panels: `ConfigureBox`, `AddOns`, `CustomerInfo`, `ReviewOrder`.

### Shared Domain Logic

`src/lib/order.ts` — Central pricing engine and types:
- Types: `BoxSize` (single/family), `BoxTheme` (traditional/mixed/light), `OrderType` (one-day/subscription), `SubDuration` (10/30), `BourekOption` (0/1/6/12), `HmissOption` (none/small/large), `DeliveryMethod` (pickup/delivery), `CustomerInfo`
- Three price tiers: `one-day`, `sub-10`, `sub-30` — applied to box price AND all add-ons
- `computePrices(order, deliveryMethod)` — returns boxPrice, addonsDaily, dailyTotal, days, mealTotal, deliveryFee, grandTotal, savings
- `orderToSearchParams()` / `searchParamsToOrder()` — URL-based state transfer between product → checkout

### What's Not Built Yet

- **No backend / API routes** — no `src/app/api/` directory exists
- **Stripe integration** — checkout payment is a UI placeholder only
- **Checkout page** still has its own inline TopBar/Footer (not using shared components)
- **WhatsApp URL** (`https://wa.me/15141234567`) is a placeholder, hardcoded in `TopBar.tsx` and `page.tsx`

## Styling

Tailwind CSS v4 — uses `@import "tailwindcss"` + `@theme` block in `globals.css`, NOT a `tailwind.config.js`. PostCSS plugin is `@tailwindcss/postcss`.

Custom theme tokens in `globals.css`: `--color-primary` (orange #c2410c), `--color-background` (cream #fefaf6), `--color-accent` (green #059669 for WhatsApp CTA), `--color-muted`, `--color-card`, `--color-border`. Use via Tailwind classes like `bg-primary`, `text-accent`.

Custom animations defined in `globals.css`: `animate-slide-in-right`, `animate-slide-in-left` (step transitions), `animate-price-pop` (price highlight), `animate-line-fill` (step connector).

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
