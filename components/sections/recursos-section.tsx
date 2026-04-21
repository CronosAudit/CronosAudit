"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  FileSearch,
  BrainCircuit,
  ShieldCheck,
  FolderOpen,
  GitBranch,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { AnimatedGroup } from "@/components/ui/animated-group"
import type { Variants } from "framer-motion"

/* ─────────────────────────────────────────
   Transition variants (same pattern as hero)
───────────────────────────────────────── */
const transitionVariants: { container?: Variants; item: Variants } = {
  item: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 14 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.25, duration: 0.9 },
    },
  },
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const recursos = [
  {
    id: "leitura",
    icon: FileSearch,
    accent: "amber",
    tag: "Entender",
    title: "Leitura inteligente de documentos",
    description:
      "Analise contratos, relatórios, políticas, papéis de trabalho e documentos de suporte com apoio contextual e extração assistida de pontos críticos.",
    bullets: [
      "Extração de cláusulas e riscos latentes",
      "Sumarização com contexto do cliente",
      "Indicação de pontos para aprofundamento",
    ],
    stat: { value: "47%", label: "menos tempo de leitura inicial" },
  },
  {
    id: "riscos",
    icon: BrainCircuit,
    accent: "blue",
    tag: "Executar",
    title: "Mapeamento de riscos com IA",
    description:
      "Estruture riscos relevantes, sinalize inconsistências e priorize áreas críticas com base em evidências, contexto e histórico operacional.",
    bullets: [
      "Priorização automática por relevância",
      "Cruzamento com histórico da firma",
      "Matriz de riscos gerada e exportável",
    ],
    stat: { value: "18+", label: "riscos mapeados por engajamento" },
  },
  {
    id: "papeis",
    icon: FolderOpen,
    accent: "teal",
    tag: "Executar",
    title: "Papéis de trabalho assistidos",
    description:
      "Organize testes, conclusões, justificativas e checkpoints de revisão em fluxos mais claros, rastreáveis e preparados para qualidade.",
    bullets: [
      "Templates adaptados à metodologia da firma",
      "Checkpoints automáticos de completude",
      "Exportação para formatos padrão",
    ],
    stat: { value: "126", label: "papéis gerados com rastreabilidade" },
  },
  {
    id: "rastreabilidade",
    icon: GitBranch,
    accent: "pink",
    tag: "Revisar",
    title: "Rastreabilidade de evidências",
    description:
      "Conecte respostas, conclusões e documentação de suporte para facilitar revisão técnica, supervisão e auditorias internas.",
    bullets: [
      "Trilha de auditoria completa",
      "Vínculo entre achado, teste e evidência",
      "Histórico de alterações e aprovações",
    ],
    stat: { value: "100%", label: "rastreabilidade das decisões" },
  },
  {
    id: "fluxos",
    icon: ShieldCheck,
    accent: "amber",
    tag: "Governança",
    title: "Fluxos auditáveis e padronizados",
    description:
      "Reduza variações operacionais com jornadas consistentes para planejamento, execução, revisão e documentação final.",
    bullets: [
      "Fluxos configuráveis por tipo de trabalho",
      "Validação de etapas antes do avanço",
      "Consistência entre todos os engajamentos",
    ],
    stat: { value: "+42%", label: "eficiência em rotinas repetitivas" },
  },
  {
    id: "conhecimento",
    icon: BookOpen,
    accent: "blue",
    tag: "Consultar",
    title: "Base centralizada de conhecimento",
    description:
      "Consolide critérios, políticas, orientações técnicas e referências internas em uma experiência mais rápida de consulta e apoio.",
    bullets: [
      "Busca semântica por conteúdo técnico",
      "Integração com normas e orientações vigentes",
      "Atualização contínua pela equipe da firma",
    ],
    stat: { value: "6x", label: "mais rápido localizar referências" },
  },
]

const accentConfig = {
  amber: {
    tag: "border-[--accent-amber-border] bg-[--accent-amber-soft] text-[--accent-amber]",
    icon: "border-[--accent-amber-border] bg-[--accent-amber-soft] text-[--accent-amber]",
    stat: "text-[--accent-amber]",
    dot: "bg-[--accent-amber]",
    hover: "hover:border-[--accent-amber-border]",
    glow: "from-[rgba(255,198,92,0.06)]",
  },
  blue: {
    tag: "border-[#74c8fc]/20 bg-[#74c8fc]/10 text-[#74c8fc]",
    icon: "border-[#74c8fc]/20 bg-[#74c8fc]/10 text-[#74c8fc]",
    stat: "text-[#74c8fc]",
    dot: "bg-[#74c8fc]",
    hover: "hover:border-[#74c8fc]/25",
    glow: "from-[rgba(116,200,252,0.06)]",
  },
  teal: {
    tag: "border-[#76e3dc]/20 bg-[#76e3dc]/10 text-[#76e3dc]",
    icon: "border-[#76e3dc]/20 bg-[#76e3dc]/10 text-[#76e3dc]",
    stat: "text-[#76e3dc]",
    dot: "bg-[#76e3dc]",
    hover: "hover:border-[#76e3dc]/25",
    glow: "from-[rgba(118,227,220,0.06)]",
  },
  pink: {
    tag: "border-[#ff9caa]/20 bg-[#ff9caa]/10 text-[#ff9caa]",
    icon: "border-[#ff9caa]/20 bg-[#ff9caa]/10 text-[#ff9caa]",
    stat: "text-[#ff9caa]",
    dot: "bg-[#ff9caa]",
    hover: "hover:border-[#ff9caa]/25",
    glow: "from-[rgba(255,156,170,0.06)]",
  },
} as const

type AccentKey = keyof typeof accentConfig

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function RecursoCard({
  recurso,
  index,
}: {
  recurso: (typeof recursos)[number]
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const ac = accentConfig[recurso.accent as AccentKey]
  const Icon = recurso.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group relative flex flex-col gap-5 overflow-hidden rounded-2xl
        border border-white/8 bg-white/[0.03] p-6
        transition-all duration-300
        ${ac.hover}
        hover:bg-white/[0.055] hover:-translate-y-0.5
      `}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Subtle corner glow on hover */}
      <div
        className={`
          pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full
          bg-gradient-radial ${ac.glow} to-transparent opacity-0
          blur-2xl transition-opacity duration-500
          group-hover:opacity-100
        `}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${ac.icon}`}
        >
          <Icon className="size-5" />
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${ac.tag}`}
        >
          {recurso.tag}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-base font-semibold leading-snug text-white">
          {recurso.title}
        </h3>
        <p className="text-sm leading-6 text-zinc-400">{recurso.description}</p>

        {/* Bullet list */}
        <ul className="mt-1 flex flex-col gap-2">
          {recurso.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400">
              <span
                className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${ac.dot} opacity-80`}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer stat */}
      <div className="mt-auto border-t border-white/6 pt-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-semibold ${ac.stat}`}>
            {recurso.stat.value}
          </span>
          <span className="text-xs text-zinc-500">{recurso.stat.label}</span>
        </div>
      </div>
    </div>
  )
}

function PipelineStep({
  step,
  label,
  desc,
  active,
}: {
  step: string
  label: string
  desc: string
  active?: boolean
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`
            flex size-8 shrink-0 items-center justify-center rounded-full border
            text-xs font-semibold font-mono
            ${
              active
                ? "border-[--accent-amber-border] bg-[--accent-amber-soft] text-[--accent-amber]"
                : "border-white/10 bg-white/[0.04] text-zinc-500"
            }
          `}
        >
          {step}
        </div>
        <div className="mt-1 w-px flex-1 bg-white/6" />
      </div>
      <div className="pb-6">
        <p
          className={`text-sm font-semibold ${active ? "text-white" : "text-zinc-400"}`}
        >
          {label}
        </p>
        <p className="mt-1 text-sm leading-6 text-zinc-500">{desc}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main section
───────────────────────────────────────── */
export function RecursosSection() {
  return (
    <section
      id="recursos"
      className="relative overflow-hidden border-t border-white/6 py-20 md:py-28"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px]" />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,198,92,0.07)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute -left-32 top-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(116,200,252,0.05)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(118,227,220,0.04)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Section header ── */}
        <AnimatedGroup
          variants={{
            container: { visible: { transition: { staggerChildren: 0.07 } } },
            ...transitionVariants,
          }}
          className="mb-14 flex flex-col items-center gap-4 text-center md:mb-16"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[--accent-amber-border] bg-[--accent-amber-soft] px-3 py-1.5">
            <Sparkles className="size-3.5 text-[--accent-amber]" />
            <span className="text-xs font-medium text-[--accent-amber]">
              Recursos da plataforma
            </span>
          </div>

          <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            Recursos pensados para uma{" "}
            <span className="bg-gradient-to-b from-[#fff7e3] via-[--accent-amber] to-[#c28a2b] bg-clip-text text-transparent">
              auditoria mais inteligente
            </span>
          </h2>

          <p className="max-w-2xl text-balance text-base leading-7 text-zinc-400 sm:text-lg">
            O Chronos Audit une inteligência artificial, rastreabilidade e
            governança em uma experiência moderna para apoiar firmas e auditores
            em todas as etapas do trabalho.
          </p>

          {/* Badges */}
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            {[
              { label: "100% Adaptável", color: "amber" },
              { label: "Seguro por padrão", color: "teal" },
              { label: "Performance operacional", color: "blue" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  accentConfig[color as AccentKey].tag
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </AnimatedGroup>

        {/* ── Main content: 2-col layout ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Left: cards grid */}
          <AnimatedGroup
            variants={{
              container: {
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
              },
              ...transitionVariants,
            }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {recursos.map((r, i) => (
              <RecursoCard key={r.id} recurso={r} index={i} />
            ))}
          </AnimatedGroup>

          {/* Right: pipeline + CTA */}
          <AnimatedGroup
            variants={{
              container: {
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
              },
              ...transitionVariants,
            }}
            className="flex flex-col gap-4"
          >
            {/* Pipeline card */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                Como as soluções se conectam
              </p>
              <h3 className="mb-6 text-base font-semibold text-white">
                Da preparação à revisão, com mais estrutura
              </h3>
              <div className="flex flex-col">
                <PipelineStep
                  step="01"
                  label="Entender"
                  desc="Leitura de documentos, contexto do cliente e identificação inicial de pontos sensíveis."
                  active
                />
                <PipelineStep
                  step="02"
                  label="Executar"
                  desc="Apoio na análise, organização do racional, estruturação de testes e documentação."
                />
                <PipelineStep
                  step="03"
                  label="Revisar"
                  desc="Mais clareza para revisão técnica, consistência entre evidência e conclusão."
                />
                <PipelineStep
                  step="04"
                  label="Governar"
                  desc="Rastreabilidade, fluxos auditáveis e base de conhecimento consolidada."
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-2xl border border-[--accent-amber-border] bg-[--accent-amber-soft] p-5">
              <p className="mb-4 text-sm font-semibold text-[--accent-amber]">
                Onde a plataforma ajuda mais
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Leitura", sub: "Assistida" },
                  { label: "Documentação", sub: "Estruturada" },
                  { label: "Revisão", sub: "Clara" },
                  { label: "Escala", sub: "Sustentável" },
                ].map(({ label, sub }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[--accent-amber-border] bg-black/20 px-3 py-2.5"
                  >
                    <p className="text-xs font-medium text-[#f4e7b2]">{label}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <p className="mb-1 text-sm font-semibold text-white">
                Pronto para começar?
              </p>
              <p className="mb-4 text-sm leading-6 text-zinc-400">
                Explore o Chronos Audit e transforme sua operação de auditoria.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#c9a633] hover:shadow-[0_8px_24px_rgba(212,175,55,0.22)]"
                >
                  Começar agora
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                >
                  Explorar o chat
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </AnimatedGroup>
        </div>

        {/* ── Bottom strip ── */}
        <AnimatedGroup
          variants={{
            container: {
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
            },
            ...transitionVariants,
          }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6"
        >
          {[
            { val: "6", label: "Frentes de solução" },
            { val: "360°", label: "Do plano à revisão" },
            { val: "Alto", label: "Controle" },
            { val: "+42%", label: "Eficiência" },
            { val: "100%", label: "IA responsável" },
            { val: "Completa", label: "Rastreabilidade" },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center"
            >
              <p className="text-lg font-semibold text-[#f4e7b2]">{val}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  )
}