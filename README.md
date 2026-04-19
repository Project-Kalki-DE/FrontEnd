# Magical Frames — Frontend

> Angular 19 SPA for the **Magical Frames** premium print studio. Customers can browse canvas (Leinwandbilder) and acrylic glass (Acrylglasbilder) art prints, configure formats and accessories, build a cart, and place orders. Fully internationalised in German, English, and Turkish.

**Live:** https://front-end-rosy-theta.vercel.app  
**Backend API:** https://magical-frames-api-mqzb.onrender.com

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Pages & Routes](#pages--routes)
- [Shared Header](#shared-header)
- [Search Bar](#search-bar)
- [API Integration](#api-integration)
- [Internationalisation](#internationalisation)
- [Getting Started](#getting-started)
- [Running the App](#running-the-app)
- [LAN / Mobile Testing](#lan--mobile-testing)
- [Testing](#testing)
- [Docker](#docker)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Angular | 19.2.0 |
| Language | TypeScript | 5.7.2 |
| HTTP | @angular/common/http | 19 |
| Routing | @angular/router | 19 |
| Forms | @angular/forms | 19 |
| i18n | @angular/localize | 19 |
| Testing (unit) | Karma + Jasmine | — |
| Testing (e2e) | Playwright | — |
| Web Server | Nginx (Alpine) | — |
| Container | Docker + Docker Compose | — |

---

## Pages & Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomeComponent` | Landing page — hero, services overview, contact form, language switcher |
| `/ready-made-leinwandbilder` | `ReadyMadeLeinwandbilderComponent` | Canvas art catalog — 6 designs, format picker, frame options, add-to-cart |
| `/ready-made-acrylglasbilder` | `ReadyMadeAcrylglasbilderComponent` | Acrylic glass catalog — 7 designs (incl. round formats), format picker, add-to-cart |
| `/vinyl-sticker` | `VinylStickerComponent` | Vinyl sticker page (coming soon) |
| `/warenkorb` | `WarenkorbComponent` | Shopping cart — review items, enter email, place order |

---

## Shared Header

`src/app/shared/header/` is used by the Leinwandbilder, Acrylglasbilder, and Warenkorb pages. The **Home page** has its own inline header component because its design differs (hero overlay, language switcher placement).

Both headers include:
- Logo + navigation links
- Language switcher dropdown (DE / EN / TR)
- Cart icon with live item count badge
- Search bar (see below)

---

## Search Bar

A live search is built into both the shared header and the home page header.

- Searches across 8 items: Home, Über uns, Leistungen, Kontakt, Acrylglasbilder, Leinwandbilder, Vinyl Sticker, Warenkorb
- Filters by label and sublabel as the user types
- Keyboard navigation: `ArrowUp` / `ArrowDown` to move through results, `Enter` to select, `Escape` to close
- Clicking outside the search wrapper closes the dropdown
- Selecting a result navigates via `Router.navigate()` — anchor-based items (e.g. Über uns, Kontakt) also call `scrollIntoView` after navigation

**Mobile layout:** On screens ≤ 768 px the search wrapper sits inline with the logo and hamburger menu (same row), and the nav links wrap to a second row below.

---

## API Integration

The app talks to the backend via two endpoints. The base URL is set per environment:

| Environment | `apiUrl` |
|---|---|
| Development | `''` (relative, proxied via `serve-all.js` → `localhost:3000`) |
| Production | `https://magical-frames-api-mqzb.onrender.com` (set in `src/environments/environment.prod.ts`) |

### `POST /api/contact`

Called from `HomeComponent` on contact form submission.

```typescript
// Request body
{
  name: string;      // required
  email: string;     // valid email, required
  subject: string;   // trimmed
  message: string;   // required
}
```

### `POST /api/order`

Called from `WarenkorbComponent` on checkout.

```typescript
// Request body
{
  customerEmail: string;
  items: Array<{
    productType: 'acryl' | 'leinwand';
    designFullName: string;
    formatLabel: string;      // e.g. "80 × 120 cm"
    price: string;            // e.g. "€249.99"
    menge: number;            // quantity, min 1
    rahmen?: string;          // canvas only (e.g. "2cm", "4cm")
    zubehor: string;          // accessory (e.g. "none", "hook")
  }>;
}

// Response
{
  orderId: string;
  message: string;
}
```

Cart state is managed via `CartService` using `localStorage` and cleared on successful order.

---

## Internationalisation

Three supported locales, each built as a separate artifact:

| Locale | URL prefix | Default |
|---|---|---|
| German (de) | `/de/` | ✅ (root `/` redirects here) |
| English (en) | `/en/` | — |
| Turkish (tr) | `/tr/` | — |

Nginx routes each prefix to the corresponding build output and falls back to `index.html` for client-side routing. To add a new language:

1. Add locale to `angular.json` (`i18n.locales` + `build.configurations.production.localize`)
2. Create `src/locale/messages.<lang>.xlf` with translations
3. Add to the language switcher array in `HomeComponent`
4. Add a `location /<lang>/` block to `nginx.conf`

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI (`npm i -g @angular/cli`)
- Docker Desktop (for containerised runs)

### Install

```bash
cd FrontEnd
npm install
```

> `.npmrc` sets `legacy-peer-deps=true` to resolve Angular 19 peer dependency conflicts.

---

## Running the App

### Local dev server (German locale, hot-reload)

```bash
npm start
# → http://localhost:4200/
```

### All locales locally (build first, then serve)

```bash
npm run build
node serve-all.js
# → http://localhost:4200/de/   http://localhost:4200/en/   http://localhost:4200/tr/
```

`serve-all.js` proxies `/api/*` requests to `localhost:3000` (backend must be running separately). It binds to `0.0.0.0` so the app is reachable on your local network (see LAN / Mobile Testing below).

### Production build

```bash
npm run build
# Output: dist/front-end/browser/{de,en,tr}/
```

---

## LAN / Mobile Testing

`serve-all.js` listens on `0.0.0.0:4200`, making the built app accessible from any device on the same Wi-Fi network. When started it prints the LAN URL automatically, e.g.:

```
LAN:   http://192.168.0.62:4200/de/
```

Open that URL on a phone or tablet to test mobile layouts without a separate deploy.

---

## Testing

### Unit tests

```bash
npm test
```

Runs Karma + Jasmine in a headless browser.

### E2E tests (Playwright)

Playwright tests run against the Dockerised app — no local server needed.

```bash
npm run e2e
```

This automatically starts Docker Compose, runs all tests in `/e2e`, then tears down. Reports land in `playwright-report/`.

---

## Docker

```bash
# Build and start (frontend on :8080, backend on :3000 internal)
npm run docker:up        # docker-compose up --build

# Stop
npm run docker:down      # docker-compose down
```

The multi-stage Dockerfile:
1. **Build stage** — Node 18, `npm install && npm run build`
2. **Serve stage** — Nginx Alpine, copies `dist/` artifacts and `nginx.conf`

Nginx handles:
- i18n URL routing (`/de/`, `/en/`, `/tr/`)
- SPA fallback (`try_files` → `index.html`)
- API reverse proxy (`/api/*` → `backend:3000`)
- Static asset caching (1-year max-age for JS/CSS/fonts/images)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

---

## Deployment

### Frontend — Vercel

Deployed at: **https://front-end-rosy-theta.vercel.app**

- Build command: `npm run build`
- Output directory: `dist/front-end/browser`
- `vercel.json` rewrites handle locale routing (`/de/`, `/en/`, `/tr/`) and proxy `/api/*` to the Render backend

### Backend — Render

API live at: **https://magical-frames-api-mqzb.onrender.com**

See the [BackendService README](../BackendService/README.md) for full backend setup, environment variables, and rate limiting details.

---

## Project Structure

```
src/
├── app/
│   ├── app.component.ts                Root component
│   ├── app.config.ts                   Angular bootstrap config
│   ├── app.routes.ts                   Route definitions
│   ├── home/                           Landing page (inline header + search)
│   ├── ready-made-leinwandbilder/      Canvas art catalog
│   ├── ready-made-acrylglasbilder/     Acrylic glass catalog (incl. round format images)
│   ├── vinyl-sticker/                  Sticker page (stub)
│   ├── warenkorb/                      Cart & checkout
│   ├── services/
│   │   └── cart.service.ts             Cart state (localStorage)
│   └── shared/
│       └── header/                     Shared nav header (search, lang switcher, cart badge)
├── environments/
│   ├── environment.ts                  Dev config (apiUrl: '')
│   └── environment.prod.ts             Prod config (apiUrl: Render backend URL)
├── locale/
│   ├── messages.xlf                    Source strings (German)
│   ├── messages.en.xlf                 English translations
│   └── messages.tr.xlf                 Turkish translations
├── assets/
│   └── images/                         Product and UI images
└── styles.css                          Global styles
nginx.conf                              Nginx config (i18n routing, API proxy, security headers)
serve-all.js                            Local multi-locale dev server (LAN-accessible, 0.0.0.0)
docker-compose.yml                      Orchestrates frontend + backend
```
