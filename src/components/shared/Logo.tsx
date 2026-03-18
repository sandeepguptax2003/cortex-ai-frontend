"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light" | "dark";
  href?: string;
}

export function Logo({
  className,
  size = "md",
  variant = "default",
  href = "/",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const textColors = {
    default: "text-slate-900 dark:text-white",
    light: "text-white",
    dark: "text-slate-900",
  };

  const LogoSVG = () => (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={sizeClasses[size]}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        width="40"
        height="40"
        rx="10"
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        C
      </text>
    </svg>
  );

  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoSVG />
      <span
        className={cn(
          "font-bold tracking-tight",
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl",
          textColors[variant]
        )}
      >
        Cortex AI
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
