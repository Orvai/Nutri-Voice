# Coach App (Expo) — Technical Overview

The Coach App is a production-grade **Expo** application (Web + Mobile) that serves as the operational cockpit for Nutri-Voice coaches: client oversight, messaging, AI assist, and plan management.

It is designed around **contract-first data access** (OpenAPI → Orval SDK) and **reliable client state** (TanStack Query).

---

## Table of Contents
- [Architecture](#architecture)
- [Key Product Areas](#key-product-areas)
- [Contract-First SDK](#contract-first-sdk)
- [State & Data Fetching](#state--data-fetching)
- [Project Structure](#project-structure)
- [Developer Notes](#developer-notes)

---

## Architecture

```mermaid
flowchart LR
  subgraph Expo App
    Router[Expo Router (app/)]
    Screens[Dashboard • Clients • Chat • Plans]
    Query[TanStack Query]
  end

  subgraph SDK
    Orval[Orval Generated SDK]
    Fetcher[Custom Fetcher]
  end

  subgraph Backend
    Gateway[API Gateway (OpenAPI)]
    Services[Microservices]
  end

  Router --> Screens
  Screens --> Query
  Query --> Orval
  Orval --> Fetcher
  Fetcher --> Gateway
  Gateway --> Services
```

---

## Key Product Areas
- **Dashboard**: coach-level KPIs, daily summaries, and “what needs attention”
- **Clients**: client list + dedicated profile views (plans, progress, logs)
- **Chat / Inbox**: conversation history + pending items + assisted replies
- **AI Assist**: suggested replies, summaries, triage (human approval when needed)
- **Nutrition Plans**: templates, assignments, and per-client adjustments
- **Workout Plans**: programs, exercises, training day structure

---

## Contract-First SDK

The app consumes a typed SDK generated from the Gateway’s OpenAPI spec.

- **Spec endpoint:** `/api/docs-json` (served by gateway)
- **Output SDK:** `apps/common/api/sdk/`
- **Client style:** `react-query` (Orval generates hooks/clients compatible with TanStack Query)
- **Fetcher:** shared network layer in `apps/common/api/sdk/fetcher.ts`

Why this matters:
- Removes guesswork: request/response types stay aligned with the backend.
- Enables safe refactors: changes happen at the contract level, then propagate.
- Keeps UI code clean: most networking logic is handled by generated clients + query hooks.

---

## State & Data Fetching
- **TanStack Query** handles caching, refetching, retries, and background updates.
- Domain-specific hooks live under `src/hooks/` (tracking, clients, conversations, menus, workouts).
- UI mappers translate backend DTOs into view-friendly shapes where needed.

---

## Project Structure

```
apps/Saas-app/
├── app/                    # Expo Router screens and layouts
├── src/
│   ├── hooks/              # Query hooks by domain
│   ├── components/         # Reusable UI components
│   ├── context/            # Auth + app state
│   ├── theme/              # Design system
│   └── types/              # UI-focused shared types
├── app.json
├── package.json
└── tsconfig.json
```

---

## Developer Notes
- The Coach App is intended to be the **control plane** for a multi-service system.
- The highest-leverage pattern in this codebase is **contract-first + generated SDK + query hooks**.
- The UI layer stays stable even as services evolve, because API changes surface as compile-time type errors.

> For backend routing, service boundaries, and webhook flows, see `services/README.md`.
