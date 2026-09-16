# Kōko — Joyful, Sustainable Homeware & Lifestyle (Portfolio #7)

> **Portfolio Piece #7 of 12**: A complete, production-ready, full-stack E-commerce Brand website called **"Kōko"** (a playful, sustainable homeware + lifestyle products brand).
>
> Distinct visual identity from Websites 1–6: no bento grid, no split-map tool, no cinematic photo-scroll, no diagonal kinetic gym energy, no soft organic clinical calm, no monochrome editorial typography showcase. This is a genuine shopping experience — real product grid, filters, cart, wishlist, and test-mode Stripe checkout — wrapped in a playful, colorful candy-pastel visual identity with chunky rounded typography.

---

## 🎨 Design System & Visual Identity

- **Candy-Pastel Color-Blocking**:
  - Soft Coral Pink (`#FFB4A2`)
  - Buttery Yellow (`#FFE066`)
  - Sky Lavender (`#C8B6FF`)
  - Mint (`#B8F2E6`)
  - Rotating background color-blocks per product card / category / section.
  - Grounding near-black (`#1A1A1A`) for typography and UI chrome.
  - **Dark Mode**: Warm deep plum (`#1F1626`) base with slightly deepened accent pops and elevated card surfaces (`#2B1F34`) so product photography never looks muddy.
- **Chunky Rounded Typography**:
  - Display sans: **Fredoka** (`font-display`, bold/bubbly weights).
  - Clean UI/Body: **Plus Jakarta Sans** (`font-sans`).
- **Tactile Shapes**:
  - Very large bubbly corner radii (`rounded-3xl`, `rounded-4xl`, `rounded-full`) across all buttons, filter chips, and product cards.
- **Imagery**:
  - Bright, clean homeware and lifestyle photography with **hover crossfade** to secondary angle/lifestyle photos.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (client-side cart & wishlist persisted to `localStorage` with SSR hydration guards)
- **Micro-Interactions**: Framer Motion (fly-to-cart animation, spring drawers, active filter chip layout transitions, image crossfade)
- **Celebration**: `canvas-confetti` (checkout success)
- **Database & ORM**: SQLite + Prisma ORM (Category, Product, Order, NewsletterSubscriber models seeded with 27 realistic products)
- **Payments**: Stripe Checkout in official **TEST MODE** with server-side database price lookup and webhook fulfillment
- **Validation**: Zod schema validation on all API endpoints
- **Theme**: `next-themes` (Dark/Light mode)

---

## 📦 Features & Interactive Pages

1. **Header & Navigation**:
   - Playful rounded Kōko logo mark.
   - Category navigation pills.
   - Instant Search overlay with real-time live search, search history, and keyboard shortcuts (`ESC`).
   - Wishlist button with animated count badge.
   - Cart bag button with bouncing badge that acts as the landing target for the **fly-to-cart animation**.
   - Sun/Moon dark mode toggle pill.
   - Rotating top announcement ribbon.

2. **Hero Carousel**:
   - 3 rotating color-blocked pastel promo slides (Coral, Yellow, Lavender) with chunky headlines, pill CTAs, floating product cutouts with bobbing micro-motion, and eco badges.

3. **Category Strip**:
   - Large tappable circular/rounded category tiles on rotating pastel blocks, horizontally scrollable with touch-swipe support.

4. **Product Listing Page (`/shop`)**:
   - Real-time client-side filter engine synchronized with URL query params (`category`, `price`, `color`, `inStock`, `sort`).
   - Desktop sticky sidebar + Mobile sliding bottom-sheet drawer.
   - Active filter tags with animated exit transitions and "Clear All" button.
   - Product cards with signature rotating pastel backdrops, hover image swap, wishlist heart burst, and quick-add button with **fly-to-cart animation**.

5. **Product Detail Page (`/products/[slug]`)**:
   - Multi-image gallery with hover-zoom and thumbnail strip.
   - Color swatches with animated scale/highlight ring and size buttons (>=44px mobile tap targets).
   - Dynamic live stock indicators ("Only 3 left in stock!").
   - Quantity stepper and functional "Add to Cart" + "Add to Wishlist".
   - Accordion tabs for Details & Materials, Dimensions & Care, Sustainability, Shipping & Returns.
   - Customer review breakdown and "You might also like" related product strip.

6. **Slide-In Cart Drawer**:
   - Spring-based slide-in drawer accessible from anywhere.
   - Free shipping progress bar ($65 target with dynamic celebration).
   - Line items with thumbnail, selected color/size, unit price, quantity stepper, and remove action.
   - Functional promo code field (e.g., `KOKO10` for 10% discount).
   - "Checkout with Stripe" button initiating the verified checkout session.

7. **Wishlist Page (`/wishlist`)**:
   - Grid of saved products with quick "Move to Cart" (with fly-to-cart animation) and "Remove".

8. **Checkout Success Page (`/checkout/success`)**:
   - Real session confirmation fetching database-verified order details.
   - Confetti burst animation using `canvas-confetti`.
   - Order summary breakdown, estimated carbon-neutral delivery date, and receipt overview.

9. **Sustainability Section & Newsletter**:
   - Color-blocked pledge cards: 100% Plastic-Free, Ethical Artisan Partnerships, Non-Toxic Materials, 1% For The Planet.
   - Functional newsletter signup band with instant 10% coupon reveal and one-click copy.

---

## 🔒 Security & Price Verification

- **Never Trust Client Prices**: The `/api/checkout` endpoint receives only `{ productId, color, size, quantity }`. It re-queries the SQLite database server-side to fetch actual prices and verify stock availability, ignoring any client claims.
- **Server-Side Secrets**: All Stripe secret keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) remain strictly server-side.
- **Webhook Signature Verification**: The `/api/webhooks/stripe` endpoint verifies the `stripe-signature` header before trusting any webhook event.
- **Rate Limiting**: In-memory rate limiting applied to checkout session creation and newsletter endpoints.
- **Security Headers**: Configured in `next.config.mjs` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- **Safe Queries**: 100% parameterized queries via Prisma ORM (zero raw SQL).

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default values for local SQLite development:
```env
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY="sk_test_placeholder_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_placeholder_key"
STRIPE_WEBHOOK_SECRET="whsec_placeholder_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed Products
```bash
npx prisma db push
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💳 Testing Stripe in TEST MODE

### Official Stripe Test Cards
When using live Stripe test keys (`sk_test_...`):
- **Card Number**: `4242 4242 4242 4242`
- **Expiration Date**: Any date in the future (e.g., `12/30`)
- **CVC**: Any 3 digits (e.g., `123`)
- **Postal Code**: Any valid postal code (e.g., `90210`)

### Local Webhook Testing with Stripe CLI
To test webhook order fulfillment locally:
1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Login: `stripe login`
3. Forward events to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
4. Copy the webhook signing secret printed by the CLI (`whsec_...`) and update `STRIPE_WEBHOOK_SECRET` in your `.env`.
5. Trigger a test payment:
```bash
stripe trigger checkout.session.completed
```

---

## 🚢 Zero-Config Vercel Deployment

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set your environment variables in the Vercel project settings:
   - `DATABASE_URL` (SQLite file or Vercel Postgres)
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy! Next.js 14 App Router builds automatically with zero configuration.
