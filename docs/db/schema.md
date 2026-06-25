# LabVerse AI: Database Design & Schema

This document details the relational database schema (PostgreSQL) for LabVerse AI. We will use Prisma as the ORM.

## Entity Relationship Diagram (Conceptual)

```mermaid
erDiagram
    USER ||--o{ LAB : manages
    USER ||--o{ PROJECT : authors
    USER ||--o{ VISIT_BOOKING : makes
    LAB ||--o{ PROJECT : contains
    LAB ||--o{ VISIT_BOOKING : receives
    LAB ||--o{ TOUR : has

    USER {
        uuid id PK
        string email
        string password_hash
        enum role "VISITOR, STUDENT, FACULTY, INDUSTRY"
        json profile_data
        datetime created_at
    }

    LAB {
        uuid id PK
        string name
        text description
        uuid faculty_admin_id FK
        string location
        int capacity
        enum status "ACTIVE, MAINTENANCE"
        datetime created_at
    }

    PROJECT {
        uuid id PK
        uuid lab_id FK
        string title
        text description
        string repository_url
        uuid author_id FK
        datetime created_at
    }

    VISIT_BOOKING {
        uuid id PK
        uuid user_id FK
        uuid lab_id FK
        datetime requested_date
        enum status "PENDING, APPROVED, REJECTED"
        text purpose
        datetime created_at
    }

    TOUR {
        uuid id PK
        uuid lab_id FK
        string title
        string media_url
        int duration_minutes
    }

    ANALYTICS_EVENT {
        uuid id PK
        string event_type
        uuid user_id FK "nullable"
        json metadata
        datetime timestamp
    }
```

## Indexes & Performance Considerations

1.  **Users:** Unique index on `email`. Index on `role` for fast filtering.
2.  **Labs:** Index on `faculty_admin_id`.
3.  **Projects:** Index on `lab_id` and `author_id`.
4.  **VisitBookings:** Composite index on `(lab_id, requested_date)` to quickly check schedule conflicts.
5.  **Analytics:** Index on `timestamp` and `event_type` for time-series aggregation.

## Caching Strategy
*   Static Lab Information (Name, Description, Location) will be cached in Redis with a TTL of 1 hour to reduce database load on the public Lab Explorer.
*   Invalidation happens upon updates by the Faculty Admin.
