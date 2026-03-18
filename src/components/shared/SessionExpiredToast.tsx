"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

function SessionExpiredToastContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const session = searchParams.get("session");
    if (session === "expired") {
      toast({
        variant: "info",
        title: "Session Expired",
        description: "Your session has expired. Please log in again to continue.",
      });
      // Remove the query param from URL without refreshing
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, toast]);

  return null;
}

export function SessionExpiredToast() {
  return (
    <Suspense fallback={null}>
      <SessionExpiredToastContent />
    </Suspense>
  );
}
