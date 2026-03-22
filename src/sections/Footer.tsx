"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Twitter, Linkedin, Github, Youtube } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "/404" },
    { label: "Roadmap", href: "/404" },
  ],
  Company: [
    { label: "About", href: "/404" },
    { label: "Blog", href: "/404" },
    { label: "Careers", href: "/404" },
    { label: "Press", href: "/404" },
    { label: "Contact", href: "/404" },
  ],
  Resources: [
    { label: "Documentation", href: "/404" },
    { label: "API Reference", href: "/404" },
    { label: "Guides", href: "/404" },
    { label: "Community", href: "/404" },
    { label: "Support", href: "/404" },
  ],
  Legal: [
    { label: "Privacy", href: "/404" },
    { label: "Terms", href: "/404" },
    { label: "Security", href: "/404" },
    { label: "Cookies", href: "/404" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "/404", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/sandeep-gupta-a1b679263/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/sandeepguptax2003", label: "GitHub" },
  { icon: Youtube, href: "/404", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Logo href="/" size="sm" className="mb-4" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-xs">
                Transform meetings into actionable tasks with AI-powered
                decision intelligence.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900 dark:hover:text-violet-400 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © Cortex AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/404"
                className="text-sm text-slate-500 hover:text-violet-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/404"
                className="text-sm text-slate-500 hover:text-violet-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/404"
                className="text-sm text-slate-500 hover:text-violet-600 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
