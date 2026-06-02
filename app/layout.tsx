import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/contexts/AuthContext";

import "./globals.css";

const SITE_URL = "https://www.chronosaudit.com.br";
const SITE_NAME = "Chronos Audit";

const TITLE = "Chronos Audit | IA para Auditoria";

const DESCRIPTION =
  "Plataforma de IA para auditoria com governança, compliance, rastreabilidade e evidências auditáveis.";

/**
 * IMPORTANTE:
 * Renomeie o arquivo:
 * public/og_image (1).png
 *
 * para:
 * public/og-image.png
 */
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: DESCRIPTION,

  keywords: [
    "Chronos Audit",
    "auditoria com IA",
    "inteligência artificial para auditoria",
    "governança em auditoria",
    "compliance",
    "rastreabilidade de evidências",
    "papéis de trabalho",
    "evidências de auditoria",
    "IA responsável",
    "auditoria independente",
    "análise de riscos",
  ],

  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "technology",

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Chronos Audit - IA para Auditoria",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@Chronosaudit",
    creator: "@Chronosaudit",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],

    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  other: {
    "og:image:secure_url": OG_IMAGE,
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "Chronos Audit - IA para Auditoria",

    "twitter:image:alt": "Chronos Audit - IA para Auditoria",

    "theme-color": "#000000",

    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": SITE_NAME,
    "apple-mobile-web-app-status-bar-style": "black-translucent",

    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    alternateName: "Chronos",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    image: OG_IMAGE,
    description: DESCRIPTION,
    inLanguage: "pt-BR",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    },
  };

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body className="min-h-full flex flex-col bg-[#000000] text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}