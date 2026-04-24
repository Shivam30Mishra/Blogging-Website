"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireSessionUser } from "@/lib/auth";
import { generateSummary } from "@/lib/ai";
import { slugify } from "@/lib/content";
import { hasGeminiEnv, hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["viewer", "author"]),
});

const postSchema = z.object({
  title: z.string().min(8).max(180),
  imageUrl: z.string().url(),
  body: z.string().min(120),
});

const commentSchema = z.object({
  postId: z.string().uuid(),
  slug: z.string().min(1),
  comment: z.string().min(3).max(1000),
});

export async function signInAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/auth?error=Add Supabase environment variables before signing in.");
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/auth?error=Please enter a valid email and password.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect(`/auth?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/auth?error=Add Supabase environment variables before creating an account.");
  }

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/auth?error=Please complete every sign up field correctly.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        role: parsed.data.role,
      },
    },
  });

  if (error) {
    redirect(`/auth?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}

async function createUniqueSlug(title: string, excludeId?: string) {
  const supabase = await createClient();
  const baseSlug = slugify(title);
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug")
    .ilike("slug", `${baseSlug}%`);

  if (error) {
    throw new Error(error.message);
  }

  const existingRecords = ((data ?? []) as { id: string; slug: string }[]);
  const existing = existingRecords
    .filter((post) => post.id !== excludeId)
    .map((post) => post.slug);
  if (!existing.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  while (existing.includes(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}

export async function createPostAction(formData: FormData) {
  const user = await requireSessionUser();
  if (user.role === "viewer") {
    redirect("/?error=Only authors and admins can create posts.");
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    imageUrl: formData.get("imageUrl"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    redirect("/dashboard?error=Please fill in a title, valid image URL, and body content.");
  }

  if (!hasGeminiEnv()) {
    redirect("/dashboard?error=Add GEMINI_API_KEY before generating AI summaries.");
  }

  const supabase = await createClient();
  const slug = await createUniqueSlug(parsed.data.title);
  const summary = await generateSummary({
    title: parsed.data.title,
    body: parsed.data.body,
  });

  const { error } = await supabase.from("posts").insert({
    title: parsed.data.title,
    slug,
    body: parsed.data.body,
    image_url: parsed.data.imageUrl,
    author_id: user.id,
    summary,
  });

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect(`/blog/${slug}`);
}

export async function updatePostAction(formData: FormData) {
  const user = await requireSessionUser();
  if (user.role === "viewer") {
    redirect("/?error=Only authors and admins can edit posts.");
  }

  const postId = z.string().uuid().parse(formData.get("postId"));
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    imageUrl: formData.get("imageUrl"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    redirect(`/dashboard?edit=${postId}&error=Please provide valid post values.`);
  }

  if (!hasGeminiEnv()) {
    redirect(`/dashboard?edit=${postId}&error=Add GEMINI_API_KEY before regenerating summaries.`);
  }

  const supabase = await createClient();
  const { data: currentPost, error: currentError } = await supabase
    .from("posts")
    .select("id, author_id, slug")
    .eq("id", postId)
    .single();

  if (currentError || !currentPost) {
    redirect("/dashboard?error=The selected post could not be found.");
  }

  if (user.role !== "admin" && currentPost.author_id !== user.id) {
    redirect("/dashboard?error=You can only edit your own posts.");
  }

  const slug = await createUniqueSlug(parsed.data.title, postId);
  const summary = await generateSummary({
    title: parsed.data.title,
    body: parsed.data.body,
  });

  const { error } = await supabase
    .from("posts")
    .update({
      title: parsed.data.title,
      slug,
      body: parsed.data.body,
      image_url: parsed.data.imageUrl,
      summary,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) {
    redirect(`/dashboard?edit=${postId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/blog/${currentPost.slug}`);
  revalidatePath(`/blog/${slug}`);
  redirect(`/blog/${slug}`);
}

export async function addCommentAction(formData: FormData) {
  const user = await requireSessionUser();
  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    slug: formData.get("slug"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    redirect(`/blog/${formData.get("slug")}?error=Write a longer comment before posting.`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    post_id: parsed.data.postId,
    user_id: user.id,
    comment_text: parsed.data.comment,
  });

  if (error) {
    redirect(`/blog/${parsed.data.slug}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect(`/blog/${parsed.data.slug}`);
}
