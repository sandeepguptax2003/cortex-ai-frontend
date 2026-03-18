"use client";
import ProtectedLayout from "@/components/shared/ProtectedLayout";
export default function BoardRouteLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
