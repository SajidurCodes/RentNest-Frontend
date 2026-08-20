# RentNest Frontend 🏠

**Find & List Rental Properties with Ease**

A responsive, role-based rental property marketplace built with Next.js 15 (App Router), TypeScript, and shadcn/ui. Tenants browse and rent properties, landlords manage listings and requests, and admins moderate the platform — all backed by a Node/Express/Prisma REST API.

---

## 🔗 Project Links

| Resource | Link |
|---|---|
| **Frontend Repo** | https://github.com/your-username/rentnest-frontend |
| **Live Frontend** | https://rentnest-app.vercel.app |
| **Backend API** | https://rent-nest-gules.vercel.app |
| **Demo Video** | https://drive.google.com/file/d/xxx/view |

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@rentnest.com | admin123 |
| Landlord | (add your test landlord email) | (password) |
| Tenant | (add your test tenant email) | (password) |

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling/UI:** Tailwind CSS + shadcn/ui
- **Forms & Validation:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Notifications:** Sonner (toast notifications)
- **Payments:** Stripe Checkout (redirect flow)
- **Route Protection:** Next.js Middleware (role-based)

---

## Features

### Public
- Home page with featured properties
- Property browse page with search, category, price range, bedroom/bathroom filters
- Property details page with image gallery, description, landlord info, and reviews

### Tenant
- Register/login
- Submit rental requests on any available property
- Dashboard: rental request history (status badges), payment history
- Pay for approved requests via Stripe Checkout
- Leave reviews on active/completed rentals

### Landlord
- Dashboard overview (property count, pending/active requests)
- Create, edit, delete property listings
- Toggle property availability
- Approve/reject incoming rental requests (optimistic UI updates)

### Admin
- Platform overview (total users, banned users, total properties)
- User management: search, filter by role, ban/unban
- Read-only property moderation view across the whole platform

### Cross-cutting
- Role-based route protection via middleware (`/dashboard/tenant`, `/dashboard/landlord`, `/dashboard/admin`)
- Toast notifications for all key actions
- Skeleton loaders and `error.tsx`/`loading.tsx` fallbacks throughout
- Custom 404 page

---

## Project Structure

```
app/
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── properties/
│   ├── page.tsx                  # Browse + filters
│   ├── [id]/page.tsx              # Property details
│   ├── loading.tsx
│   └── error.tsx
├── dashboard/
│   ├── tenant/
│   │   ├── page.tsx                # Requests + payment history
│   │   └── requests/[id]/pay/page.tsx
│   ├── landlord/
│   │   ├── layout.tsx              # Shared nav
│   │   ├── page.tsx                # Overview
│   │   ├── properties/
│   │   │   ├── page.tsx            # My Properties
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── requests/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── users/page.tsx
│   │   └── properties/page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── payment-success/page.tsx        # Stripe redirect target (see note below)
├── payment-cancel/page.tsx
├── layout.tsx                       # Navbar + Footer + Toaster
├── error.tsx
└── not-found.tsx

components/
├── ui/                 # shadcn primitives
├── shared/              # navbar, footer, status-badge
├── properties/           # property-card, filters, request dialog
└── dashboard/             # property-form, leave-review-dialog

lib/
├── api-client.ts        # Axios instance with auth interceptor
├── auth.ts               # Cookie + JWT decode helpers
├── services.ts            # All API calls, grouped by resource
├── error.ts                # getErrorMessage() helper
└── utils.ts                # cn() and other shadcn utils

middleware.ts              # Role-based route protection (project root)
types/index.ts              # Shared TypeScript types
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

### 3. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Backend Requirements

This is a frontend-only project that consumes a separate backend API (Node/Express/Prisma). The backend must:
- Expose the auth, users, properties, categories, rentals, payments, and reviews endpoints as documented in the API spec
- Have CORS configured to allow this frontend's origin (`http://localhost:3000` in dev, plus your deployed frontend URL in production)
- Set its `APP_URL` environment variable to point at **this frontend's URL**, since it's used to build Stripe's `success_url`/`cancel_url` redirect targets


## Authentication & Route Protection

- On login, the JWT is saved to a cookie (`token`) rather than `localStorage`, since Next.js Middleware runs server-side and can't read `localStorage`.
- `middleware.ts` checks the token on every request to `/dashboard/*`:
  - No token → redirect to `/auth/login`
  - Expired/invalid token → clear cookie, redirect to login
  - Valid token but wrong role for the section → redirect to the user's own dashboard
  - Correct role → allow through
- The navbar independently decodes the token client-side to show the right nav items (Login/Register vs. account menu).

---

## Payment Flow

1. Tenant submits a rental request → status `PENDING`
2. Landlord approves → status `APPROVED`, tenant sees a "Pay Now" button
3. Tenant clicks Pay Now → frontend calls `POST /payments/create` → redirects to Stripe Checkout
4. On success, Stripe redirects to `/payment-success?session_id=...` → page auto-redirects to the tenant's Payment History tab after a few seconds
5. Backend's Stripe webhook (`/payments/confirm`) updates the payment to `COMPLETED` and the rental request to `ACTIVE`



