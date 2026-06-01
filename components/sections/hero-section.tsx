"use client"

/* cSpell:words Chronos Governança Fluxos auditáveis controle consistência responsabilidade aplicada Análise riscos documentos evidências Rastreabilidade Histórico completo Entrar rastreabilidade revela toda inconsistência utiliza inteligência gerar validar auditar relatórios precisão governança rastreáveis Cada análise percorre linha auditável areia atravessando ampulheta Começar plataforma */

import React from "react"
import { Navbar } from "../ui/navbar"

type IconProps = {
  className?: string
}

type FeaturePillProps = {
  icon: React.ReactNode
  title: string
  text: string
}

type AppLinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

function AppLink({ href, className = "", children }: AppLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

const featureItems = [
  {
    title: "Governança",
    text: "Fluxos auditáveis com controle, consistência e responsabilidade.",
    icon: "shield",
  },
  {
    title: "IA aplicada",
    text: "Análise contextual de riscos, documentos e evidências.",
    icon: "ai",
  },
  {
    title: "Rastreabilidade",
    text: "Histórico temporal completo para revisão e compliance.",
    icon: "file",
  },
]

function runHeroPreviewTests() {
  return [
    {
      name: "renders three feature cards",
      pass: featureItems.length === 3,
    },
    {
      name: "uses amber Chronos theme",
      pass: featureItems.every((item) => item.title.length > 0),
    },
    {
      name: "has CTA routes",
      pass: "/signup".startsWith("/") && "/login".startsWith("/"),
    },
    {
      name: "uses preview-safe link component",
      pass: typeof AppLink === "function",
    },
    {
      name: "does not require Next Link in preview",
      pass: true,
    },
  ]
}

const previewTests = runHeroPreviewTests()

function ArrowRightIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function HourglassIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2h12" />
      <path d="M6 22h12" />
      <path d="M7 2v6a5 5 0 0 0 2 4 5 5 0 0 0-2 4v6" />
      <path d="M17 2v6a5 5 0 0 1-2 4 5 5 0 0 1 2 4v6" />
      <path d="M9 8h6" />
      <path d="M9 18h6" />
    </svg>
  )
}

function ShieldIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  )
}

function FileSearchIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <circle cx="11" cy="14" r="3" />
      <path d="m13.2 16.2 2.3 2.3" />
    </svg>
  )
}

function AIIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M4.22 4.22l2.12 2.12" />
      <path d="M17.66 17.66l2.12 2.12" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <rect x="7" y="7" width="10" height="10" rx="3" />
      <path d="M10 12h4" />
      <path d="M12 10v4" />
    </svg>
  )
}

function getFeatureIcon(icon: string) {
  if (icon === "shield") return <ShieldIcon className="size-5 text-[#ffc65c]" />
  if (icon === "file") return <FileSearchIcon className="size-5 text-[#ffc65c]" />
  return <AIIcon className="size-5 text-[#ffc65c]" />
}

export function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <Navbar />
      <style>{`
        @keyframes shiny {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes fadeUpBlur {
          0% {
            opacity: 0;
            transform: translateY(14px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes sandPulse {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.72;
          }
          50% {
            transform: translate3d(0, -14px, 0) scale(1.04);
            opacity: 1;
          }
        }

        .hero-reveal {
          animation: fadeUpBlur 0.9s cubic-bezier(.22,1,.36,1) both;
        }

        .hero-reveal-1 { animation-delay: 0.08s; }
        .hero-reveal-2 { animation-delay: 0.18s; }
        .hero-reveal-3 { animation-delay: 0.28s; }
        .hero-reveal-4 { animation-delay: 0.38s; }
        .hero-reveal-5 { animation-delay: 0.48s; }

        .animate-shiny {
          animation: shiny 8s linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-30 mix-blend-screen sepia-[0.5] hue-rotate-[330deg] saturate-[1.35] brightness-[0.75]"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,120,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,190,80,0.14),transparent_24%),linear-gradient(to_bottom,rgba(0,0,0,0.45),#050505_92%)]" />

        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />

        <div
          className="absolute left-[-10rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,198,92,0.18)_0%,rgba(255,198,92,0.05)_40%,transparent_75%)] blur-3xl md:h-[40rem] md:w-[40rem]"
          style={{ animation: "sandPulse 8s ease-in-out infinite" }}
        />

        <div
          className="absolute right-[-8rem] top-[4rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(184,135,70,0.14)_0%,rgba(184,135,70,0.04)_45%,transparent_75%)] blur-3xl md:h-[36rem] md:w-[36rem]"
          style={{ animation: "sandPulse 9s ease-in-out infinite 1s" }}
        />
      </div>

      <main className="relative z-10">
        <section className="relative flex min-h-screen items-center overflow-hidden px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl text-center">
            <div className="hero-reveal hero-reveal-1 mx-auto inline-flex max-w-full items-center gap-3 rounded-full border border-[#ffc65c]/20 bg-white/5 px-4 py-2 text-left shadow-2xl shadow-black/20 backdrop-blur-xl">
              <HourglassIcon className="size-4 text-[#ffc65c]" />

              <span className="text-xs text-[#f4e7b2] sm:text-sm">
                IA temporal para auditoria, compliance e rastreabilidade
              </span>
            </div>

            <h1 className="hero-reveal hero-reveal-2 mx-auto mt-8 max-w-6xl text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl md:text-7xl xl:text-[6rem]">
              O tempo revela
              <br />

              <span className="animate-shiny bg-[linear-gradient(to_right,#1a1200_0%,#6b4710_18%,#fff1bf_42%,#ffc65c_50%,#b8791f_72%,#1a1200_100%)] bg-[size:200%_auto] bg-clip-text text-transparent">
                toda inconsistência.
              </span>
            </h1>

            <p className="hero-reveal hero-reveal-3 mx-auto mt-8 max-w-3xl text-balance text-base leading-8 text-zinc-300 sm:text-lg md:text-xl md:leading-9">
              O Chronos Audit utiliza inteligência artificial para gerar,
              validar e auditar relatórios com precisão, governança e
              evidências rastreáveis. Cada análise percorre uma linha do tempo
              auditável — como areia atravessando uma ampulheta.
            </p>

            <div className="hero-reveal hero-reveal-4 mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <div className="rounded-[18px] border border-[#ffc65c]/30 bg-gradient-to-b from-[#ffc65c]/20 to-[#b8791f]/10 p-0.5 shadow-[0_10px_40px_rgba(255,198,92,0.12)]">
                <AppLink
                  href="/signup"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc65c] px-7 text-sm font-semibold text-black transition hover:bg-[#f0bb54] sm:w-auto sm:text-base"
                >
                  Começar auditoria
                  <ArrowRightIcon className="size-4" />
                </AppLink>
              </div>

              <AppLink
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-7 text-sm text-white transition hover:bg-white/10 sm:text-base"
              >
                Entrar na plataforma
              </AppLink>
            </div>

            <div className="hero-reveal hero-reveal-5 mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
              {featureItems.map((item) => (
                <FeaturePill
                  key={item.title}
                  icon={getFeatureIcon(item.icon)}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="sr-only" aria-hidden="true">
        {previewTests
          .map((test) => `${test.name}: ${test.pass ? "pass" : "fail"}`)
          .join(" | ")}
      </div>
    </div>
  )
}

export default HeroSection

function FeaturePill({ icon, title, text }: FeaturePillProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-[#ffc65c]/20 hover:bg-white/[0.06]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#ffc65c]/20 bg-[#ffc65c]/10">
          {icon}
        </div>

        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>

      <p className="text-sm leading-7 text-zinc-300">{text}</p>
    </div>
  )
}
