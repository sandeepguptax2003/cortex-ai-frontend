"use client";

import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganisation } from "@/hooks/useOrganisation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { FadeIn } from "@/components/animations/FadeIn";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Building2,
  Bell,
  Shield,
  Link,
  Camera,
  Trash2,
  Loader2,
  Check,
  Mail,
  MessageSquare,
  Calendar,
  Ticket,
  Copy,
  Puzzle,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function SettingsPage() {
  const { user, refreshUser, accessToken, updateUser } = useAuth();
  const { organisation: org } = useOrganisation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokenCopied, setTokenCopied] = useState(false);

  const handleCopyToken = () => {
    const token = accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('cortex_at') : null);
    if (!token) {
      toast({ title: 'No token available', description: 'Please log out and log back in to get your token.', variant: 'error' });
      return;
    }
    navigator.clipboard.writeText(token);
    setTokenCopied(true);
    toast({ title: 'Token copied!', description: 'Paste it into the Chrome extension settings under Auth Token.', variant: 'success' });
    setTimeout(() => setTokenCopied(false), 3000);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailTicketUpdates: true,
    emailMeetingReminders: true,
    emailDigest: false,
    slackTicketUpdates: false,
    slackMeetingReminders: true,
    browserNotifications: true,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string }) => api.updateProfile(data),
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      refreshUser();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "error",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.updatePassword(data),
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setPasswordData({ current: "", new: "", confirm: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "error",
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => api.uploadAvatar(file),
    onSuccess: (response: any) => {
      const avatarUrl = response?.data?.avatarUrl || response?.avatarUrl;
      if (avatarUrl) {
        // Immediately update the user context so the avatar shows without a reload
        updateUser({ avatar: avatarUrl });
      }
      toast({
        title: "Photo updated",
        description: "Your profile picture has been updated.",
      });
      refreshUser();
      setIsUploading(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "error",
      });
      setIsUploading(false);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => api.deleteAccount(),
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been deleted.",
      });
      window.location.href = "/";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "error",
      });
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "error",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "error",
      });
      return;
    }

    setIsUploading(true);
    uploadAvatarMutation.mutate(file);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name: profileData.name });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "error",
      });
      return;
    }
    if (passwordData.new.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "error",
      });
      return;
    }
    updatePasswordMutation.mutate({
      currentPassword: passwordData.current,
      newPassword: passwordData.new,
    });
  };

  const canAccessAdmin = () => {
    return user?.role === "ADMIN" || user?.role === "MANAGER";
  };

  const isAdmin = () => user?.role === "ADMIN";

  return (
    <DashboardLayout>
      <div className="pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your account and organization preferences
          </p>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
        {/* Profile Section */}
        <FadeIn direction="up">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold text-lg">Profile</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div
                  onClick={handleAvatarClick}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center cursor-pointer group overflow-hidden shadow-lg"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-slate-500 mt-2">Click to change</p>
                <p className="text-xs text-slate-400">Max 5MB</p>
              </div>

              {/* Form */}
              <form onSubmit={handleProfileSubmit} className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400">Email cannot be changed</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={user?.role}
                    disabled
                    className="bg-slate-50 capitalize"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isLoading={updateProfileMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </FadeIn>

        {/* Password Section */}
        <FadeIn direction="up" delay={50}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold text-lg">Security</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.current}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, current: e.target.value })
                  }
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.new}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new: e.target.value })
                  }
                  placeholder="Enter new password"
                />
                <p className="text-xs text-slate-500">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirm: e.target.value })
                  }
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  isLoading={updatePasswordMutation.isPending}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </FadeIn>

        {/* Notifications Section */}
        <FadeIn direction="up" delay={100}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold text-lg">Notifications</h3>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Notifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Ticket Updates</p>
                      <p className="text-xs text-slate-500">
                        Get notified when tickets are assigned or updated
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailTicketUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailTicketUpdates: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Meeting Reminders</p>
                      <p className="text-xs text-slate-500">
                        Receive reminders before scheduled meetings
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailMeetingReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailMeetingReminders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Weekly Digest</p>
                      <p className="text-xs text-slate-500">
                        Get a summary of your week's activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailDigest: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Slack Notifications */}
              {org?.slackConnected && (
                <>
                  <div className="border-t border-slate-100 pt-4" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Slack Notifications
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Ticket Updates</p>
                          <p className="text-xs text-slate-500">
                            Send ticket notifications to Slack
                          </p>
                        </div>
                        <Switch
                          checked={notifications.slackTicketUpdates}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, slackTicketUpdates: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Meeting Reminders</p>
                          <p className="text-xs text-slate-500">
                            Send meeting reminders to Slack
                          </p>
                        </div>
                        <Switch
                          checked={notifications.slackMeetingReminders}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, slackMeetingReminders: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Browser Notifications */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Browser Notifications</p>
                    <p className="text-xs text-slate-500">
                      Show desktop notifications for important updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.browserNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, browserNotifications: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Organization Section */}
        {canAccessAdmin() && (
          <FadeIn direction="up" delay={150}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-violet-600" />
                <h3 className="font-semibold text-lg">Organization</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input value={org?.name || ""} disabled className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization Domain</Label>
                    <Input value={org?.domain || ""} disabled className="bg-slate-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Member Count</Label>
                  <Input
                    value={`${org?.memberCount || 0} members`}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
                {isAdmin() && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {}}>
                      Manage Members
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Integrations Section */}
        {isAdmin() && (
          <FadeIn direction="up" delay={200}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Link className="w-5 h-5 text-violet-600" />
                <h3 className="font-semibold text-lg">Integrations</h3>
              </div>

              <div className="space-y-4">
                {/* Slack Integration */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4A154B] rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Slack</p>
                      <p className="text-sm text-slate-500">
                        {org?.slackConnected
                          ? "Connected to your workspace"
                          : "Connect your Slack workspace"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={org?.slackConnected ? "outline" : "default"}
                    onClick={() =>
                      toast({
                        title: org?.slackConnected ? "Slack Connected" : "Slack",
                        description: org?.slackConnected
                          ? "Your Slack workspace is connected."
                          : "Slack OAuth configuration required. Contact your admin to set up SLACK_CLIENT_ID and SLACK_CLIENT_SECRET in the backend .env.",
                      })
                    }
                  >
                    {org?.slackConnected ? "Connected" : "Connect"}
                  </Button>
                </div>

                {/* Jira Integration — disabled, coming soon */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0052CC] rounded-xl flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Jira</p>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Coming soon</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Sync tickets with Jira projects
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>
                    Connect
                  </Button>
                </div>

                {/* Chrome Extension Auth Setup */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Puzzle className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium">Chrome Extension Token</p>
                      <p className="text-sm text-slate-500">
                        Copy your session token to use in the Chrome extension
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleCopyToken}
                  >
                    {tokenCopied ? (
                      <><Check className="w-4 h-4 mr-2 text-green-600" />Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" />Copy Token</>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Danger Zone */}
        <FadeIn direction="up" delay={250}>
          <Card className="p-6 border-red-200">
            <div className="flex items-center gap-2 mb-6">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-lg text-red-600">Danger Zone</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-slate-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600">
              Please type <strong>DELETE</strong> to confirm:
            </p>
            <Input
              className="mt-2"
              placeholder="Type DELETE"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteAccountMutation.mutate()}
              isLoading={deleteAccountMutation.isPending}
              disabled={deleteConfirm !== "DELETE"}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
}
