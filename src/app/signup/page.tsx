"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { FadeIn } from "@/components/animations/FadeIn";
import { api } from "@/lib/api/client";
import { isValidPassword } from "@/lib/utils";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Check,
  X,
  Building2,
} from "lucide-react";

function SignupPageContent() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const orgId = searchParams.get("org");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [inviteOrgName, setInviteOrgName] = useState<string>("");

  const { signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Validate invite if present
  useEffect(() => {
    if (inviteToken && orgId) {
      api
        .validateInvite(inviteToken, orgId)
        .then((response) => {
          if (response.success) {
            setInviteValid(true);
            setInviteOrgName(response.data.orgName);
          } else {
            setInviteValid(false);
          }
        })
        .catch(() => {
          setInviteValid(false);
        });
    }
  }, [inviteToken, orgId]);

  const passwordValidation = isValidPassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      toast({
        variant: "error",
        title: "Invalid password",
        description: passwordValidation.errors[0],
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        email,
        password,
        name,
        orgId: orgId || undefined,
        inviteToken: inviteToken || undefined,
      });
      toast({
        variant: "success",
        title: "Welcome to Cortex AI!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Back Button */}
          <FadeIn direction="down">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </FadeIn>

          {/* Logo */}
          <FadeIn direction="up" delay={100}>
            <div className="mb-8">
              <Logo href="/" size="lg" />
            </div>
          </FadeIn>

          {/* Header */}
          <FadeIn direction="up" delay={150}>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {inviteValid
                  ? `Join ${inviteOrgName}`
                  : "Create your account"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {inviteValid
                  ? "Accept the invitation to join the team"
                  : "Start your 14-day free trial today"}
              </p>
            </div>
          </FadeIn>

          {/* Invite Error */}
          {inviteValid === false && (
            <FadeIn direction="up">
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  This invitation link is invalid or has expired. Please request
                  a new invitation.
                </p>
              </div>
            </FadeIn>
          )}

          {/* Form */}
          <FadeIn direction="up" delay={200}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="space-y-1 mt-2">
                  {[
                    { label: "At least 8 characters", valid: password.length >= 8 },
                    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
                    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
                    { label: "One number", valid: /[0-9]/.test(password) },
                    {
                      label: "One special character",
                      valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
                    },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {req.valid ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-slate-300" />
                      )}
                      <span
                        className={
                          req.valid
                            ? "text-green-600"
                            : "text-slate-400"
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-violet-600 hover:text-violet-700"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-violet-600 hover:text-violet-700"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full btn-shine"
                isLoading={isLoading}
                disabled={inviteValid === false}
              >
                {inviteValid ? "Join Team" : "Create Account"}
              </Button>
            </form>
          </FadeIn>

          {/* Divider */}
          {!inviteValid && (
            <FadeIn direction="up" delay={250}>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-950 text-slate-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Social Login */}
          {!inviteValid && (
            <FadeIn direction="up" delay={300}>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </button>
              </div>
            </FadeIn>
          )}

          {/* Sign In Link */}
          <FadeIn direction="up" delay={350}>
            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-violet-600 hover:text-violet-700"
              >
                Sign in
              </Link>
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600">
          {/* Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <blockquote className="text-2xl font-medium leading-relaxed mb-6">
            &ldquo;The AI is incredibly accurate. It not only extracts tasks but
            suggests the right assignee and realistic deadlines.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
              MR
            </div>
            <div>
              <p className="font-medium">Michael Rodriguez</p>
              <p className="text-white/70">Product Manager, StartupXYZ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
}
