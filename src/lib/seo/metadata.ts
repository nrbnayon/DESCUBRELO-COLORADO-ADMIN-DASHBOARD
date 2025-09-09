// src/lib/seo/metadata.ts
import type { Metadata } from "next";

export const siteConfig = {
  name: "Colorado Admin Dashboard",
  shortName: "SBCRMAD",
  description: "Colorado Admin Dashboard",
  url: "https://fun-engagement-dashboard.vercel.app",
  ogImage: "/logo.png",
  logo: {
    default: "/logo.png",
    dark: "/logo.png",
    favicon: "/favicon.ico",
    apple: "/logo.png",
    external: "https://i.postimg.cc/g2SgRtQk/logo.png",
    altText: "Colorado Admin Dashboard",
  },
  creator: "@nrbnayon",
  author: "gabrielepassam",
  company: "Prime Flow",
  type: "website",
  version: "1.0.0",

  // Contact Information
  contact: {
    email: "admin@your-domain.com",
    support: "support@your-domain.com",
  },

  // Social Media Links
  links: {
    twitter: "https://twitter.com/nrbnayon",
    github: "https://github.com/nrbnayon",
  },

  // Legal Pages
  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
    cookies: "/cookie-policy",
  },

  // Features for documentation/marketing
  features: ["Colorado Admin Dashboard"],

  keywords: ["SaaS-Based CRM Platform"],

  locale: "en_US",
  languages: ["en"],

  // Theme
  theme: {
    // primary: "#your-primary-color",
    // secondary: "#your-secondary-color",
    // Add other theme colors if needed
  },

  // Analytics (if using)
  analytics: {
    // googleAnalytics: "GA_MEASUREMENT_ID",
    // googleTagManager: "GTM_ID",
  },
};

// Enhanced metadata for layout.tsx
export const layoutMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.creator,
  publisher: siteConfig.company || siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteConfig.url,
    // languages: {
    //   'en-US': '/en-US',
    //   'es-ES': '/es-ES',
    // },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.logo.altText,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
    site: siteConfig.creator,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/logo.svg", color: "#000000" }],
  },
  //   manifest: "/site.webmanifest",
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
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "saas",
  classification: "SaaS-Based CRM Platform Management Software",
  referrer: "origin-when-cross-origin",
  other: {
    // "theme-color": siteConfig.theme?.primary || "#000000",
    // "color-scheme": "light dark",
  },
};
