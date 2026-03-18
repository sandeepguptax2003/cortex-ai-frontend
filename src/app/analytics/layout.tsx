"use client";
import ProtectedLayout from "@/components/shared/ProtectedLayout";
export default function AnalyticsRouteLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
