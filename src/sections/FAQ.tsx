"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is Cortex AI?",
    answer:
      "Cortex AI is an AI-powered decision intelligence platform that automatically extracts actionable tasks from meetings. It works with Zoom, Google Meet, and Microsoft Teams to identify tasks, assign owners, set deadlines, and track progress.",
  },
  {
    question: "How does the AI task extraction work?",
    answer:
      "Our AI, powered by Amazon Bedrock, analyzes meeting transcripts in real-time using a two-stage process: first, it classifies content to identify actionable items, then extracts task details including title, assignee, deadline, and priority with 95% accuracy.",
  },
  {
    question: "Which meeting platforms are supported?",
    answer:
      "Cortex AI supports Zoom, Google Meet, and Microsoft Teams through our Chrome extension. You can also upload meeting transcripts directly in various formats (TXT, PDF, DOCX, VTT, SRT).",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! We offer a 14-day free trial of our Pro plan with full access to all features. No credit card required. After the trial, you can choose to upgrade or continue with our free Starter plan.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Security is our top priority. We use bank-grade AES-256 encryption, are SOC 2 Type II compliant, and never store your meeting recordings. All data is processed in real-time and stored securely in AWS.",
  },
  {
    question: "Can I integrate with other tools?",
    answer:
      "Absolutely! Cortex AI integrates with Slack, Notion, Jira, and more. We also offer a REST API and webhooks for custom integrations with your existing workflow.",
  },
  {
    question: "What happens if the AI makes a mistake?",
    answer:
      "While our AI is 95% accurate, you can easily edit, reassign, or delete any extracted task. The system also learns from your corrections to improve future extractions.",
  },
  {
    question: "Do you offer enterprise plans?",
    answer:
      "Yes, we offer custom Enterprise plans with SSO/SAML, advanced security features, dedicated support, SLA guarantees, and on-premise deployment options. Contact our sales team for a custom quote.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Frequently asked <span className="gradient-text">questions</span>
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to know about Cortex AI.
            </p>
          </FadeIn>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={index} direction="up" delay={index * 50}>
              <div
                className={cn(
                  "rounded-xl border transition-all duration-300",
                  openIndex === index
                    ? "border-violet-300 dark:border-violet-700 bg-white dark:bg-slate-900"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-200 dark:hover:border-violet-800"
                )}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === index ? "max-h-96" : "max-h-0"
                  )}
                >
                  <p className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Contact CTA */}
        <FadeIn direction="up" delay={400}>
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Still have questions?
            </p>
            <a
              href="mailto:support@cortex-ai.com"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Contact our support team →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
