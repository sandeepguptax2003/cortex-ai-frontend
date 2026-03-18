"use client";

import { cn } from "@/lib/utils";

interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}

export function GlowEffect({
  children,
  color = "rgba(124, 58, 237, 0.5)",
  intensity = 20,
  className,
}: GlowEffectProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        filter: `drop-shadow(0 0 ${intensity}px ${color})`,
        transition: "filter 300ms ease",
      }}
    >
      {children}
    </div>
  );
}
