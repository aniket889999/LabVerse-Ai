# LabVerse AI: Frontend Routing & Hierarchy

The frontend is built with Next.js App Router (`src/app`). This structure allows for server components by default, optimizing load times and SEO.

## Directory Structure (src/app)

```text
src/app
├── (public)                 # Route group for unauthenticated access
│   ├── page.tsx             # '/' - Landing Page & Lab Explorer
│   ├── login/               # '/login' - Authentication
│   ├── register/            # '/register' - Account Creation
│   ├── tours/               # '/tours' - Virtual Guided Tours overview
│   └── labs/
│       └── [id]/            # '/labs/:id' - Public Lab Details
├── (authenticated)          # Route group protected by middleware
│   ├── layout.tsx           # Authenticated shell (Sidebar/Navbar)
│   ├── projects/            # '/projects' - Project Repository
│   ├── book/                # '/book' - Visit Booking interface
│   └── labs/
│       └── [id]/
│           └── guide/       # '/labs/:id/guide' - AI Lab Guide
└── (admin)                  # Route group for Faculty Admin / Industry
    ├── layout.tsx           # Admin shell with advanced navigation
    └── dashboard/           # '/dashboard' - Analytics & Management
```

## Component Architecture (`src/components`)

To maintain a scalable UI, components are organized atomically:

*   **`ui/`**: Base UI elements (Buttons, Inputs, Cards, Modals) - potentially using `shadcn/ui`.
*   **`forms/`**: Complex form compositions (BookingForm, LoginForm).
*   **`labs/`**: Lab specific components (LabCard, LabGrid, EquipmentList).
*   **`ai/`**: AI guide interface components (ChatInterface, MessageBubble).
*   **`analytics/`**: Charts and data tables.

## Routing Strategy & Data Fetching

1.  **Lab Explorer (`/`)**: Uses Server-Side Rendering (SSR) or Incremental Static Regeneration (ISR) to load the initial list of labs rapidly.
2.  **AI Lab Guide (`/labs/:id/guide`)**: Uses Client Components (`"use client"`) to handle interactive state, streaming API responses, and WebSocket connections for real-time chat.
3.  **Dashboards (`/dashboard`)**: Mixed SSR for initial layout and Client-side fetching (SWR or React Query) for dynamic metric updates.
