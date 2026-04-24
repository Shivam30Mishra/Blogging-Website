import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { DashboardData, PostDetail, PostListItem, SessionUser } from "@/lib/types";

type RawPostRow = {
  id: string;
  title: string;
  slug: string;
  body: string;
  image_url: string;
  summary: string;
  created_at: string;
  author_id: string;
  author: { name: string; role: PostListItem["authorRole"] } | { name: string; role: PostListItem["authorRole"] }[] | null;
  comments?: { id: string }[];
};

type RawPostDetailRow = Omit<RawPostRow, "comments"> & {
  comments?: {
    id: string;
    comment_text: string;
    created_at: string;
    user_id: string;
    commenter:
      | { name: string; role: PostDetail["comments"][number]["authorRole"] }
      | { name: string; role: PostDetail["comments"][number]["authorRole"] }[]
      | null;
  }[];
};

type RawCommentRow = {
  id: string;
  post_id: string;
  comment_text: string;
  created_at: string;
  post: { title: string } | { title: string }[] | null;
  commenter:
    | { name: string; role: DashboardData["comments"][number]["authorRole"] }
    | { name: string; role: DashboardData["comments"][number]["authorRole"] }[]
    | null;
};

type PostsQueryArgs = {
  query?: string;
  page?: number;
  pageSize?: number;
};

export async function getPosts({
  query = "",
  page = 1,
  pageSize = 6,
}: PostsQueryArgs): Promise<{ posts: PostListItem[]; total: number }> {
  if (!hasSupabaseEnv()) {
    return { posts: [], total: 0 };
  }

  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let builder = supabase
    .from("posts")
    .select(
      "id,title,slug,body,image_url,summary,created_at,author_id,author:users!posts_author_id_fkey(name,role),comments(id)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(start, end);

  if (query) {
    builder = builder.or(`title.ilike.%${query}%,body.ilike.%${query}%`);
  }

  const { data, count, error } = await builder;

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as RawPostRow[];

  return {
    posts:
      rows.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        imageUrl: post.image_url,
        summary: post.summary,
        createdAt: post.created_at,
        authorId: post.author_id,
        authorName: Array.isArray(post.author) ? post.author[0]?.name ?? "Unknown" : post.author?.name ?? "Unknown",
        authorRole: Array.isArray(post.author) ? post.author[0]?.role ?? "viewer" : post.author?.role ?? "viewer",
        commentCount: post.comments?.length ?? 0,
      })),
    total: count ?? 0,
  };
}

export async function getFeaturedPost() {
  const { posts } = await getPosts({ page: 1, pageSize: 1 });
  return posts[0] ?? null;
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id,title,slug,body,image_url,summary,created_at,author_id,author:users!posts_author_id_fkey(name,role),comments(id,comment_text,created_at,user_id,commenter:users!comments_user_id_fkey(name,role))"
    )
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  const row = data as unknown as RawPostDetailRow;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    imageUrl: row.image_url,
    summary: row.summary,
    createdAt: row.created_at,
    authorId: row.author_id,
    authorName: Array.isArray(row.author) ? row.author[0]?.name ?? "Unknown" : row.author?.name ?? "Unknown",
    authorRole: Array.isArray(row.author) ? row.author[0]?.role ?? "viewer" : row.author?.role ?? "viewer",
    commentCount: row.comments?.length ?? 0,
    comments:
      row.comments?.map((comment) => ({
        id: comment.id,
        authorName: Array.isArray(comment.commenter)
          ? comment.commenter[0]?.name ?? "Unknown"
          : comment.commenter?.name ?? "Unknown",
        authorRole: Array.isArray(comment.commenter)
          ? comment.commenter[0]?.role ?? "viewer"
          : comment.commenter?.role ?? "viewer",
        content: comment.comment_text,
        createdAt: comment.created_at,
      })) ?? [],
  };
}

export async function getDashboardData(user: SessionUser): Promise<DashboardData> {
  if (!hasSupabaseEnv()) {
    return { posts: [], comments: [] };
  }

  const supabase = await createClient();
  let postsQuery = supabase
    .from("posts")
    .select("id,title,slug,body,image_url,summary,created_at,author_id,author:users!posts_author_id_fkey(name,role),comments(id)")
    .order("created_at", { ascending: false });

  if (user.role === "author") {
    postsQuery = postsQuery.eq("author_id", user.id);
  }

  const { data: postsData, error: postsError } = await postsQuery;
  if (postsError) {
    throw new Error(postsError.message);
  }

  const postRows = (postsData ?? []) as RawPostRow[];

  const posts =
    postRows.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      body: post.body,
      imageUrl: post.image_url,
      summary: post.summary,
      createdAt: post.created_at,
      authorId: post.author_id,
      authorName: Array.isArray(post.author) ? post.author[0]?.name ?? "Unknown" : post.author?.name ?? "Unknown",
      authorRole: Array.isArray(post.author) ? post.author[0]?.role ?? "viewer" : post.author?.role ?? "viewer",
      commentCount: post.comments?.length ?? 0,
    }));

  const postIds = posts.map((post) => post.id);
  if (postIds.length === 0) {
    return { posts, comments: [] };
  }

  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select("id,post_id,comment_text,created_at,post:posts(title),commenter:users!comments_user_id_fkey(name,role)")
    .in("post_id", postIds)
    .order("created_at", { ascending: false })
    .limit(12);

  if (commentsError) {
    throw new Error(commentsError.message);
  }

  const commentRows = (commentsData ?? []) as RawCommentRow[];

  return {
    posts,
    comments:
      commentRows.map((comment) => ({
        id: comment.id,
        postId: comment.post_id,
        postTitle: Array.isArray(comment.post) ? comment.post[0]?.title ?? "Untitled post" : comment.post?.title ?? "Untitled post",
        authorName: Array.isArray(comment.commenter)
          ? comment.commenter[0]?.name ?? "Unknown"
          : comment.commenter?.name ?? "Unknown",
        authorRole: Array.isArray(comment.commenter)
          ? comment.commenter[0]?.role ?? "viewer"
          : comment.commenter?.role ?? "viewer",
        content: comment.comment_text,
        createdAt: comment.created_at,
      })),
  };
}
