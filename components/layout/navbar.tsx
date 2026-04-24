"use client";

import Link from "next/link";
import { BookOpenText, Menu, PenSquare, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { signOutAction } from "@/app/actions";
import { roleLabel } from "@/lib/constants";
import type { SessionUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar({ user }: { user: SessionUser | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[rgba(248,250,252,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#172033,#1d4ed8)] text-white shadow-[0_18px_48px_-20px_rgba(29,78,216,0.6)] sm:h-11 sm:w-11">
            <Sparkles className="h-5 w-5" />
          </div>
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
            PulsePress
          </Link>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)] md:flex">
          {[
            { href: "/", label: "Read" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/auth", label: user ? "Account" : "Sign in" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-0.5 hover:text-slate-950"
            aria-label="Search posts"
            type="button"
          >
            <Search className="h-4 w-4" />
          </button>

          {user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 lg:flex">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    user.role === "admin"
                      ? "bg-emerald-500"
                      : user.role === "author"
                        ? "bg-blue-600"
                        : "bg-slate-400"
                  }`}
                />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-slate-500">{roleLabel[user.role]} mode</p>
                </div>
              </div>
              <form action={signOutAction}>
                <Button variant="outline" className="h-11 rounded-full px-4 text-sm sm:px-5">
                  Sign out
                </Button>
              </form>
              <Button asChild className="h-11 rounded-full px-4 text-sm shadow-[0_20px_44px_-26px_rgba(29,78,216,0.65)] sm:px-5">
                <Link href={user.role === "viewer" ? "/auth" : "/dashboard"}>
                  {user.role === "viewer" ? (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Viewer account</span>
                      <span className="sm:hidden">Viewer</span>
                    </>
                  ) : (
                    <>
                      <PenSquare className="mr-2 h-4 w-4" />
                      Write
                    </>
                  )}
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild className="h-11 rounded-full px-4 text-sm shadow-[0_20px_44px_-26px_rgba(29,78,216,0.65)] sm:px-5">
              <Link href="/auth">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Sign in
              </Link>
            </Button>
          )}
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "absolute left-0 right-0 top-full border-b border-white/60 bg-[rgba(248,250,252,0.98)] backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 overflow-hidden opacity-0"
        )}
      >
        <nav className="flex flex-col gap-2 px-4 py-4">
          {[
            { href: "/", label: "Read", icon: BookOpenText },
            { href: "/dashboard", label: "Dashboard", icon: PenSquare },
            ...(user ? [] : [{ href: "/auth", label: "Sign in", icon: ShieldCheck }]),
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3">
                <div
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    user.role === "admin"
                      ? "bg-emerald-500"
                      : user.role === "author"
                        ? "bg-blue-600"
                        : "bg-slate-400"
                  }`}
                />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-slate-500">{roleLabel[user.role]} mode</p>
                </div>
              </div>
              <Link
                href={user.role === "viewer" ? "/auth" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
              >
                <PenSquare className="h-4 w-4" />
                {user.role === "viewer" ? "Upgrade account" : "Write post"}
              </Link>
              <form action={signOutAction} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
