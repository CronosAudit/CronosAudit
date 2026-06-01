// components/ui/footer-column.tsx
"use client"

import { Hourglass } from "lucide-react"
import Link from "next/link"

type IconProps = {
  className?: string
}

function GithubIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2.17c-3.22.7-3.9-1.38-3.9-1.38-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.72 0-1.26.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.2 1.19A11.1 11.1 0 0 1 12 5.88c.99 0 1.98.13 2.91.39 2.22-1.5 3.2-1.19 3.2-1.19.63 1.6.23 2.78.11 3.07.75.81 1.2 1.85 1.2 3.11 0 4.45-2.71 5.43-5.29 5.72.42.36.79 1.07.79 2.16v3.2c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

function InstagramIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  )
}

function TwitterIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.24 2H21.7l-7.55 8.63L23 22h-6.93l-5.43-7.1L4.43 22H.96l8.08-9.24L.55 2h7.1l4.9 6.48L18.24 2Zm-1.21 18h1.92L6.6 3.9H4.54L17.03 20Z" />
    </svg>
  )
}

function LinkedinIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.5 8h4.9v16H.5V8Zm7.7 0h4.7v2.2h.1c.65-1.24 2.25-2.55 4.63-2.55 4.95 0 5.87 3.26 5.87 7.5V24h-4.9v-7.85c0-1.87-.03-4.28-2.6-4.28-2.6 0-3 2.04-3 4.15V24H8.2V8Z" />
    </svg>
  )
}

function MailIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}

function PhoneIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.6 2.61a2 2 0 0 1-.45 2.11L8 9.65a16 16 0 0 0 6.35 6.35l1.21-1.21a2 2 0 0 1 2.11-.45c.84.28 1.71.48 2.61.6A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function MapPinIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function LogoIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  )
}

const productLinks = [
  { text: "Auditoria com IA", href: "/solucoes" },
  { text: "Relatórios auditáveis", href: "/relatorios" },
  { text: "Rastreabilidade", href: "/rastreabilidade" },
  { text: "Compliance", href: "/compliance" },
]

const companyLinks = [
  { text: "Sobre", href: "/sobre" },
  { text: "Planos", href: "/pricing" },
  { text: "Contato", href: "/contato" },
  { text: "Entrar", href: "/login" },
]

const helpLinks = [
  { text: "Documentação", href: "/documentacao" },
  { text: "Suporte", href: "/suporte" },
  { text: "Central de ajuda", href: "/ajuda" },
]

const contactInfo = [
  { icon: MailIcon, text: "victor.quiroz@fecap.br", href: "mailto:victor.quiroz@fecap.br" },
  { icon: PhoneIcon, text: "+55 (27) 99903-2832", href: "tel:+5527999032832" },
  { icon: MapPinIcon, text: "FECAP | SP- Brasil", href: "https://www.google.com/maps/search/FECAP%20,Av.%20da%20Liberdade,%20532,%20SAO%20PAULO,%20SP,%2001502-001,%20BRASIL" },
]

export default function Footer4Col() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,198,92,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(184,121,31,0.14),transparent_26%),linear-gradient(to_bottom,rgba(5,5,5,0.88),#050505_90%)]" />
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-16 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center justify-center gap-3 sm:justify-start">
              <span className="flex size-11 items-center justify-center rounded-2xl border border-[#ffc65c]/20 bg-[#ffc65c]/10">
                <Hourglass className="size-5 text-[#ffc65c]" />
              </span>
              <span className="text-2xl font-semibold tracking-tight">Chronos Audit</span>
            </Link>

            <p className="mx-auto mt-6 max-w-md text-center text-sm leading-7 text-zinc-400 sm:mx-0 sm:max-w-sm sm:text-left">
              Plataforma de auditoria com IA para geração, validação e rastreabilidade de relatórios, evidências e análises críticas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <FooterColumn title="Produto" links={productLinks} />
            <FooterColumn title="Empresa" links={companyLinks} />
            <FooterColumn title="Ajuda" links={helpLinks} />

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Contato</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, href }) => (
                  <li key={text}>
                    <Link href={href} className="flex items-center justify-center gap-2 text-zinc-400 transition hover:text-[#f4e7b2] sm:justify-start">
                      <Icon className="size-4 shrink-0 text-[#ffc65c]" />
                      <span>{text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-zinc-500">
              © 2026 Chronos Audit. Todos os direitos reservados.
            </p>

            <div className="flex flex-wrap justify-center gap-5 text-sm text-zinc-500">
              <Link href="/termos" className="transition hover:text-[#f4e7b2]">Termos</Link>
              <Link href="/privacidade" className="transition hover:text-[#f4e7b2]">Privacidade</Link>
              <Link href="/cookies" className="transition hover:text-[#f4e7b2]">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { text: string; href: string }[]
}) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-lg font-medium text-white">{title}</p>
      <ul className="mt-8 space-y-4 text-sm">
        {links.map(({ text, href }) => (
          <li key={text}>
            <Link href={href} className="text-zinc-400 transition hover:text-[#f4e7b2]">
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}