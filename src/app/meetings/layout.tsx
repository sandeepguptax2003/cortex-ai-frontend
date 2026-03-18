"use client";
import ProtectedLayout from "@/components/shared/ProtectedLayout";
export default function MeetingsRouteLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
