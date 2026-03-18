"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 100,
  className,
}: StaggerContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <div
            key={index}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) ${index * staggerDelay}ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1) ${index * staggerDelay}ms`,
            }}
          >
            {child}
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
}
