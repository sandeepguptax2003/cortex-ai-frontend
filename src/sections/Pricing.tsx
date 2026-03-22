"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: 0,
    period: "forever (open source)",
    features: [
      "Up to 5 team members",
      "50 tasks per month",
      "Zoom & Google Meet integration",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing teams that need more power",
    price: 0,
    period: "totally free",
    features: [
      "Unlimited team members",
      "Unlimited tasks",
      "All meeting platforms",
      "Advanced analytics",
      "Slack integration",
      "Priority support",
      "Custom workflows",
    ],
    cta: "Sign Up",
    href: "/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    price: 0,
    period: "Also free",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Advanced security",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "On-premise option",
    ],
    cta: "Contact Sales",
    href: "/signup",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </FadeIn>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <FadeIn key={index} direction="up" delay={index * 100}>
              <div
                className={cn(
                  "relative p-8 rounded-2xl border transition-all duration-300",
                  plan.popular
                    ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20 scale-105 shadow-xl"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-slate-500">{plan.period}</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-slate-500">{plan.period}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      plan.popular && "btn-shine bg-violet-600 hover:bg-violet-700"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Trust Badges */}
        <FadeIn direction="up" delay={400}>
          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500 mb-4">
              May be trusted by teams in the future
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {["DummyCorp", "TestXYZ", "ExampleCo", "Localhost Inc", "SampleLabs"].map(
                (company) => (
                  <span
                    key={company}
                    className="text-lg font-semibold text-slate-400"
                  >
                    {company}
                  </span>
                )
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
