import { signInAction, signUpAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthPanel({
  error,
}: {
  error?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.16)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Sign in</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Return to your editorial workspace
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Access your role-specific dashboard, posts, and comments.
        </p>
        <form action={signInAction} className="mt-8 space-y-4">
          <Input name="email" type="email" placeholder="Email address" className="h-12 rounded-2xl px-4" />
          <Input name="password" type="password" placeholder="Password" className="h-12 rounded-2xl px-4" />
          <Button className="h-12 w-full rounded-2xl">Sign in</Button>
        </form>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#172033,#25334d)] p-8 text-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.38)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Create account</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Set up a viewer or author account
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-300">
          Viewer accounts can read and comment. Author accounts can create and edit their own posts.
        </p>
        <form action={signUpAction} className="mt-8 space-y-4">
          <Input name="name" placeholder="Full name" className="h-12 rounded-2xl border-white/10 bg-white/6 px-4 text-white placeholder:text-slate-400" />
          <Input name="email" type="email" placeholder="Email address" className="h-12 rounded-2xl border-white/10 bg-white/6 px-4 text-white placeholder:text-slate-400" />
          <Input name="password" type="password" placeholder="Password" className="h-12 rounded-2xl border-white/10 bg-white/6 px-4 text-white placeholder:text-slate-400" />
          <select
            name="role"
            defaultValue="viewer"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none"
          >
            <option value="viewer" className="text-slate-950">Viewer</option>
            <option value="author" className="text-slate-950">Author</option>
          </select>
          <Button className="h-12 w-full rounded-2xl bg-white text-slate-950 hover:bg-slate-100">
            Create account
          </Button>
        </form>
        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </section>
    </div>
  );
}
