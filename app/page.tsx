import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { getOptionalSessionUser } from "@/lib/auth";
import { calculateReadTime } from "@/lib/content";
import { getPosts } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/env";
import { BlogCard } from "@/components/blog/blog-card";
import { Navbar } from "@/components/layout/navbar";
import { AmbientOrbs, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SetupNotice } from "@/components/system/setup-notice";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Promise<{
    page?: string;
    query?: string;
    error?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const page = Math.max(1, Number(params.page ?? "1"));
  const query = params.query?.trim() ?? "";
  const user = await getOptionalSessionUser();
  const isConfigured = hasSupabaseEnv();

  const { posts, total } = isConfigured
    ? await getPosts({ query, page, pageSize: PAGE_SIZE })
    : { posts: [], total: 0 };
  const featuredPost = posts[0] ?? null;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ee_0%,#f4f7fb_36%,#f6f4ee_100%)] text-slate-950">
      <Navbar user={user} />

      <main className="paper-grid relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-20 pt-8 lg:px-8">
        <AmbientOrbs />
        {!isConfigured ? <SetupNotice /> : null}

        <section className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal className="rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.92))] p-8 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.2)] md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Built for real publishing workflows
            </div>
            <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-[3.6rem]">
              A clearer blogging app for reading, writing, and moderation.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Readers discover posts quickly, authors know exactly where to write, and admins can
              immediately see what needs attention. Every surface is organized around those jobs.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="h-12 rounded-full px-6 text-sm">
                <Link href={user ? "/dashboard" : "/auth"}>
                  {user ? "Open dashboard" : "Get started"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {featuredPost ? (
                <Button asChild variant="outline" className="h-12 rounded-full px-6 text-sm">
                  <Link href={`/blog/${featuredPost.slug}`}>Read featured article</Link>
                </Button>
              ) : null}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["Read", "Browse posts, search topics, and comment without confusion."],
                ["Write", "Create or edit posts with one clear publishing flow."],
                ["Moderate", "See comments and editorial tasks in one place."],
              ].map(([value, label]) => (
                <div key={value} className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <p className="text-lg font-semibold tracking-tight text-slate-950">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#172033,#24324b)] p-8 text-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
              How The Product Works
            </p>
             <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
               The UI changes meaningfully for each role
             </h2>
            <div className="mt-6 space-y-3">
              {[
                {
                  icon: Users,
                  title: "Viewer",
                  text: "Reads posts, sees summaries, signs in to comment.",
                },
                {
                  icon: Sparkles,
                  title: "Author",
                  text: "Gets a writing dashboard with post creation and owned content editing.",
                },
                {
                  icon: ShieldCheck,
                  title: "Admin",
                  text: "Sees the full editorial queue, all posts, and comment monitoring.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-300">
              Search, summaries, comments, and dashboards are labeled by outcome rather than by technical feature.
            </div>
          </Reveal>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Featured Article
            </p>
            {featuredPost ? (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{featuredPost.authorName}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{calculateReadTime(featuredPost.body)}</span>
                </div>
               <Link
                   href={`/blog/${featuredPost.slug}`}
                   className="block text-2xl font-semibold tracking-tight text-slate-950 hover:text-blue-700 sm:text-3xl"
                 >
                   {featuredPost.title}
                 </Link>
                <p className="max-w-3xl text-base leading-7 text-slate-600">
                  {featuredPost.summary}
                </p>
                <Button asChild variant="outline" className="h-11 rounded-full px-5 text-sm">
                  <Link href={`/blog/${featuredPost.slug}`}>Read article</Link>
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Your featured article will appear here once posts are published.
              </p>
            )}
          </Reveal>

          <Reveal
            delay={0.08}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.16)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              What Readers See
            </p>
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                <Search className="h-4 w-4" />
                Search posts, authors, or topics
              </div>
              <div className="mt-4 space-y-3">
                {posts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{post.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{post.authorName}</p>
                    </div>
                    <div className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                      {calculateReadTime(post.body)}
                    </div>
                  </div>
                ))}
                {posts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Publish your first post to populate the live feed.
                  </div>
                ) : null}
              </div>
            </div>
          </Reveal>
        </section>

        <Reveal delay={0.12} className="space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Latest Posts
              </p>
               <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                 Browse recent writing
               </h2>
            </div>

            <form className="flex w-full max-w-xl items-center gap-3 rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.14)]">
              <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  name="query"
                  defaultValue={query}
                  placeholder="Search posts by title or body"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              <Button type="submit" className="h-12 rounded-2xl px-5">
                Search
              </Button>
            </form>
          </div>

          {params.error ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {params.error}
            </div>
          ) : null}

          {posts.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/70 p-12 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.16)]">
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                {query ? "No posts matched your search" : "No posts published yet"}
              </p>
              <p className="mt-3 text-base leading-7 text-slate-500">
                {query
                  ? "Try a broader search term to explore the available content library."
                  : "Sign in as an author to publish the first post and trigger the AI summary workflow."}
              </p>
            </div>
          ) : (
            <Stagger className="grid gap-6 lg:grid-cols-3">
              {posts.map((post, index) => (
                <StaggerItem key={post.id}>
                  <BlogCard
                    post={post}
                    priority={index === 0 && currentPage === 1}
                    index={index}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.14)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {posts.length} of {total} posts
            </p>
            <div className="flex items-center gap-2">
              <PaginationLink
                page={Math.max(1, currentPage - 1)}
                query={query}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <PaginationLink
                  key={pageNumber}
                  page={pageNumber}
                  query={query}
                  active={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              ))}
              <PaginationLink
                page={Math.min(totalPages, currentPage + 1)}
                query={query}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

function PaginationLink({
  page,
  query,
  children,
  active = false,
  disabled = false,
}: {
  page: number;
  query: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  const href = query ? `/?page=${page}&query=${encodeURIComponent(query)}` : `/?page=${page}`;

  if (disabled) {
    return (
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-300">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`flex h-11 min-w-11 items-center justify-center rounded-2xl border px-4 text-sm font-medium transition ${
        active
          ? "border-blue-700 bg-blue-700 text-white shadow-[0_18px_40px_-24px_rgba(29,78,216,0.45)]"
          : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
      }`}
    >
      {children}
    </Link>
  );
}
