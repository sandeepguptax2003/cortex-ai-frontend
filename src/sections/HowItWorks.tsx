"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Video, Cpu, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Video,
    title: "Connect Your Meetings",
    description:
      "Install our Chrome extension and connect Zoom, Google Meet, or Microsoft Teams. Or upload meeting transcripts directly.",
    features: [
      "One-click Chrome extension install",
      "Works with all major platforms",
      "Upload transcripts manually",
    ],
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Extracts Tasks",
    description:
      "Our AI powered by Amazon Bedrock analyzes conversations and automatically identifies actionable tasks with context.",
    features: [
      "95% accuracy in task detection",
      "Smart assignee suggestions",
      "Automatic deadline detection",
    ],
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Track & Complete",
    description:
      "Tasks appear in your Kanban board. Assign, track, and complete them with your team. Get notified of progress.",
    features: [
      "Visual Kanban board",
      "Real-time collaboration",
      "Smart reminders & notifications",
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              How it <span className="gradient-text">works</span>
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Get started in minutes. Our AI handles the heavy lifting so you can
              focus on what matters.
            </p>
          </FadeIn>
        </div>

        {/* Steps */}
        <div className="space-y-12 lg:space-y-0">
          {steps.map((step, index) => (
            <FadeIn key={index} direction="up" delay={index * 150}>
              <div
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold text-violet-200 dark:text-violet-900">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div
                  className={`relative ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950/50 dark:to-purple-950/50 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm">
                      {index === 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Video className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Zoom Connected</p>
                              <p className="text-xs text-slate-500">
                                Ready to capture
                              </p>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <Video className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Google Meet</p>
                              <p className="text-xs text-slate-500">
                                Ready to capture
                              </p>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="space-y-3">
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 border-violet-500">
                            <p className="text-sm font-medium mb-1">
                              Implement user authentication
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded">
                                High
                              </span>
                              <span>Due: Dec 31</span>
                            </div>
                          </div>
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 border-violet-500">
                            <p className="text-sm font-medium mb-1">
                              Update API documentation
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded">
                                Medium
                              </span>
                              <span>Due: Jan 5</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center p-4">
                            <div className="flex items-center gap-2 text-violet-600">
                              <Cpu className="w-5 h-5 animate-pulse" />
                              <span className="text-sm font-medium">
                                AI Processing...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="grid grid-cols-3 gap-3">
                          {["To Do", "In Progress", "Done"].map((col, i) => (
                            <div key={i} className="space-y-2">
                              <p className="text-xs font-medium text-slate-500 text-center">
                                {col}
                              </p>
                              {Array.from({ length: 2 }).map((_, j) => (
                                <div
                                  key={j}
                                  className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                                >
                                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                                  <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex justify-center my-8">
                  <ArrowRight className="w-8 h-8 text-violet-300 rotate-90" />
                </div>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
