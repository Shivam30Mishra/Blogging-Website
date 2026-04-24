import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#f8fafc_100%)] px-6">
      <div className="max-w-xl rounded-[32px] border border-white/80 bg-white/90 p-10 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.22)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          The page you’re looking for isn’t here
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Head back to the home page to continue browsing the blog platform.
        </p>
        <Button asChild className="mt-6 h-11 rounded-2xl px-5">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
