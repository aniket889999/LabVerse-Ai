# LabVerse AI: API Plan

The backend API follows RESTful principles, utilizing JSON payloads and JWT for authentication. All endpoints are prefixed with `/api/v1`.

## Authentication & Authorization
*   `POST /auth/register`
    *   Creates a new user. Default role: STUDENT (or VISITOR).
*   `POST /auth/login`
    *   Authenticates credentials, returns JWT.
*   `GET /auth/me`
    *   Validates JWT, returns current user profile.

## Labs Module
*   `GET /labs`
    *   Retrieves a paginated list of labs. Supports query params: `?search=term&sort=name`.
    *   **Access:** Public
*   `GET /labs/:id`
    *   Retrieves detailed lab information.
    *   **Access:** Public
*   `POST /labs`
    *   Creates a new lab.
    *   **Access:** Faculty Admin only
*   `PUT /labs/:id`
    *   Updates lab details.
    *   **Access:** Faculty Admin only

## AI Lab Guide Module
*   `POST /labs/:id/ai-guide/query`
    *   Sends a user query to the AI Lab Guide for a specific lab.
    *   **Payload:** `{ "query": "What equipment is available for nanotechnology?" }`
    *   **Access:** Authenticated (Student, Faculty, Industry)

## Project Repository Module
*   `GET /projects`
    *   Retrieves list of research projects.
    *   **Access:** Authenticated
*   `GET /projects/:id`
    *   Retrieves specific project details and repository link.
    *   **Access:** Authenticated
*   `POST /projects`
    *   Submits a new project to a lab.
    *   **Access:** Student, Faculty

## Visit Booking Module
*   `GET /bookings`
    *   Retrieves bookings. Filters based on role (Faculty sees all lab bookings, Students see their own).
    *   **Access:** Authenticated
*   `POST /bookings`
    *   Requests a new lab visit.
    *   **Access:** Student, Industry
*   `PATCH /bookings/:id/status`
    *   Updates booking status (APPROVE/REJECT).
    *   **Access:** Faculty Admin

## Analytics Module
*   `GET /analytics/dashboard`
    *   Retrieves aggregated statistics (total visits, active projects, popular labs).
    *   **Access:** Faculty Admin, Industry (anonymized view)
*   `POST /analytics/event`
    *   Logs a client-side interaction event.
    *   **Access:** Public / Authenticated
