import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { SessionExpiredToast } from "@/components/shared/SessionExpiredToast";
import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { Features } from "@/sections/Features";
import { HowItWorks } from "@/sections/HowItWorks";
import { Integrations } from "@/sections/Integrations";
import { Testimonials } from "@/sections/Testimonials";
import { Pricing } from "@/sections/Pricing";
import { FAQ } from "@/sections/FAQ";
import { CTA } from "@/sections/CTA";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = generatePageMetadata({
  title: "Transform Meetings into Actionable Tasks with AI",
  description:
    "Cortex AI automatically extracts tasks from your meetings, assigns owners, sets deadlines, and tracks progress. Works with Zoom, Google Meet, and Teams.",
  path: "/",
});

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <SessionExpiredToast />
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Integrations />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
