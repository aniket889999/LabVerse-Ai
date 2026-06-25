# LabVerse AI

LabVerse AI is an AI-ready digital laboratory experience connecting universities, students, and industry partners through an immersive, data-driven lab ecosystem.

## Correct Active Project Folder
The correct, active project folder containing the full stack is:
`/Users/aniket/Downloads/Labverse Ai`

*(Note: `/Users/aniket/LabVerse Ai` is empty, and duplicate folders should be ignored).*

## Prerequisites
- Node.js (v20+ recommended)
- Docker Desktop

## Local Setup & Troubleshooting

### 1. Database Start (PostgreSQL & Docker Desktop)
Before running the database, **Docker Desktop must be installed and running** on your Mac.
1. Download and install [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/).
2. Open the "Docker" app from your Applications folder (wait for the whale icon in your top menu bar to show a green background or say "Engine running").
3. Verify Docker is running by opening a new terminal and typing:
   ```bash
   docker ps
   ```
   *(It should output a table headers like `CONTAINER ID`, `IMAGE`, etc. If it says `command not found`, Docker is not installed or not in your PATH. If it says `cannot connect to the Docker daemon`, Docker Desktop is not running).*

Once Docker is verified, start the PostgreSQL container:

```bash
cd "/Users/aniket/Downloads/Labverse Ai/infrastructure"
docker compose up -d
```

### 2. Database Migration & Seeding
Once the database is running (and you verified `docker ps` shows the `postgres` container), initialize the schema and populate the demo data:

```bash
cd "/Users/aniket/Downloads/Labverse Ai/backend"
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

**View your Data:**
To view the generated and seeded data in a browser UI, run:
```bash
npm run prisma:studio
```

### 3. Start the Backend API
The backend requires the database to be running to serve data successfully.

```bash
cd "/Users/aniket/Downloads/Labverse Ai/backend"
npm run dev
```
*The backend will run on port 5000.*

### 4. Start the Frontend
The frontend consumes the API on port 5000. It handles unavailability via a custom ErrorState component.

```bash
cd "/Users/aniket/Downloads/Labverse Ai/frontend"
npm install
npm run dev
```
*The frontend will run on port 3000.*

## Troubleshooting Notes
- **Prisma Error P1001 (Can't reach database server at `localhost`:`5432`):** This explicitly means your backend cannot find a running PostgreSQL database. You must open Docker Desktop on your Mac, wait for it to start, and run `docker compose up -d` in the `/infrastructure` directory.
- **Docker command not found:** Ensure Docker Desktop is properly installed from docker.com, moved to your Applications folder, and currently open.
- **API Fetch Error (Failed to connect to backend):** This occurs when the Express backend is not running or the frontend cannot reach port 5000. Start the backend (`npm run dev` in `/backend`).
