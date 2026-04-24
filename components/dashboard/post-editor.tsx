import { LoaderCircle, Sparkles, WandSparkles } from "lucide-react";

import { createPostAction, updatePostAction } from "@/app/actions";
import { createExcerpt } from "@/lib/content";
import type { PostListItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PostEditor({
  editingPost,
}: {
  editingPost: PostListItem | null;
}) {
  const action = editingPost ? updatePostAction : createPostAction;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
      <section className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.14)] md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {editingPost ? "Edit Post" : "Create Post"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {editingPost ? "Update content and refresh the AI summary" : "Write and publish a new article"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {editingPost
                ? "Change the article, then save to regenerate the stored summary."
                : "Fill in the article details below. Publishing will generate and store a summary automatically."}
            </p>
          </div>
        </div>

        <form action={action} className="space-y-4">
          {editingPost ? <input type="hidden" name="postId" value={editingPost.id} /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="title"
              className="h-12 rounded-2xl px-4"
              placeholder="Post title"
              defaultValue={editingPost?.title}
            />
            <Input
              name="imageUrl"
              className="h-12 rounded-2xl px-4"
              placeholder="Featured image URL"
              defaultValue={editingPost?.imageUrl}
            />
          </div>
          <textarea
            name="body"
            className="min-h-[260px] w-full rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white"
            placeholder="Write the full article body here..."
            defaultValue={editingPost?.body}
          />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Write the title and body"],
              ["2", "Save to generate the AI summary"],
              ["3", "See the post on the public blog"],
            ].map(([step, label]) => (
              <div key={step} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-blue-700">Step {step}</p>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="h-12 rounded-2xl px-5">
              <Sparkles className="mr-2 h-4 w-4" />
              {editingPost ? "Save changes" : "Publish post"}
            </Button>
          </div>
        </form>
      </section>

      <div className="space-y-6">
        <section className="rounded-[32px] border border-blue-100 bg-[linear-gradient(180deg,rgba(239,246,255,0.96),rgba(255,255,255,0.95))] p-6 shadow-[0_24px_70px_-40px_rgba(29,78,216,0.14)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                AI Summary
              </p>
              <h3 className="text-xl font-semibold text-slate-950">
                Generated automatically when you save
              </h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 rounded-full bg-blue-100" />
            <div className="h-4 w-11/12 rounded-full bg-blue-100" />
            <div className="h-4 w-4/5 rounded-full bg-blue-100" />
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.14)]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            <WandSparkles className="h-3.5 w-3.5" />
            AI Generated Summary
          </div>
          <p className="text-sm leading-7 text-slate-700">
            {editingPost?.summary
              ? createExcerpt(editingPost.summary, 260)
              : "When an author submits a post, Gemini generates a summary on the server, the result is stored in Supabase, and the same saved summary is reused on the listing and article surfaces."}
          </p>
        </section>
      </div>
    </div>
  );
}
