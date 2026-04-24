import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { SessionUser, UserRole } from "@/lib/types";

export async function getOptionalSessionUser(): Promise<SessionUser | null> {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.id || !authUser.email) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, role")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
  };
}

export async function requireSessionUser() {
  const user = await getOptionalSessionUser();

  if (!user) {
    redirect("/auth");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireSessionUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }

  return user;
}
