"use client";

import Link from "next/link";
import { LayoutDashboard, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

import { dashboardSections, roleLabel } from "@/lib/constants";
import type { SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Sidebar({
  activeSection = "create",
  user,
}: {
  activeSection?: string;
  user: SessionUser;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col justify-between rounded-[32px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.22)] transition-all duration-300",
        collapsed ? "lg:max-w-[80px] lg:p-3" : "lg:max-w-[280px]"
      )}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-300">Workspace</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Editorial Console</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Everything you need for your role is grouped here and labeled by task.
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-2">
          {dashboardSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.id}
                href={`/dashboard?section=${section.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                  collapsed ? "justify-center px-2" : "",
                  section.id === activeSection
                    ? "bg-blue-700 text-white shadow-[0_18px_40px_-22px_rgba(29,78,216,0.55)]"
                    : "text-slate-600 hover:bg-white hover:text-slate-950"
                )}
                title={collapsed ? section.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <div>
                    <p className="text-sm font-medium">{section.label}</p>
                    <p
                      className={cn(
                        "text-xs",
                        section.id === activeSection ? "text-blue-100" : "text-slate-400"
                      )}
                    >
                      {section.helper}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {!collapsed && (
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5">
          <p className="text-sm font-medium text-slate-950">{user.name}</p>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Signed in as <span className="font-medium text-slate-950">{roleLabel[user.role]}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {user.role === "admin"
              ? "You can edit all posts and review every comment."
              : "You can create posts, edit your own posts, and review comments on them."}
          </p>
        </div>
      )}
    </aside>
  );
}
