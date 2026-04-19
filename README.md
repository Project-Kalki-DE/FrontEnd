# Magical Frames — Frontend

> Angular 19 SPA for the **Magical Frames** premium print studio. Customers can browse canvas (Leinwandbilder) and acrylic glass (Acrylglasbilder) art prints, configure formats and accessories, build a cart, and place orders. Fully internationalised in German, English, and Turkish.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Pages & Routes](#pages--routes)
- [API Integration](#api-integration)
- [Internationalisation](#internationalisation)
- [Getting Started](#getting-started)
- [Running the App](#running-the-app)
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

## API Integration

The app talks to the backend via two endpoints. The base URL is set per environment:

| Environment | `apiUrl` |
|---|---|
| Development | `''` (relative, proxied via `serve-all.js` → `localhost:3000`) |
| Production | `https://YOUR_BACKEND_URL` (set in `src/environments/environment.prod.ts`) |

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

---

## Running the App

### Local dev server (German locale, hot-reload)

```bash
npm start
# → http://localhost:4200/
```

### All locales locally (build first, then serve)

```bash
npm run start:all
# → http://localhost:4200/de/   http://localhost:4200/en/   http://localhost:4200/tr/
```

The `serve-all.js` script proxies `/api/*` to `localhost:3000` (backend must be running).

### Production build

```bash
npm run build
# Output: dist/front-end/browser/
```

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

> Target: **Vercel** (see project wiki for full deploy guide)

The Angular build output (`dist/front-end/browser/`) is a set of static files and can be deployed to any static host. For Vercel:

- Set build command: `npm run build`
- Set output directory: `dist/front-end/browser/de` (or configure rewrites per locale)
- Set environment variable: `BACKEND_URL` → your Render backend URL
- Add `vercel.json` rewrites to proxy `/api/*` to the backend

---

## Project Structure

```
src/
├── app/
│   ├── app.component.ts                Root component
│   ├── app.config.ts                   Angular bootstrap config
│   ├── app.routes.ts                   Route definitions
│   ├── home/                           Landing page
│   ├── ready-made-leinwandbilder/      Canvas art catalog
│   ├── ready-made-acrylglasbilder/     Acrylic glass catalog
│   ├── vinyl-sticker/                  Sticker page (stub)
│   ├── warenkorb/                      Cart & checkout
│   ├── services/
│   │   └── cart.service.ts             Cart state (localStorage)
│   └── shared/
│       └── header/                     Nav, language switcher, cart count
├── environments/
│   ├── environment.ts                  Dev config (apiUrl: '')
│   └── environment.prod.ts             Prod config (apiUrl: backend URL)
├── locale/
│   ├── messages.en.xlf                 English translations
│   └── messages.tr.xlf                 Turkish translations
├── assets/                             Static images, fonts
└── styles.css                          Global styles
nginx.conf                              Nginx config (i18n routing, API proxy)
serve-all.js                            Local multi-locale dev server
docker-compose.yml                      Orchestrates frontend + backend
```
