# Supabase Setup

## 1. Create a project

Create a new project in Supabase and wait for it to finish provisioning.

## 2. Get project keys

From `Project Settings -> API`, copy:

- `Project URL`
- `Publishable key`

## 3. Add env vars

Fill these values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
GEMINI_API_KEY=your_google_gemini_api_key
```

## 4. Run the database schema

Open the Supabase SQL editor and run:

- `supabase/schema.sql`

This creates:

- `users`
- `posts`
- `comments`
- trigger to mirror `auth.users` into `public.users`
- row level security policies

## 5. Enable auth

In `Authentication -> Providers`, enable:

- `Email`
- `Password`

## 6. Create accounts

Use the app at `/auth` to create:

- one `viewer`
- one `author`

## 7. Promote one user to admin

Run this SQL after signup:

```sql
update public.users
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## 8. Verify locally

```bash
npm run dev
```

Then test:

1. Viewer can read posts and comment.
2. Author can create a post.
3. Gemini generates and stores the summary.
4. Admin can edit any post and review comments.
