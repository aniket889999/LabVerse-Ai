# Resume Points: LabVerse AI

**Title:** LabVerse AI – Intelligent Digital Twin & Lab Ecosystem Platform

**Summary:** 
A full-stack, AI-integrated digital platform bridging the gap between university laboratories and industry partners. Features interactive lab exploration, a student project repository, automated booking workflows, and an intelligent RAG-powered virtual guide.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma ORM, JWT, Zod.

## Strong Resume Bullets
* **Architected a decoupled full-stack application** using Next.js for the client and an Express/Node.js REST API, achieving rapid SSR performance and a clean separation of concerns.
* **Engineered a resilient AI Virtual Guide** implementing a Retrieval-Augmented Generation (RAG) architecture with a custom safe-fallback mechanism that queries PostgreSQL directly to ensure 100% uptime during LLM service outages.
* **Developed a secure Role-Based Access Control (RBAC) system** using `httpOnly` JWT cookies and Express middleware, securing Faculty Admin dashboards and dynamic API routes against unauthorized access.
* **Built an analytics and booking engine** enabling public users to submit visit requests while providing admins with a real-time dashboard to approve/reject requests and monitor platform engagement metrics.

## The STAR Method Explanation (For Interviews)
* **Situation:** University labs and student projects had low visibility, making it difficult for industry partners to discover capabilities and collaborate. Visit requests were handled manually via email.
* **Task:** Build a centralized, secure digital platform where users could explore labs, view equipment, request visits, and ask an AI assistant questions without requiring manual staff intervention.
* **Action:** I designed the schema using Prisma and Postgres, built a Next.js frontend, and an Express backend. I implemented JWT auth to protect admin routes. For the AI, I built a RAG system that pulls lab data into the context, but explicitly added a fallback retrieval mode to prevent crashes if the API key was missing.
* **Result:** Delivered a complete MVP with zero unhandled API errors, a fully functioning admin workflow, and a premium SaaS-style UI that successfully demonstrates both backend complexity and frontend polish.

## Potential Interview Q&A
**Q: Why use Express for the backend instead of Next.js API routes?**
*A: To decouple the client and server. By keeping the Express backend separate, the API can easily be scaled independently, consumed by mobile apps in the future, and avoids serverless cold-start limits for long-running AI tasks.*

**Q: How does your auth system work?**
*A: I avoided third-party auth to show core backend skills. I used `bcryptjs` for hashing passwords in Postgres and `jsonwebtoken` for sessions. Crucially, tokens are stored in `httpOnly` cookies, protecting against XSS attacks, while CORS `credentials: true` ensures safe cross-origin requests.*

**Q: Explain the AI Fallback mechanism.**
*A: If the Gemini API key is missing or the external service fails, the backend catches the error and switches to `FALLBACK_RETRIEVAL` mode. It searches the database using keywords, synthesizes the top matching records, and returns them directly to the user. This guarantees the feature never "breaks" during a demo.*
