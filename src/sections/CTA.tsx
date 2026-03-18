"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";

import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-8 lg:p-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Glow Effects */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Start your free trial today</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to transform your meetings?
              </h2>

              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join 500+ teams already using Cortex AI to capture tasks,
                improve productivity, and never miss an action item again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium h-12 px-8 bg-white text-violet-600 hover:bg-white/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>

                <Link href="/demo">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium h-12 px-8 border-2 border-white/40 bg-transparent text-white hover:bg-white/10 transition-all">
                    Schedule a Demo
                  </button>
                </Link>
              </div>

              <p className="mt-6 text-sm text-white/60">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
