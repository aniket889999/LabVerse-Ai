# LabVerse AI: Demo Script

**Estimated Time:** 3-5 Minutes

## 1. Introduction (0:30)
* **What to say:** "Hi, I’m excited to present LabVerse AI. Universities build incredible hardware labs and logistics hubs, but students and industry partners rarely know what equipment is available or what research is happening. I built LabVerse AI to solve this. It’s a complete digital twin platform to explore, interact with, and book university laboratory experiences."
* **Action:** Open `http://localhost:3000` (Home Page). Scroll slowly to show the premium SaaS aesthetic.

## 2. Public Exploration & Booking (1:30)
* **What to say:** "Let's explore the platform as an industry partner looking to collaborate. I can browse the Lab Directory to see the physical spaces, or check the Project Repository to see actual student outcomes."
* **Action:** Click "Labs" in the Navbar. Click into a specific Lab (e.g., Warehouse & Inventory Lab). Point out the available Equipment list.
* **What to say:** "If I see equipment I want to use or sponsor, I can immediately book a physical visit."
* **Action:** Click "Book Visit" from the Navbar or Lab page. Fill out a dummy request (e.g., Jane Doe, Acme Corp, Requesting an Industry Partnership). Click Submit.

## 3. The AI Guide - RAG Architecture (1:00)
* **What to say:** "Instead of clicking through pages, users can ask our AI Guide. The AI is context-aware—it dynamically filters context based on whether you're a student, recruiter, or partner."
* **Action:** Open the `/ai-guide` page. Select "Industry Partner" from the dropdown. 
* **What to say:** "The backend uses a RAG architecture. If the LLM API is unavailable, I engineered a highly-resilient safe fallback mode that automatically triggers a database retrieval synthesis instead, ensuring the product never crashes during a demo."
* **Action:** Click one of the suggested questions. Show the generated response (either LLM or Fallback mode).

## 4. Faculty Admin Dashboard (1:00)
* **What to say:** "For the university staff, managing these requests manually is a headache. Let's log in as a Faculty Admin to see the secure backend."
* **Action:** Go to `/login`. Log in with `admin@labverse.ai` / `Admin@12345`. 
* **What to say:** "The dashboard is secured via httpOnly JWT cookies and custom Express middlewares. Here, the admin sees an analytics overview of platform engagement. Below, we see the booking request I just submitted."
* **Action:** Find the dummy booking in the table. Click "Approve". 
* **What to say:** "Notice the UI updates instantly. The backend handles the state transition, and the metric cards automatically re-aggregate."

## 5. Closing Pitch (0:30)
* **What to say:** "LabVerse AI bridges the gap between academia and industry. Built with Next.js, Express, TypeScript, and Prisma, it demonstrates clean architecture, role-based access control, and resilient AI integration. Thank you!"
