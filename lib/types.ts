export type UserRole = "viewer" | "author" | "admin";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: UserRole;
        };
        Update: {
          name?: string;
          email?: string;
          role?: UserRole;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          body: string;
          image_url: string;
          author_id: string;
          summary: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          body: string;
          image_url: string;
          author_id: string;
          summary: string;
        };
        Update: {
          title?: string;
          slug?: string;
          body?: string;
          image_url?: string;
          summary?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          comment_text: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          comment_text: string;
        };
        Update: {
          comment_text?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type PostListItem = {
  id: string;
  slug: string;
  title: string;
  body: string;
  imageUrl: string;
  summary: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  commentCount: number;
};

export type PostDetail = PostListItem & {
  comments: {
    id: string;
    authorName: string;
    authorRole: UserRole;
    content: string;
    createdAt: string;
  }[];
};

export type DashboardData = {
  posts: PostListItem[];
  comments: {
    id: string;
    postId: string;
    postTitle: string;
    authorName: string;
    authorRole: UserRole;
    content: string;
    createdAt: string;
  }[];
};
