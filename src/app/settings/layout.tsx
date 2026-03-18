"use client";
import ProtectedLayout from "@/components/shared/ProtectedLayout";
export default function SettingsRouteLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
