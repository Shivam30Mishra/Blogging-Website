import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { getOptionalSessionUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AmbientOrbs, Reveal } from "@/components/motion/reveal";
import { SetupNotice } from "@/components/system/setup-notice";

export const dynamic = "force-dynamic";

type AuthPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = (await searchParams) ?? {};
  const user = await getOptionalSessionUser();

  if (user) {
    redirect(user.role === "viewer" ? "/" : "/dashboard");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ee_0%,#f4f7fb_45%,#f6f4ee_100%)]">
      <Navbar user={null} />
      <main className="paper-grid relative mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-20 pt-10 lg:px-8">
        <AmbientOrbs />
        {!hasSupabaseEnv() ? <SetupNotice /> : null}
        <Reveal>
          <AuthPanel error={params.error} />
        </Reveal>
      </main>
    </div>
  );
}
