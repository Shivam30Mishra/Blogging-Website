import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-white/60 via-slate-100 to-white/60",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
