import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.Chronosaudit.com.br"),
  title: {
    default: "Chronos Audit | Plataforma de IA para Auditoria com Governança e Rastreabilidade",
    template: "%s | Chronos Audit",
  },
  description:
    "Chronos Audit é uma plataforma de inteligência artificial para auditoria, com foco em governança, rastreabilidade, conformidade, análise de riscos, documentação de evidências e uso ético da IA.",
  keywords: [
    "Chronos Audit",
    "auditoria",
    "auditoria com IA",
    "inteligência artificial para auditoria",
    "plataforma de auditoria",
    "governança em auditoria",
    "rastreabilidade de evidências",
    "compliance",
    "análise de riscos",
    "auditoria independente",
    "automação de auditoria",
    "IA responsável",
    "auditoria de empresas com IA",
    "tecnologia para auditoria",
    "papéis de trabalho",
    "evidências de auditoria",
    "firmas de auditoria",
    "auditoria no Brasil",
  ],
  authors: [{ name: "Chronos Audit" }],
  creator: "Chronos Audit",
  publisher: "Chronos Audit",
  applicationName: "Chronos Audit",
  category: "technology",
  classification: "Business, Audit, Artificial Intelligence, Compliance",
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
  alternates: {
    canonical: "https://www.Chronosaudit.com.br",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.Chronosaudit.com.br",
    siteName: "Chronos Audit",
    title:
      "Chronos Audit | Plataforma de IA para Auditoria com Governança e Rastreabilidade",
    description:
      "Plataforma de inteligência artificial para auditoria com foco em governança, rastreabilidade, análise de riscos, conformidade e documentação estruturada de evidências.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chronos Audit - Plataforma de IA para Auditoria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Chronos Audit | Plataforma de IA para Auditoria com Governança e Rastreabilidade",
    description:
      "Inteligência artificial aplicada à auditoria com uso ético, governança, rastreabilidade e apoio à documentação de evidências.",
    images: ["/og-image.jpg"],
    creator: "@Chronosaudit",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}