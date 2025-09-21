# SkillPilot – AI-Powered Training & Upskilling (MVP)

SkillPilot is a Next.js 15 + shadcn/ui prototype that helps users assess skills, identify gaps, and follow adaptive learning paths. This MVP uses mock authentication and a mock AI engine to simulate the end-to-end product experience so you can iterate quickly and later swap in real backend services.

## Quick start

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Open: http://localhost:3000

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4 (globals configured with design tokens)
- shadcn/ui component primitives
- Recharts (analytics visualizations)
- Local storage for mock auth and persistence

## Architecture overview

High-level structure:
- App Router pages under `src/app`
  - Server Components for layout/shell
  - Client Components for interactive pages
- Reusable UI in `src/components/ui` (shadcn)
- Feature components in `src/components`
- Mock domain logic in `src/lib/mockEngine.ts`

Key modules and responsibilities:
- src/app/page.tsx (Home)
  - Public landing with hero, feature cards, and a simple sign-in form
  - Mock auth writes `mockUser` to localStorage, then navigates to `/dashboard`
- src/app/dashboard/page.tsx (Dashboard)
  - Profile editor (name, email, role, years experience)
  - Resume upload + mock parsing via `mockEngine.parseResume`
  - Manage skills and levels; persist to localStorage
- src/app/recommendations/page.tsx (Recommendations)
  - Computes skill gaps vs. target role using `mockEngine.getSkillGaps`
  - Shows recommended courses and an adaptive learning path (`mockEngine.getLearningPath`)
- src/app/analytics/page.tsx (Analytics)
  - Renders market trends and learning progress with Recharts
  - Data sourced from `mockEngine.getMarketTrends` and local profile
- src/lib/mockEngine.ts (Mock AI Engine)
  - Pure functions to simulate: resume parsing, gap analysis, recommendations, learning path generation, and market trends
- src/components/NavBar.tsx (Optional)
  - Simple top navigation (can be mounted in layout or pages)

Data flow:
- UI reads/writes user profile to localStorage
- Pages call `mockEngine` functions with profile data
- Charts and UI derive visualizations from computed results

Component model:
- Pages requiring interactivity declare "use client"
- Non-interactive layout remains server-side
- Styling exclusively via Tailwind utility classes (no styled-jsx)

## Project structure

```
src/
  app/
    page.tsx                 # Home (mock sign-in)
    dashboard/page.tsx       # Profile, resume parsing, skills
    recommendations/page.tsx # Skill gaps, courses, learning path
    analytics/page.tsx       # Trends + progress charts
  components/
    NavBar.tsx               # Optional navigation
    ui/                      # shadcn primitives
  lib/
    mockEngine.ts            # Mock AI/data functions
```

## Roadmap mapping (Your 16-week plan → this MVP → next steps)

Phase 1: Planning & Research (Week 1)
- Status in MVP: Information architecture defined; UI routes and data flow established.
- Next: Finalize data contracts for profiles, skills, jobs, courses.

Phase 2: MVP Backend & Data Pipeline (Weeks 2-4)
- Your plan: Flask backend + PostgreSQL, resume parsing (HF/BERT), job scraping.
- MVP state: Client-only mock engine and localStorage persistence.
- Next steps:
  1) Stand up Flask + Postgres. Define tables for users, profiles, skills, jobs, courses, enrollments (integer IDs).
  2) Replace `mockEngine.parseResume` with server NLP endpoint (spaCy/transformers) and store parsed entities.
  3) Add ingestion workers for job feeds and course catalogs.

Phase 3: Recommendation Engine (Weeks 5-7)
- Your plan: Collaborative + content-based filtering, trending skills, cold-start handling.
- MVP state: Deterministic mock recommendations.
- Next steps:
  1) Implement content-based features: TF-IDF/embeddings for skills, roles, courses.
  2) Add collaborative signals from user interactions (views, enrolls, completes).
  3) Compute trending skills from job data + time-decay scoring.
  4) Provide API routes consumed by `/recommendations` page.

Phase 4: Adaptive Learning Path Engine (Weeks 8-9)
- Your plan: Dynamic paths with progress tracking.
- MVP state: Static mock path with completion toggles.
- Next steps:
  1) Server-side path planner that re-scores steps based on progress and assessments.
  2) Track progress events; emit path modifications.
  3) Expose path state via API for real-time updates.

Phase 5: Frontend & Dashboards (Weeks 10-12)
- Your plan: React frontend + Chart.js.
- MVP state: Next.js 15 + shadcn/ui, Recharts for analytics.
- Next steps:
  1) Replace localStorage with authenticated API calls.
  2) Expand analytics: cohort progress, skill distribution, job-market trends.

Phase 6: Integration & Testing (Weeks 13-14)
- Your plan: Connect FE/BE, e2e tests.
- MVP state: FE mocks wired; ready for API swap.
- Next steps:
  1) Create API routes in Next.js or connect to Flask endpoints.
  2) Add Playwright e2e and Vitest unit tests.
  3) Seed realistic data and run end-to-end flows.

Phase 7: Deployment & Feedback (Weeks 15-16)
- Your plan: Docker, Heroku/Railway, feedback loop.
- Next steps:
  1) Containerize FE/BE; configure environment variables.
  2) Set up staging + production.
  3) Add product analytics and user feedback capture.

## How to replace mocks with real services

Auth
- Swap mock localStorage auth with a real provider (e.g., better-auth/Auth.js).
- Gate `/dashboard`, `/recommendations`, `/analytics` behind session checks.

Data & APIs
- Introduce a database (PostgreSQL) and REST/GraphQL APIs.
- Replace local reads/writes with fetch calls. Keep the UI contracts the same for minimal refactor.

NLP & Recommendations
- Implement Flask services for parsing and recommendation.
- Gradually route `mockEngine` calls to server endpoints; delete mocks when complete.

Analytics
- Persist progress/usage events; compute aggregates server-side.
- Migrate Recharts inputs to real metrics.

## Development notes

- Never use styled-jsx; use Tailwind only.
- Keep pages as Server Components unless interactivity is required (then add "use client").
- Prefer small, composable components in `src/components`.
- When adding APIs or database logic, keep types in sync and add loading/error states in the UI.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – lint code

## License

MIT