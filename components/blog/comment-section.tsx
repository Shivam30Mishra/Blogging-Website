import Link from "next/link";
import { MessageSquareMore } from "lucide-react";

import { addCommentAction } from "@/app/actions";
import { formatRelativeDate } from "@/lib/content";
import type { PostDetail, SessionUser } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function CommentSection({
  post,
  user,
}: {
  post: PostDetail;
  user: SessionUser | null;
}) {
  return (
    <section className="space-y-6 rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.14)] md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Comments
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Reader discussion
          </h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {post.comments.length} active responses
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(255,255,255,0.94))] p-5">
        <div className="mb-4 flex items-center gap-3 text-sm text-slate-600">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <MessageSquareMore className="h-4 w-4" />
          </div>
          <p>Join the conversation with thoughtful, constructive feedback.</p>
        </div>

        {user ? (
          <form action={addCommentAction} className="flex flex-col gap-3 md:flex-row">
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="slug" value={post.slug} />
            <textarea
              name="comment"
              placeholder="Share your perspective on this post..."
              className="min-h-24 flex-1 rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
            />
            <Button className="h-12 rounded-2xl px-5 self-start">Post comment</Button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white px-4 py-4">
            <p className="text-sm text-slate-600">Sign in to join the discussion.</p>
            <Button asChild className="h-11 rounded-2xl px-5">
              <Link href="/auth">Sign in</Link>
            </Button>
          </div>
        )}
      </div>

      {post.comments.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-lg font-medium text-slate-900">No comments yet</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Start the first conversation and set the tone for this discussion.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">{comment.authorName}</p>
                  <p className="text-sm capitalize text-slate-500">
                    {comment.authorRole} · {formatRelativeDate(comment.createdAt)}
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  {comment.authorRole}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{comment.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
