"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { HoverScale } from "@/components/animations/HoverScale";
import {
  Brain,
  Zap,
  Users,
  BarChart3,
  Shield,
  MessageSquare,
  Calendar,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Task Extraction",
    description:
      "Our AI automatically identifies and extracts actionable tasks from meeting transcripts with 95% accuracy.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description:
      "Tasks are extracted in real-time during meetings, so you never miss an important action item.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Smart Assignment",
    description:
      "AI suggests the best assignee based on context, workload, and expertise from previous tasks.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track team productivity, completion rates, and identify bottlenecks with detailed analytics.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, SOC 2 compliance, and granular access controls for your data.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: MessageSquare,
    title: "Slack Integration",
    description:
      "Get instant notifications in Slack when tasks are created, updated, or completed.",
    color: "from-indigo-500 to-violet-600",
  },
  {
    icon: Calendar,
    title: "Deadline Management",
    description:
      "AI suggests realistic deadlines based on task complexity and team capacity.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Get reminded about upcoming deadlines via email, Slack, or in-app notifications.",
    color: "from-red-500 to-rose-600",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Everything you need to{" "}
              <span className="gradient-text">manage tasks</span>
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              From AI-powered task extraction to team analytics, Cortex AI provides
              all the tools you need to turn meetings into action.
            </p>
          </FadeIn>
        </div>

        {/* Features Grid */}
        <StaggerContainer
          staggerDelay={100}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <HoverScale key={index} scale={1.02}>
              <div className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-xl h-full">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </HoverScale>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
