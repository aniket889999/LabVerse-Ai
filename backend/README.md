# LabVerse AI: Backend

This is the Node.js/Express backend for LabVerse AI, using Prisma ORM and PostgreSQL.

## Prerequisites
* Node.js v20+
* Docker & Docker Compose (for local database)

## Setup & Execution

### 1. Start Database
Run the provided Docker Compose file to start a local PostgreSQL instance:
```bash
cd ../infrastructure
docker-compose up -d
```
*(Note: If you do not have docker-compose, install Docker Desktop on your machine first).*

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the `DATABASE_URL` matches your local Postgres setup.

### 3. Run Migrations
Apply the Prisma schema to your local database:
```bash
npx prisma migrate dev --name init
```

### 4. Seed Data
Populate the database with MVP data (Labs, Equipment, Projects):
```bash
npm run prisma:seed
# Or: npx prisma db seed
```

### 5. Run the Server
For development (with hot-reloading):
```bash
npm run dev
```

For production build:
```bash
npm run build
npm run start
```

## Public API Endpoints
All endpoints are prefixed with `/api/v1`.

*   `GET /health` - Health check
*   `GET /labs` - List all labs
*   `GET /labs/:id` - Get specific lab details
*   `GET /projects` - List all projects (Query: `?search=term&labId=uuid`)
*   `GET /projects/:id` - Get specific project details
*   `GET /equipment` - List all equipment (Query: `?labId=uuid`)
*   `GET /equipment/:id` - Get specific equipment details

## Database Management
To view and edit database records visually:
```bash
npm run prisma:studio
```

### Bookings API
* `POST /api/v1/bookings` - Create a new booking or partnership request.
  **Request Body:**
  ```json
  {
    "requesterName": "John Doe",
    "requesterEmail": "john@example.com",
    "organizationName": "Acme Corp",
    "role": "Industry Professional",
    "requestType": "PARTNERSHIP", // PHYSICAL_VISIT | ONLINE_DEMO | PARTNERSHIP
    "preferredDate": "2026-12-01",
    "preferredTimeSlot": "Morning (9 AM - 12 PM)",
    "selectedLabId": "uuid-here",
    "purpose": "Discuss collaboration",
    "message": "We would like to test our new sensors."
  }
  ```

### Recent Changes
* **Database Migration Required:** The `Booking` model in `schema.prisma` was updated to support public, unauthenticated bookings. Because the database was not available in this environment, you MUST run `npx prisma migrate dev` locally.
* **Email Integration:** Placeholder email service added in `src/services/email.service.ts`. It logs emails to console for now. A real service (SendGrid, Resend) should be integrated later.
* **Frontend Route:** The public booking form is located at `/book-visit` in the frontend application.

### Analytics API
* `POST /api/v1/analytics/events` - Track a user interaction without blocking.
  **Example Payload:**
  ```json
  {
    "eventType": "PROJECT_VIEW",
    "pagePath": "/projects/123",
    "projectId": "123",
    "metadata": { "source": "navbar" }
  }
  ```
* `GET /api/v1/analytics/summary` - Aggregate total counts for the `/insights` page.

### Recent Changes
* **Database Migration Required:** The `AnalyticsEvent` enum was updated with tour and booking tracking variants. Run `npx prisma migrate dev` locally to sync.
* **Frontend Analytics Client:** Safe, non-blocking `trackEvent` added to `frontend/src/lib/analytics.ts`. If the database is down, events silently fail in production and warn in development.

## Troubleshooting Docker & Prisma Locally (macOS)

If you encounter the **`P1001: Can't reach database server at localhost:5432`** error, it means the PostgreSQL container is not running or Docker is not installed.

### 1. Install & Start Docker
* Download **Docker Desktop for Mac** from docker.com if you haven't already.
* Open the **Docker** application from your Applications folder.
* Verify it is running by executing: `docker ps`

### 2. Start the Database
* Navigate to the infrastructure folder: `cd ../infrastructure`
* Start the containers: `docker-compose up -d`
* Ensure the database is running: `docker ps` (You should see `labverse-postgres` on port 5432).

### 3. Run Prisma Commands
* Navigate back to the backend: `cd ../backend`
* Generate Prisma Client: `npm run prisma:generate`
* Run Migrations: `npm run prisma:migrate`
* Seed the Database: `npm run prisma:seed`
* View the Database UI: `npm run prisma:studio`

## AI Guide & Fallback Retrieval

The platform features an AI Guide capable of understanding the context of labs, equipment, and projects.

### Setup (Optional)
To enable the LLM feature:
1. Obtain a Gemini API key.
2. Add `GEMINI_API_KEY=your_key` to `backend/.env`.
3. Restart the backend.

### Safe Fallback Mode
If `GEMINI_API_KEY` is not provided, the API endpoint (`POST /api/v1/ai-guide/chat`) will gracefully fallback to "Retrieval Mode". In this mode, it performs keyword matching against the database and returns a summary of the retrieved records. This ensures the demo functions flawlessly without requiring developers to sign up for API keys.
