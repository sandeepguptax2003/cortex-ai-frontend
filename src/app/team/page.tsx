"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api/client";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  UserPlus,
  Mail,
  Crown,
  User,
  Shield,
  Loader2,
  Copy,
  Check,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function TeamPage() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [requireDomain, setRequireDomain] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, canAccessAdmin } = useAuth();

  // Fetch team members
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: () => api.getTeamMembers(),
  });

  // Fetch invites
  const { data: invitesData, isLoading: invitesLoading } = useQuery({
    queryKey: ["invites"],
    queryFn: () => api.getInvites(),
  });

  // Fetch team stats
  const { data: statsData } = useQuery({
    queryKey: ["teamStats"],
    queryFn: () => api.getTeamStats(),
  });

  const members = membersData?.data?.members || [];
  const invites = invitesData?.data?.invites || [];
  const stats = statsData?.data;

  // Create invite mutation
  const createInviteMutation = useMutation({
    mutationFn: () => api.createInvite(requireDomain),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      const inviteUrl = response?.data?.inviteUrl || response?.inviteUrl;
      if (inviteUrl) {
        setGeneratedInviteUrl(inviteUrl);
        // Auto-copy to clipboard
        navigator.clipboard.writeText(inviteUrl).catch(() => {});
        toast({
          variant: "success",
          title: "Invite link created & copied!",
          description: inviteUrl,
        });
      } else {
        toast({
          variant: "success",
          title: "Invite created",
          description: "Share the invite link with your team member.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to create invite",
      });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.updateMemberRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast({ variant: "success", title: "Role updated" });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to update role",
      });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => api.removeTeamMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast({ variant: "success", title: "Member removed" });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to remove member",
      });
    },
  });

  // Revoke invite mutation
  const revokeInviteMutation = useMutation({
    mutationFn: (token: string) => api.revokeInvite(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      toast({ variant: "success", title: "Invite revoked" });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to revoke invite",
      });
    },
  });

  const handleCopyInvite = (token: string, orgId: string) => {
    const inviteUrl = `${window.location.origin}/signup?invite=${token}&org=${orgId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    toast({ variant: "success", title: "Invite link copied" });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-purple-100 text-purple-700">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "MANAGER":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Shield className="w-3 h-3 mr-1" />
            Manager
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <User className="w-3 h-3 mr-1" />
            Member
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <FadeIn direction="down">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Team</h1>
            <p className="text-slate-500">Manage your team members and invites</p>
          </div>
          {canAccessAdmin() && (
            <Dialog open={inviteDialogOpen} onOpenChange={(open) => {
                setInviteDialogOpen(open);
                if (!open) { setGeneratedInviteUrl(null); setInviteCopied(false); }
              }}>
              <DialogTrigger asChild>
                <Button className="btn-shine">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-slate-900 dark:text-slate-100">Invite Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="requireDomain"
                        checked={requireDomain}
                        onChange={(e) => setRequireDomain(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:border-violet-600 checked:bg-violet-600 transition-colors"
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 7L6 10L11 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <Label htmlFor="requireDomain" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                      Require same email domain
                    </Label>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This will create an invite link that you can share with your
                    team member.
                  </p>
                  {/* Show the generated invite link after creation */}
                  {generatedInviteUrl && (
                    <div className="mt-2 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-700">
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">✅ Invite link (auto-copied):</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 break-all">
                          {generatedInviteUrl}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedInviteUrl);
                            setInviteCopied(true);
                            setTimeout(() => setInviteCopied(false), 2000);
                          }}
                        >
                          {inviteCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={() => createInviteMutation.mutate()}
                    className="w-full"
                    isLoading={createInviteMutation.isPending}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {generatedInviteUrl ? 'Generate New Invite' : 'Create Invite'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <FadeIn direction="up" delay={100}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-blue-50">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{members.length}</p>
            <p className="text-sm text-slate-500">Total Members</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-purple-50">
                <Crown className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {members.filter((m: any) => m.role === "ADMIN").length}
            </p>
            <p className="text-sm text-slate-500">Admins</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-50">
                <Mail className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {invites.filter((i: any) => i.status === "PENDING").length}
            </p>
            <p className="text-sm text-slate-500">Pending Invites</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-green-50">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {stats?.totalCompleted || 0}
            </p>
            <p className="text-sm text-slate-500">Tasks Completed</p>
          </Card>
        </div>
      </FadeIn>

      {/* Team Members */}
      <FadeIn direction="up" delay={200}>
        <Card className="mb-6">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Team Members</h3>
            </div>
          </div>
          <div className="p-6">
            {membersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No team members yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member: any) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          {getRoleBadge(member.role)}
                        </div>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold">{member.ticketCount}</p>
                          <p className="text-slate-500 text-xs">Tickets</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">
                            {member.completedCount}
                          </p>
                          <p className="text-slate-500 text-xs">Done</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-red-600">
                            {member.overdueCount}
                          </p>
                          <p className="text-slate-500 text-xs">Overdue</p>
                        </div>
                      </div>
                      {canAccessAdmin() && member.userId !== user?.userId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                updateRoleMutation.mutate({
                                  userId: member.userId,
                                  role: "ADMIN",
                                })
                              }
                            >
                              <Crown className="w-4 h-4 mr-2" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateRoleMutation.mutate({
                                  userId: member.userId,
                                  role: "MANAGER",
                                })
                              }
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Make Manager
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateRoleMutation.mutate({
                                  userId: member.userId,
                                  role: "MEMBER",
                                })
                              }
                            >
                              <User className="w-4 h-4 mr-2" />
                              Make Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                removeMemberMutation.mutate(member.userId)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </FadeIn>

      {/* Pending Invites */}
      {canAccessAdmin() && (
        <FadeIn direction="up" delay={300}>
          <Card>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-violet-600" />
                <h3 className="font-semibold">Pending Invites</h3>
              </div>
            </div>
            <div className="p-6">
              {invitesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                </div>
              ) : invites.filter((i: any) => i.status === "PENDING").length ===
                0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending invites</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invites
                    .filter((i: any) => i.status === "PENDING")
                    .map((invite: any) => (
                      <div
                        key={invite.token}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Pending</Badge>
                            {invite.requireDomain && (
                              <Badge variant="secondary">Domain Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            Created {formatDate(invite.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleCopyInvite(invite.token, invite.orgId)
                            }
                          >
                            {copiedToken === invite.token ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy Link
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => revokeInviteMutation.mutate(invite.token)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Card>
        </FadeIn>
      )}
    </DashboardLayout>
  );
}
