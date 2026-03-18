"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";

import { GlowEffect } from "@/components/animations/GlowEffect";
import { Play, ArrowRight, Sparkles, Zap, Users, Shield } from "lucide-react";

const stats = [
  { value: "10K+", label: "Tasks Extracted" },
  { value: "500+", label: "Active Teams" },
  { value: "99.9%", label: "Uptime" },
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <FadeIn direction="up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Amazon Bedrock AI</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
                <span className="text-slate-900 dark:text-white">
                  Transform Meetings into{" "}
                </span>
                <span className="gradient-text">Actionable Tasks</span>
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={200}>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Cortex AI automatically extracts tasks from your meetings, assigns
                owners, sets deadlines, and tracks progress. Never miss an action
                item again.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link href="/signup">
                  <Button size="lg" className="btn-shine text-base px-8">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={400}>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-violet-500" />
                  <span>Enterprise security</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Content - Dashboard Preview */}
          <FadeIn direction="left" delay={200} className="relative">
            <GlowEffect intensity={30}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {/* Dashboard Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-slate-400">
                    cortex-ai.com/dashboard
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Total Tasks", value: "24", change: "+12%" },
                      { label: "In Progress", value: "8", change: "+5%" },
                      { label: "Completed", value: "16", change: "+23%" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800"
                      >
                        <p className="text-xs text-slate-500 mb-1">
                          {stat.label}
                        </p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <span className="text-xs text-green-500">
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Kanban Preview */}
                  <div className="grid grid-cols-3 gap-3">
                    {["To Do", "In Progress", "Done"].map((col, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                          <span>{col}</span>
                          <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                            {i === 0 ? "4" : i === 1 ? "3" : "5"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {Array.from({ length: i === 2 ? 2 : 3 }).map((_, j) => (
                            <div
                              key={j}
                              className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                              <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                              <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-700 rounded" />
                              <div className="flex items-center gap-2 mt-3">
                                <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900" />
                                <div className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                  High
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlowEffect>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium">AI Extracted</p>
                  <p className="text-[10px] text-slate-500">3 new tasks</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-medium">Team Sync</p>
                  <p className="text-[10px] text-slate-500">8 members active</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Stats Bar */}
        <FadeIn direction="up" delay={500}>
          <div className="mt-16 lg:mt-24 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-3 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl lg:text-4xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
