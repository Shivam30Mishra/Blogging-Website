import { Skeleton } from "@/components/ui/skeleton";
import { AmbientOrbs } from "@/components/motion/reveal";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ee_0%,#f4f7fb_40%,#f6f4ee_100%)] px-6 py-10">
      <div className="paper-grid relative mx-auto flex max-w-7xl flex-col gap-8">
        <AmbientOrbs />
        <Skeleton className="h-16 rounded-[28px]" />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Skeleton className="h-[360px] rounded-[36px]" />
          <Skeleton className="h-[360px] rounded-[36px]" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[520px] rounded-[32px]" />
          <Skeleton className="h-[520px] rounded-[32px]" />
          <Skeleton className="h-[520px] rounded-[32px]" />
        </div>
      </div>
    </div>
  );
}
