export const siteConfig = {
  name: "Cortex AI",
  description:
    "Transform meetings into actionable tasks with AI-powered decision intelligence. Automatically extract tasks, assign owners, and track progress.",
  shortDescription: "AI-powered meeting task extraction",
  url: "https://cortex-ai.com",
  ogImage: "https://cortex-ai.com/og-image.jpg",
  links: {
    twitter: "https://twitter.com/cortexai",
    github: "https://github.com/cortexai",
    linkedin: "https://linkedin.com/company/cortexai",
  },
  keywords: [
    "AI task extraction",
    "meeting automation",
    "decision intelligence",
    "task management",
    "productivity tool",
    "meeting notes",
    "action items",
    "team collaboration",
    "project management",
    "AI assistant",
  ],
  authors: [{ name: "Cortex AI Team" }],
  creator: "Cortex AI",
  publisher: "Cortex AI",
};

export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@cortexai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export function generatePageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}) {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description: description || siteConfig.description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
      siteConfig.links.github,
    ],
  },
  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Cortex AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cortex AI is an AI-powered decision intelligence platform that automatically extracts actionable tasks from meetings, assigns owners, sets deadlines, and tracks progress.",
        },
      },
      {
        "@type": "Question",
        name: "Which meeting platforms are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cortex AI supports Zoom, Google Meet, and Microsoft Teams through our Chrome extension. You can also upload meeting transcripts directly.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a free trial?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Cortex AI offers a free 14-day trial with full access to all features. No credit card required.",
        },
      },
    ],
  },
};
