# LabVerse AI

LabVerse AI is an interactive, AI-powered digital twin platform designed to showcase university laboratories to students, faculty, and industry partners. It serves as a centralized hub for exploring lab equipment, reviewing student projects, booking physical visits, and querying an intelligent AI guide for contextual insights.

## Problem Statement
University lab ecosystems often suffer from fragmented visibility. Students struggle to find relevant projects or equipment, industry partners lack an easy way to explore collaboration opportunities, and faculty admins spend excess time manually managing visit requests and answering repetitive questions.

## Solution Overview
LabVerse AI bridges this gap by providing a seamless, public-facing digital directory paired with a robust backend. Users can explore labs via an interactive map, browse an integrated project repository, and book visits. An integrated AI Guide (RAG architecture) allows users to ask questions and receive context-aware answers directly from the lab's knowledge base.

## Key Features
- **Public Lab Explorer:** Browse labs, capabilities, and active equipment statuses.
- **Interactive Map & Guided Tours:** Visual exploration of the lab ecosystem.
- **Project Repository:** Discover student projects linked to specific labs and equipment.
- **AI Guide (LLM + Fallback):** RAG-powered chatbot to answer contextual questions about the ecosystem. Safe fallback mechanism ensures 100% uptime without an API key.
- **Booking System:** Public visit requests for physical visits, online demos, and industry partnerships.
- **Faculty Admin Dashboard:** Secure RBAC dashboard to manage, approve, or reject booking requests.
- **Analytics Tracking:** Real-time event tracking and dashboard insights for lab engagement.

## Tech Stack
**Frontend:**
- Next.js (App Router, React 18)
- Tailwind CSS
- Lucide Icons
- Fetch API with Next.js Cache Control

**Backend:**
- Node.js & Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (Validation)
- JWT & bcryptjs (Authentication)

## Architecture Overview
The application follows a decoupled client-server architecture:
- **Client Layer:** Next.js Server Components and Client Components render the UI and consume the Express REST APIs. 
- **Service Layer (Express):** API routes delegate to controllers, which use dedicated services to abstract business logic.
- **Data Layer:** Prisma interacts with PostgreSQL, managing schemas and executing migrations safely.

## Folder Structure
```text
LabVerse-Ai/
├── frontend/             # Next.js Application
│   ├── src/app/          # App Router Pages
│   ├── src/components/   # Reusable UI Components
│   └── src/lib/          # API Client & Utilities
├── backend/              # Express API Server
│   ├── src/controllers/  # Request Handlers
│   ├── src/routes/       # Express Router
│   ├── src/services/     # Business Logic & Database Queries
│   └── prisma/           # Schema & Seeding Scripts
├── docs/                 # Documentation & Architecture
└── README.md             # Project Root Overview
```

## Local Setup

### 1. Database Configuration
Ensure you have a running PostgreSQL instance (or Docker container).
Rename `backend/.env.example` to `backend/.env` and update the `DATABASE_URL`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/labverse"
GEMINI_API_KEY="" # Optional for AI Guide
JWT_SECRET="fallback-secret-for-dev"
```

### 2. Backend Initialization
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Demo Credentials
Use these pre-seeded accounts at `http://localhost:3000/login` to access the protected dashboards:
- **Faculty Admin:** `admin@labverse.ai` / `Admin@12345`
- **Student:** `student@labverse.ai` / `Student@12345`
- **Industry Partner:** `partner@labverse.ai` / `Partner@12345`

## API Summary
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/v1/labs` | GET | Public | Fetch all labs |
| `/api/v1/projects` | GET | Public | Fetch all projects |
| `/api/v1/bookings` | POST | Public | Submit visit request |
| `/api/v1/ai-guide/chat` | POST | Public | Chat with AI (RAG / Fallback) |
| `/api/v1/auth/login` | POST | Public | JWT Authentication |
| `/api/v1/admin/bookings` | GET | Admin | Fetch filtered bookings |
| `/api/v1/admin/bookings/:id/status` | PATCH | Admin | Approve/Reject bookings |

## Future Scope
- Fully functional Admin Lab & Equipment CRUD management.
- Real-time WebSocket notifications for booking updates.
- External Auth Providers (Google / GitHub).
- Vector DB (Pinecone/pgvector) integration for advanced semantic RAG search.
