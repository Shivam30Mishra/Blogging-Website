"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";

import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          initial={{ opacity: 0, y }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
          className={className}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.06,
              },
            },
          }}
          className={className}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={className}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

export function AmbientOrbs({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion="user">
          <m.div
        animate={{ x: [0, 18, -10, 0], y: [0, -20, 12, 0], scale: [1, 1.04, 0.98, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_65%)] blur-2xl"
          />
          <m.div
        animate={{ x: [0, -20, 14, 0], y: [0, 16, -14, 0], scale: [1, 0.96, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-7rem] right-[-4rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.18),transparent_65%)] blur-2xl"
          />
          <m.div
        animate={{ x: [0, 8, -16, 0], y: [0, 18, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[28%] top-[10%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12),transparent_68%)] blur-2xl"
          />
        </MotionConfig>
      </LazyMotion>
    </div>
  );
}
