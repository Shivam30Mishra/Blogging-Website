import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SetupNotice() {
  return (
    <div className="rounded-[32px] border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.96),rgba(255,255,255,0.95))] p-8 shadow-[0_24px_70px_-40px_rgba(245,158,11,0.28)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        Setup Required
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Add your Supabase and Gemini environment variables
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        The full backend is implemented, but this workspace still needs your real project keys to run
        the live auth, database, and AI summary pipeline. Add the values from `.env.example`, run the
        SQL in `supabase/schema.sql`, and the app will switch from setup mode to the working system.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="h-11 rounded-2xl px-5">
          <Link href="/auth">Open auth screen</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-2xl px-5">
          <Link href="https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs">
            Supabase setup docs
          </Link>
        </Button>
      </div>
    </div>
  );
}
