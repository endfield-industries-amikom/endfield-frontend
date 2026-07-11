# Endfield Frontend — SPEC

## Overview

React Router v7 framework mode (SSR). MUI v9 + Tailwind CSS v4. Netlify + Docker deployment.
Vite dev server with HMR. Role-based dashboard with 24 routes.

---

## Route Map

### Public Site
```
layout: home.tsx (Navbar + Footer)
├── /                     → home-content.tsx    (hero + swiper products)
├── /about                → about.tsx           (static)
├── /products             → products.tsx        (product grid)
├── /products/:id         → productId.tsx       (product detail)
└── /contact              → contact.tsx         (team profiles)
```

### Dashboard
```
guard: auth-guard.tsx (session validation)
├── /dashboard/login      → login.tsx
└── layout: dashboard.tsx (sidebar + header)
    ├── /dashboard                          → dashboard-index.tsx  (stats cards)
    ├── /dashboard/products                 → products.tsx         (list)
    ├── /dashboard/products/:id             → product-detail.tsx   (detail)
    ├── /dashboard/customers                → customers.tsx
    ├── /dashboard/customers/:id            → customer-detail.tsx
    ├── /dashboard/suppliers                → suppliers.tsx
    ├── /dashboard/suppliers/:id            → supplier-detail.tsx
    ├── /dashboard/warehouses               → warehouses.tsx
    ├── /dashboard/warehouses/:id           → warehouse-detail.tsx
    ├── /dashboard/regions                  → regions.tsx
    ├── /dashboard/regions/:id              → region-detail.tsx
    ├── /dashboard/inventory                → inventory.tsx
    ├── /dashboard/inventory/:id            → inventory-detail.tsx
    ├── /dashboard/purchase-orders          → purchase-orders.tsx
    ├── /dashboard/purchase-orders/:id      → purchase-order-detail.tsx
    ├── /dashboard/sales-orders             → sales-orders.tsx
    ├── /dashboard/sales-orders/:id         → sales-order-detail.tsx
    ├── /dashboard/shipments                → shipments.tsx
    ├── /dashboard/shipments/:id            → shipment-detail.tsx
    ├── /dashboard/schematics               → schematics.tsx
    ├── /dashboard/schematics/:id           → schematic-detail.tsx
    └── /dashboard/employees                → employees.tsx
```

---

## Auth Guard Flow

```
Browser → /dashboard/*
  → auth-guard loader (SSR):
      1. If /dashboard/login → pass through
      2. Read Cookie header
      3. POST /auth/refresh (forward cookie)
      4. Success → { accessToken } passed to children
      5. Failure → redirect /dashboard/login

Child routes:
  → loader calls getAccessToken(cookie) → fresh JWT
  → All API calls use Authorization: Bearer <token> + Cookie header
```

---

## Login Flow

### Loader
If session cookie exists → redirect `/dashboard`. Else show form.

### Action (3 intents)

| Intent | Flow |
|--------|------|
| `login` | `POST /auth/login { email, password }` → forward Set-Cookie → redirect /dashboard |
| `register` | `POST /auth/register { username, email, password }` → `POST /auth/login` → forward Set-Cookie → redirect /dashboard |
| `logout` | `POST /auth/logout` → clear sessionId cookie → redirect /dashboard/login |

### Component
Split-screen: left marketing panel, right form. ToggleButtonGroup (LOGIN/REGISTER). Register mode adds username field. Material UI inputs. Pending state via `useNavigation().state`.

---

## Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│ Sidebar (w-64)              │  Header           │
│ ┌──────────────────────┐    │  email [role]     │
│ │ Endfield ERP          │    │  [Logout]         │
│ │ (link → index)        │    ├──────────────────┤
│ │ ───────────────────── │    │                   │
│ │ NavLink items          │    │  <Outlet />      │
│ │ (role-filtered)        │    │  (child route)   │
│ └──────────────────────┘    │                   │
└─────────────────────────────────────────────────┘
```

### Role-Based Sidebar

| Role | Items |
|------|-------|
| **Admin** | Employees, Products, Customers, Suppliers, Warehouses, Regions, Inventory, Purchase Orders, Sales Orders, Shipments, Schematics |
| **Employee** | Customers, Inventory, Products, Regions, Purchase Orders, Suppliers, Shipments, Warehouses, Sales Orders, Schematics |
| **Consumer** | Products, My Orders, Shipments |

---

## Permissions Matrix

| Resource | Admin | Employee | Consumer |
|----------|-------|----------|----------|
| Products | Full CRUD | Full CRUD | View |
| Customers | Full CRUD | View | View |
| Suppliers | Full CRUD | View | — |
| Warehouses | Full CRUD | View | — |
| Regions | Full CRUD | View | — |
| Inventory | Create/Restock | Create/Restock | — |
| Purchase Orders | Create/Approve | Create | — |
| Sales Orders | Ship | View | Create own |
| Shipments | Create | Create | View |
| Schematics | Create/Produce | Create/Produce | — |
| Employees | Full CRUD | — | — |

Special: Consumer sees only their own sales orders (filtered by JWT email match).

---

## Services

### `api.server.ts` — SSR API client
- Reads `API_GATEWAY_URL` env var. 8s timeout.
- `get<T>(path, token?, cookie?)`, `post<T>(path, body, token?, cookie?)`, `patch`, `put`, `del`
- `apiRequestFull<T>(path, options)` — returns `{ data, headers, status }` for Set-Cookie forwarding
- Authorization: `Bearer ${token}` header. Cookie forwarding via `Cookie` header.

### `auth-helper.server.ts`
- `getAccessToken(cookie)` — calls `POST /auth/refresh`, returns fresh JWT string

### `types.ts`
- 12 entity interfaces: `Product`, `Customer`, `Supplier`, `Warehouse`, `Region`, `Inventory`, `PurchaseOrder`, `SalesOrder`, `Shipment`, `ProductionSchematic`, `OrderItem`, `UserProfile`
- `PaginatedResponse<T>`, `ApiResponse<T>` wrappers

---

## Dashboard Data Patterns

### List pages
Each list route exports `loader` + `action`:
- **Loader**: calls `getAccessToken(cookie)`, fetches entity list + related dropdown options in parallel via `Promise.all`
- **Action**: switch on `intent` form field — `create-*`, `update-*`, `delete-*`, plus special actions (`approve-po`, `ship-order`, `restock-inventory`, `produce-schematic`)
- **Component**: `useLoaderData()` for data, `<fetcher.Form>` for mutations, create/edit modals, dropdown selects for FK fields

### Detail pages
Read-only. Loader fetches single entity by `params.id`. Component renders card layout.

### Index page
Fetches counts from 4 endpoints in parallel. Renders 4 stat cards + welcome message.

### Creative styling
- **Schematics**: Amber document card grid with fold effect, input badges
- **Purchase/Sales Orders**: Receipt cards with dashed borders, header/body/footer sections

---

## Components

### Layout
| File | Purpose |
|------|---------|
| `Navbar.tsx` | MUI AppBar, brand logo, NAV_ITEMS links, "Dashboard" CTA button, mobile drawer |
| `Footer.tsx` | Dark footer with wave background |

### Products
| File | Purpose |
|------|---------|
| `ProductsHero.tsx` | Stripe-text hero heading |
| `ProductsGrid.tsx` | Responsive product card grid |
| `Product-Card.tsx` | MUI Card with image, badge, price |

### Contact
| File | Purpose |
|------|---------|
| `ProfileSelector.tsx` | Avatar row for team member selection |
| `ProfileDetails.tsx` | Selected member detail card |

---

## Styles

### Tailwind v4 + MUI v9
- Color palette: stone-100 bg, white cards, yellow-400 accents, stone-200 sidebar
- Custom font: Helvetica Neue 55
- Animations: `fade`, `flickerAppearY`, `flickerAppearX`
- Text effects: `.text-stripe-effect` (diagonal stripe clip), `.text-effect`
- Dark mode forced to light

---

## Scripts

| Script | Purpose |
|--------|---------|
| `dev` | `react-router dev --host` — Vite HMR dev server |
| `build` | `DEPLOY_TARGET=netlify react-router build` — Netlify deploy |
| `build-local` | `react-router build` — Docker deploy |
| `start` | `react-router-serve ./build/server/index.js` — SSR production |
| `typecheck` | `react-router typegen && tsc` |

---

## Environment

| Variable | Value (dev) |
|----------|-------------|
| `API_GATEWAY_URL` | `http://app:3000/api/v1` |
| `DEPLOY_TARGET` | `netlify` (for Netlify build) |

---

## Docker

### Development (`Dockerfile.dev`)
- `node:20-alpine`, `npm install` (all deps), `npm run dev` (Vite HMR)
- Volume mount: `./endfield-frontend:/app` + anonymous `node_modules`, `.react-router`, `build`

### Production (`Dockerfile`)
- Multi-stage: `npm ci` (dev deps for build) → `npm run build-local` → `npm ci --omit=dev` (prod)
- Output: `react-router-serve ./build/server/index.js`
