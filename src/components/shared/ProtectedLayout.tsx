"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CreateOrgFlow } from "@/components/shared/CreateOrgFlow";

/**
 * Reusable wrapper for all private route layouts.
 * - Redirects to / if not authenticated
 * - Shows CreateOrgFlow if authenticated but has no organisation
 * - Renders children otherwise
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/?session=expired");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary, #0f172a)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "var(--accent-primary, #6366f1)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // User is authenticated but not in any org yet — show onboarding
  if (user && !user.organisationId) {
    return <CreateOrgFlow />;
  }

  return <>{children}</>;
}
