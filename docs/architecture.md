# Architecture Notes: LabVerse AI

## 1. Frontend Architecture
**Framework:** Next.js (App Router) + Tailwind CSS
* **Routing:** Utilizes the new App Router for hybrid rendering. Public pages (`/labs`, `/projects`) are statically generated or server-rendered for SEO, while interactive pages (`/dashboard`, `/ai-guide`) use Client Components (`"use client"`).
* **Service Layer:** `src/lib/api.ts` acts as the single source of truth for all API calls. It uses native `fetch` wrapped with custom configuration (e.g., `credentials: 'include'`) to cleanly interface with the backend.
* **Component Design:** Follows an atomic-inspired design, separating generic layout elements (`Navbar.tsx`) from feature-specific components (`LabExperience.tsx`).

## 2. Backend Architecture
**Framework:** Node.js + Express.js + TypeScript
* **Pattern:** Strict Controller-Service-Repository pattern.
  * *Routes:* Map HTTP endpoints to controllers.
  * *Controllers:* Extract inputs, run Zod validation, handle HTTP responses, and catch errors.
  * *Services:* Contain the core business logic and orchestrate data fetching.
* **Typing:** Zod is used at the boundary layer for runtime request validation, complementing TypeScript's static compile-time checks.

## 3. Database Design
**ORM:** Prisma / **Engine:** PostgreSQL
* **Core Entities:** `User`, `Lab`, `Equipment`, `Project`, `Booking`, `AnalyticsEvent`, `AiKnowledgeDocument`.
* **Relationships:** 
  * Labs have a one-to-many relationship with Equipment, Projects, and Bookings.
  * Users (Faculty Admins) have a one-to-many relationship with Labs.
* **Referential Integrity:** Prisma handles cascading deletes and foreign-key constraints to maintain pristine data states.

## 4. Authentication Architecture
**Mechanism:** JWT (JSON Web Tokens) with `httpOnly` Cookies
* **Flow:** 
  1. Client sends credentials to `POST /api/v1/auth/login`.
  2. Backend validates bcrypt hash and signs a JWT containing `{ userId, role }`.
  3. Backend attaches the JWT to the response via a secure, `httpOnly` cookie.
* **Security:** `httpOnly` prevents JavaScript from accessing the token, neutralizing XSS attacks.
* **Middleware:** `authenticate` decodes the cookie. `authorizeRoles` checks the extracted `role` against allowed permissions (RBAC).

## 5. AI Fallback/RAG Architecture
**Concept:** Retrieval-Augmented Generation (RAG) with a built-in safety net.
* **Step 1 (Context Retrieval):** The backend intercepts the user's query and performs a keyword search across PostgreSQL (`Labs`, `Projects`, `AiKnowledgeDocument`) to dynamically gather context.
* **Step 2 (LLM Route):** If `GEMINI_API_KEY` exists, the context and query are securely forwarded to the Google Gemini API to generate a human-like response.
* **Step 3 (Fallback Route):** If the API key is missing or the external service fails, the backend safely intercepts the failure and synthesizes the retrieved database records into a structured Markdown response. This guarantees 100% demo uptime without relying on third-party services.

## 6. Analytics Pipeline
* **Tracking:** A dedicated `AnalyticsTracker.tsx` client component fires events to `POST /api/v1/analytics` whenever a user views a page or clicks a specific CTA.
* **Aggregation:** The Admin Dashboard utilizes `GET /api/v1/admin/analytics/summary` to run optimized `count()` queries in Prisma, generating real-time metric cards for Faculty Admins.

## 7. Admin Workflow
* **State Machine:** Bookings transition through a strict state machine: `PENDING` -> `APPROVED` / `REJECTED` -> `COMPLETED`.
* **Optimistic UI:** When an admin clicks "Approve" in the dashboard, the frontend immediately updates the badge color to green and switches the available actions while the background API call completes, ensuring a snappy, premium feel.
