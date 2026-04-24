"use client";

import { memo } from "react";
import Link from "next/link";
import { LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";
import { ArrowUpRight, MessageSquare, Sparkles } from "lucide-react";

import { calculateReadTime, createExcerpt, formatDate, imageOrGradient } from "@/lib/content";
import type { PostListItem } from "@/lib/types";

type BlogCardProps = {
  post: PostListItem;
  priority?: boolean;
  index?: number;
};

function BlogCardComponent({ post, priority = false, index = 0 }: BlogCardProps) {
  const imageValue = imageOrGradient(post.imageUrl, index);
  const isRemoteImage = imageValue.startsWith("http");

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-36px_rgba(15,23,42,0.24)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200/70">
             {isRemoteImage ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={imageValue} alt={post.title} className="h-full w-full object-cover" suppressHydrationWarning={true} />
             ) : (
               <div className="h-full w-full" style={{ background: imageValue }} />
             )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.28))]" />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
              {post.authorRole === "admin" ? "Edited by admin" : "By author"}
            </div>
            {priority ? (
              <div className="absolute bottom-5 left-5 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
                Featured story
              </div>
            ) : null}
          </div>

          <div className="space-y-5 p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>{formatDate(post.createdAt)}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{calculateReadTime(post.body)}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{post.commentCount} comments</span>
              </div>

              <div className="space-y-3">
               <Link
                   href={`/blog/${post.slug}`}
                   className="block text-xl leading-8 font-semibold tracking-tight text-slate-950 transition group-hover:text-blue-700 sm:text-[1.65rem] sm:leading-9"
                 >
                   {post.title}
                 </Link>
                <p className="text-[15px] leading-7 text-slate-600">{createExcerpt(post.body, 150)}</p>
              </div>

              <div className="rounded-[20px] border border-blue-100 bg-blue-50/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generated Summary
                </div>
                <p className="text-sm leading-6 text-slate-700">{createExcerpt(post.summary, 210)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{post.authorName}</p>
                <p className="text-sm capitalize text-slate-500">{post.authorRole}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {post.commentCount}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 font-medium text-slate-900 transition group-hover:text-blue-700"
                >
                  Read article
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </m.article>
      </MotionConfig>
    </LazyMotion>
  );
}

export const BlogCard = memo(BlogCardComponent);
