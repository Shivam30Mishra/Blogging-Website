import Link from "next/link";
import { MessageSquareMore, PencilLine, Sparkles, TrendingUp } from "lucide-react";

import { requireRole } from "@/lib/auth";
import { createExcerpt, formatDate } from "@/lib/content";
import { getDashboardData } from "@/lib/data";
import { hasGeminiEnv, hasSupabaseEnv } from "@/lib/env";
import { Sidebar } from "@/components/dashboard/sidebar";
import { SidebarToggle } from "@/components/dashboard/sidebar-toggle";
import { PostEditor } from "@/components/dashboard/post-editor";
import { Navbar } from "@/components/layout/navbar";
import { AmbientOrbs, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SetupNotice } from "@/components/system/setup-notice";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: Promise<{
    section?: string;
    edit?: string;
    error?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) ?? {};
  const section = params.section ?? "create";
  const user = await requireRole(["author", "admin"]);

  if (!hasSupabaseEnv()) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ee_0%,#f4f7fb_34%,#f6f4ee_100%)]">
        <Navbar user={user} />
        <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-8">
          <SetupNotice />
        </main>
      </div>
    );
  }

  const dashboard = await getDashboardData(user);
  const editingPost = params.edit
    ? dashboard.posts.find((post) => post.id === params.edit) ?? null
    : null;

  const dashboardStats = [
    { label: "Published posts", value: `${dashboard.posts.length}`, detail: `${user.role} workspace` },
    {
      label: "Total comments",
      value: `${dashboard.comments.length}`,
      detail: user.role === "admin" ? "All comments monitored" : "Comments on your posts",
    },
    {
      label: "Gemini status",
      value: hasGeminiEnv() ? "Live" : "Missing key",
      detail: "Summary generation pipeline",
    },
    {
      label: "Editable scope",
      value: user.role === "admin" ? "All posts" : "Own posts",
      detail: "Role-based permissions",
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ee_0%,#f4f7fb_34%,#f6f4ee_100%)]">
      <Navbar user={user} />

      <main className="paper-grid relative mx-auto grid w-full max-w-7xl gap-6 px-4 pb-20 pt-6 sm:px-6 sm:pt-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <AmbientOrbs />
        <div className="min-w-0">
          <SidebarToggle>
            <Sidebar activeSection={section} user={user} />
          </SidebarToggle>
        </div>

        <div className="space-y-6">
          <Reveal className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#172033,#27344c)] p-8 text-white shadow-[0_24px_60px_-44px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
              Dashboard
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
               {user.role === "admin" ? "Admin publishing overview" : "Author publishing overview"}
             </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              {user.role === "admin"
                ? "Review publishing activity across the whole platform, edit any post, and monitor the discussion queue."
                : "Write new posts, update your published work, and keep up with comments from readers."}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur"
                >
                  <p className="text-sm text-blue-100">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-300">{stat.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {params.error ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {params.error}
            </div>
          ) : null}

          {!hasGeminiEnv() ? (
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
              Add `GEMINI_API_KEY` to enable automatic summary generation during post creation and editing.
            </div>
          ) : null}

          <Reveal delay={0.06}>
            <PostEditor editingPost={editingPost} />
          </Reveal>

          <section className="grid gap-6 xl:grid-cols-3">
            <Reveal className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.14)] xl:col-span-2">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Post Queue
                  </p>
                     <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                     Articles you can act on now
                   </h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                  {user.role === "admin" ? "Admin can edit any post" : "Author can edit owned posts"}
                </div>
              </div>

              <Stagger className="space-y-4">
                {dashboard.posts.map((post) => (
                  <StaggerItem key={post.id}>
                    <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-medium text-slate-950">{post.title}</p>
                        <p className="mt-2 text-sm text-slate-500">
                          {post.authorName} · {formatDate(post.createdAt)}
                        </p>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                          {createExcerpt(post.summary, 160)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/dashboard?edit=${post.id}&section=edit`}
                          className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-950"
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex h-11 items-center rounded-2xl border border-blue-100 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:-translate-y-0.5"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          View post
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
                {dashboard.posts.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-lg font-medium text-slate-900">No posts yet</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Create your first post above to populate the dashboard and trigger summary generation.
                    </p>
                  </div>
                ) : null}
              </Stagger>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.1} className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.14)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <MessageSquareMore className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Comments
                    </p>
                    <h2 className="text-xl font-semibold text-slate-950">Moderation queue</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {dashboard.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-medium text-slate-950">{comment.authorName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                        {comment.postTitle}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{comment.content}</p>
                    </div>
                  ))}
                  {dashboard.comments.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      Comments will appear here once viewers start responding to your posts.
                    </div>
                  ) : null}
                </div>
              </Reveal>

              <Reveal
                delay={0.14}
                className="rounded-[32px] border border-blue-100 bg-[linear-gradient(180deg,rgba(239,246,255,0.95),rgba(255,255,255,0.96))] p-6 shadow-[0_24px_70px_-40px_rgba(29,78,216,0.14)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Workspace Signals
                    </p>
                    <h2 className="text-xl font-semibold text-slate-950">What this role can see</h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    [`${dashboard.posts.length}`, "Posts in scope"],
                    [`${dashboard.comments.length}`, "Visible comments"],
                    [hasGeminiEnv() ? "On" : "Off", "AI summary engine"],
                    [user.role === "admin" ? "Global" : "Personal", "Editing access"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-[24px] border border-blue-100 bg-white/80 p-4">
                      <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
                      <p className="mt-2 text-sm text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
