"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { Building2, ArrowRight, Sparkles } from "lucide-react";

/**
 * Shown when the authenticated user has no organisationId.
 * Lets them create a new org so they can use all features.
 */
export function CreateOrgFlow() {
  const [orgName, setOrgName] = useState("");
  const [domain, setDomain] = useState("");
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const createOrgMutation = useMutation({
    mutationFn: (data: { name: string; domain?: string }) =>
      api.createOrganisation(data),
    onSuccess: async () => {
      toast({
        variant: "success",
        title: "Organisation created!",
        description:
          "Your organisation is ready. Refreshing your session...",
      });
      // Re-fetch the user profile so the new organisationId is loaded
      // The user will need to log out and back in to get a new JWT with the organisationId
      await refreshUser();
      toast({
        variant: "info",
        title: "Please log out and log back in",
        description:
          "Your session needs to be refreshed to activate your new organisation. Log out and log in again.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Failed to create organisation",
        description: error.message || "Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    createOrgMutation.mutate({
      name: orgName.trim(),
      domain: domain.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Create your organisation</h1>
          <p className="text-slate-500">
            You&apos;re not part of an organisation yet. Create one to start
            using tickets, meetings, and team features.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organisation Name *</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">
                Email Domain{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. acme.com"
              />
              <p className="text-xs text-slate-400">
                Restrict invites to users with this email domain
              </p>
            </div>
            <Button
              type="submit"
              className="w-full btn-shine"
              isLoading={createOrgMutation.isPending}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Organisation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          Have an invite link? Ask your admin to share it with you.
        </p>
      </div>
    </div>
  );
}
