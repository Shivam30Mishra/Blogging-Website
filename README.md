# PulsePress

PulsePress is a full-stack blogging platform built for the Hivon Automations internship assignment. It includes a premium SaaS-style frontend, Supabase authentication and database integration, role-based access control, searchable/paginated post listings, comments, and AI-generated summaries using the Google Gemini API.

## Features

- Role-based user system
  - `Viewer`: browse posts, read summaries, comment on posts
  - `Author`: create posts, edit their own posts, view comments on their posts
  - `Admin`: view all posts, edit any post, monitor comments
- Blog features
  - title, featured image URL, body content, comments
  - search on the listing page
  - pagination on the listing page
  - author/admin post editing
- AI workflow
  - summary generated automatically on create
  - summary regenerated on edit
  - summary stored in Supabase
  - stored summary displayed on listing cards and article pages
- Premium UI
  - responsive layout
  - motion-enhanced cards
  - polished dashboard
  - loading skeletons
  - empty states

## Tech stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- Supabase Auth
- Supabase Postgres
- Google Gemini API via `@google/genai`
- TypeScript
- Zod validation

## Project structure

```text
app/
  actions.ts
  auth/page.tsx
  blog/[slug]/page.tsx
  dashboard/page.tsx
  loading.tsx
  layout.tsx
  not-found.tsx
  page.tsx
components/
  auth/
  blog/
  dashboard/
  layout/
  system/
  ui/
lib/
  ai.ts
  auth.ts
  content.ts
  data.ts
  env.ts
  supabase/
  types.ts
supabase/
  schema.sql
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_google_gemini_api_key
```

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run the contents of `supabase/schema.sql`.
4. In Supabase Auth settings, enable Email/Password sign-in.
5. Create viewer and author accounts from the app.
6. Promote one account to admin with:

```sql
update public.users
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run lint
npm run build
npm run start
```

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add the three environment variables from `.env.local`.
4. Deploy.

### Netlify

1. Push the repository to GitHub.
2. Import the repo into Netlify as a Next.js project.
3. Add the same environment variables.
4. Deploy.

## Authentication flow

- Users sign up with email, password, name, and role (`viewer` or `author`).
- Supabase Auth creates the authenticated user.
- A database trigger copies that user into `public.users`.
- Server-side role checks gate dashboard access and post actions.
- `viewer` users stay on the public reading experience.
- `author` and `admin` users access the dashboard.

## Role-based access logic

- Public users can read posts and comments.
- Authenticated users can create comments as themselves.
- Only `author` and `admin` users can create posts.
- Authors can update only their own posts.
- Admins can update any post and monitor all comments.
- Supabase Row Level Security policies enforce this in the database.

## Post creation and AI summary flow

1. Author/Admin submits the post form.
2. Server action validates the payload with Zod.
3. Server action generates a unique slug.
4. Gemini creates a roughly 200-word summary on the server.
5. The post and generated summary are stored in Supabase.
6. The listing and article pages read the saved summary directly from the database.

## Cost optimization notes

- Summaries are generated only on create/edit, not on every page load.
- Generated summaries are stored in the `posts.summary` column.
- Listing pages reuse stored summaries instead of making repeated AI calls.
- This reduces latency, token usage, and repeated inference cost.

## AI tools used

- Codex

Why it was used:
- It accelerated UI refactoring, backend wiring, schema design, and integration work in one workflow.
- It helped translate the assignment brief into an actual working architecture quickly.

How it helped:
- planned the end-to-end structure
- implemented reusable components
- wired Supabase SSR auth
- added role-checked server actions
- integrated Gemini summary generation
- prepared SQL schema and setup documentation

## Submission checklist

Before submitting, add these:

1. GitHub repository link
2. Live deployed URL
3. Short explanation covering:
   - AI tools used
   - authentication flow
   - role-based access
   - post creation logic
   - AI summary generation flow
   - cost optimization strategy
   - one bug faced and how you fixed it
   - key architectural decisions

## Notes

- The app is fully wired for the required stack.
- To make it truly live end-to-end, you still need your real Supabase project, Gemini key, GitHub repo, and deployment target.
