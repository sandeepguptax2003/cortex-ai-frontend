"use client";

import { cn } from "@/lib/utils";

interface CortexLoaderProps {
  className?: string;
  /** "page" = full-screen overlay, "inline" = centered in parent */
  variant?: "page" | "inline";
  text?: string;
}

export function CortexLoader({
  className,
  variant = "page",
  text = "Loading...",
}: CortexLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        variant === "page" &&
          "fixed inset-0 z-50 bg-white dark:bg-slate-900",
        variant === "inline" && "w-full h-full min-h-[200px]",
        className
      )}
    >
      {/* Animated logo stack */}
      <div className="relative flex items-center justify-center">
        {/* Pulse rings */}
        <span className="absolute w-24 h-24 rounded-full bg-violet-500/10 animate-ping [animation-duration:1.4s]" />
        <span className="absolute w-16 h-16 rounded-full bg-violet-500/15 animate-ping [animation-duration:1.0s] [animation-delay:0.2s]" />

        {/* Rotating arc */}
        <svg
          className="absolute w-20 h-20 animate-spin [animation-duration:1.2s]"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="url(#arcGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="80 145"
          />
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Logo square */}
        <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #0ea5e9)" }}>
          <span className="text-white font-bold text-2xl leading-none select-none">C</span>
        </div>
      </div>

      {/* Brand name + text */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent tracking-tight">
          Cortex AI
        </span>
        {text && (
          <span className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">{text}</span>
        )}
      </div>
    </div>
  );
}
