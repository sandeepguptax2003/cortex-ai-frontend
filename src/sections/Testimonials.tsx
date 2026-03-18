"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Cortex AI has completely transformed how our team handles meetings. We went from missing 30% of action items to capturing everything automatically.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    avatar: "SC",
  },
  {
    quote:
      "The AI is incredibly accurate. It not only extracts tasks but suggests the right assignee and realistic deadlines. It's like having a smart assistant.",
    author: "Michael Rodriguez",
    role: "Product Manager",
    company: "StartupXYZ",
    avatar: "MR",
  },
  {
    quote:
      "We save 5+ hours per week on meeting follow-ups. The Slack integration keeps everyone in the loop without any extra effort.",
    author: "Emily Watson",
    role: "Team Lead",
    company: "InnovateCo",
    avatar: "EW",
  },
  {
    quote:
      "The analytics dashboard gives us insights we never had before. We can see bottlenecks and optimize our workflow.",
    author: "David Kim",
    role: "CTO",
    company: "ScaleUp Inc",
    avatar: "DK",
  },
  {
    quote:
      "Best investment we've made this year. The ROI was visible within the first month. Our team is more productive than ever.",
    author: "Lisa Thompson",
    role: "Operations Director",
    company: "GrowthLabs",
    avatar: "LT",
  },
  {
    quote:
      "The Chrome extension works flawlessly with Zoom. Setup took 2 minutes and we were extracting tasks immediately.",
    author: "James Wilson",
    role: "Engineering Manager",
    company: "DevStudio",
    avatar: "JW",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Loved by <span className="gradient-text">teams worldwide</span>
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              See what industry leaders are saying about Cortex AI.
            </p>
          </FadeIn>
        </div>

        {/* Testimonials Grid */}
        <StaggerContainer
          staggerDelay={100}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-xl"
            >
              <Quote className="w-8 h-8 text-violet-200 dark:text-violet-800 mb-4" />
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
