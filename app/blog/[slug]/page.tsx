import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, MessageSquare, Sparkles } from "lucide-react";

import { getOptionalSessionUser } from "@/lib/auth";
import { calculateReadTime, formatDate, imageOrGradient } from "@/lib/content";
import { getPostBySlug } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/env";
import { CommentSection } from "@/components/blog/comment-section";
import { Navbar } from "@/components/layout/navbar";
import { AmbientOrbs, Reveal } from "@/components/motion/reveal";
import { SetupNotice } from "@/components/system/setup-notice";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const user = await getOptionalSessionUser();

  if (!hasSupabaseEnv()) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ee_0%,#f4f7fb_40%,#f6f4ee_100%)]">
        <Navbar user={user} />
        <main className="mx-auto max-w-5xl px-6 pb-20 pt-10 lg:px-8">
          <SetupNotice />
        </main>
      </div>
    );
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const imageValue = imageOrGradient(post.imageUrl);
  const isRemoteImage = imageValue.startsWith("http");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ee_0%,#f4f7fb_40%,#f6f4ee_100%)]">
      <Navbar user={user} />

      <main className="paper-grid relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-20 pt-10 lg:px-8">
        <AmbientOrbs />
        <Reveal>
          <Button asChild variant="outline" className="h-11 w-fit rounded-full px-5">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
          </Button>
        </Reveal>

        {query.error ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {query.error}
          </div>
        ) : null}

        <Reveal className="overflow-hidden rounded-[32px] border border-white/80 bg-white/90 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.16)]">
           <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/8] md:aspect-[16/7]">
            {isRemoteImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageValue} alt={post.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full" style={{ background: imageValue }} />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.55))]" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
              <div className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                {post.authorName} · {post.authorRole}
              </div>
               <h1 className="mt-5 max-w-4xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                 {post.title}
               </h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <span>{formatDate(post.createdAt)}</span>
                <span className="h-1 w-1 rounded-full bg-white/70" />
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {calculateReadTime(post.body)}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/70" />
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {post.commentCount}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6 md:p-10">
            <div className="rounded-[28px] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.96),rgba(255,255,255,0.96))] p-6 shadow-[0_24px_70px_-40px_rgba(29,78,216,0.14)]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI Generated Summary
              </div>
              <p className="text-base leading-8 text-slate-700">{post.summary}</p>
            </div>

             <article className="mx-auto max-w-3xl space-y-6 break-words text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              {post.body.split(/\n\n+/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <CommentSection post={post} user={user} />
        </Reveal>
      </main>
    </div>
  );
}
