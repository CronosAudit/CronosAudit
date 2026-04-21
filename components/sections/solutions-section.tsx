"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  FileSearch,
  Scale,
  ClipboardCheck,
  ScanSearch,
  Database,
  Workflow,
  Lock,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Navbar } from "@/components/ui/navbar"
import type { Variants } from "framer-motion"

const transitionVariants: { container?: Variants; item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 14,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.25,
        duration: 0.9,
      },
    },
  },
}

const solutions = [
  {
    icon: <ScanSearch className="size-5 text-[#d4af37]" />,
    title: "Leitura inteligente de documentos",
    text: "Analise contratos, relatórios, políticas, papéis de trabalho e documentos de suporte com apoio contextual e extração assistida de pontos críticos.",
  },
  {
    icon: <BrainCircuit className="size-5 text-[#d4af37]" />,
    title: "Mapeamento de riscos com IA",
    text: "Estruture riscos relevantes, sinalize inconsistências e priorize áreas críticas com base em evidências, contexto e histórico operacional.",
  },
  {
    icon: <ClipboardCheck className="size-5 text-[#d4af37]" />,
    title: "Papéis de trabalho assistidos",
    text: "Organize testes, conclusões, justificativas e checkpoints de revisão em fluxos mais claros, rastreáveis e preparados para qualidade.",
  },
  {
    icon: <FileSearch className="size-5 text-[#d4af37]" />,
    title: "Rastreabilidade de evidências",
    text: "Conecte respostas, conclusões e documentação de suporte para facilitar revisão técnica, supervisão e auditorias internas.",
  },
  {
    icon: <Workflow className="size-5 text-[#d4af37]" />,
    title: "Fluxos auditáveis e padronizados",
    text: "Reduza variações operacionais com jornadas consistentes para planejamento, execução, revisão e documentação final.",
  },
  {
    icon: <Database className="size-5 text-[#d4af37]" />,
    title: "Base centralizada de conhecimento",
    text: "Consolide critérios, políticas, orientações técnicas e referências internas em uma experiência mais rápida de consulta e apoio.",
  },
]

const resources = [
  {
    title: "Planejamento assistido",
    text: "Apoio na compreensão do negócio, leitura preliminar, identificação de assuntos relevantes e estruturação inicial da abordagem.",
  },
  {
    title: "Execução com contexto",
    text: "Auxílio para organizar evidências, cruzar informações, resumir achados e apoiar rotinas de análise documental e operacional.",
  },
  {
    title: "Revisão mais eficiente",
    text: "Melhore a visualização do racional, dos pontos de atenção e da consistência entre evidência, teste realizado e conclusão.",
  },
]

const governanceItems = [
  {
    icon: <ShieldCheck className="size-5 text-[#d4af37]" />,
    title: "Supervisão humana",
    text: "A IA apoia o trabalho, mas não substitui julgamento profissional, revisão técnica nem responsabilidade da firma.",
  },
  {
    icon: <Scale className="size-5 text-[#d4af37]" />,
    title: "Uso ético e responsável",
    text: "Aplicação com diretrizes claras, consistência metodológica e foco em segurança, transparência e conformidade.",
  },
  {
    icon: <Lock className="size-5 text-[#d4af37]" />,
    title: "Controle e confiabilidade",
    text: "Estruturas para rastrear decisões, apoiar revisão de qualidade e reduzir riscos de uso inadequado da tecnologia.",
  },
]

export function SolutionsSection() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-[#0b0b0c] text-white">
        <section className="relative">
          <div className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36">
            <div className="absolute inset-0 -z-20">
              <BackgroundPaths />
            </div>

            <div className="absolute inset-0 -z-10 bg-[#0b0b0c]/88" />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="absolute left-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16)_0%,rgba(212,175,55,0.05)_35%,transparent_72%)] blur-3xl md:h-[34rem] md:w-[34rem]" />
              <div className="absolute right-[-10rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(120,119,108,0.12)_0%,rgba(120,119,108,0.05)_40%,transparent_75%)] blur-3xl md:h-[30rem] md:w-[30rem]" />
              <div className="absolute bottom-[-12rem] left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(166,124,82,0.12)_0%,rgba(166,124,82,0.03)_45%,transparent_75%)] blur-3xl md:h-[28rem] md:w-[28rem]" />
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_100%,transparent_0%,#0b0b0c_62%)]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="text-center">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/solucoes"
                    className="group mx-auto inline-flex max-w-full items-center gap-3 rounded-full border border-[#d4af37]/20 bg-white/5 px-3 py-2 text-left shadow-md shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/10 sm:gap-4 sm:pl-4"
                  >
                    <span className="text-xs text-[#f4e7b2] sm:text-sm">
                      Soluções práticas para auditoria inteligente
                    </span>

                    <span className="hidden h-4 w-px bg-[#d4af37]/30 sm:block" />

                    <div className="hidden size-6 overflow-hidden rounded-full bg-[#d4af37] text-black duration-500 sm:block">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <h1 className="mx-auto mt-6 max-w-5xl text-balance text-4xl font-semibold leading-[1.05] sm:mt-8 sm:text-5xl md:text-6xl xl:text-[5rem]">
                    Soluções para transformar{" "}
                    <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                      auditoria, evidência e governança
                    </span>{" "}
                    em um fluxo mais inteligente
                  </h1>

                  <p className="mx-auto mt-5 max-w-3xl text-balance text-base leading-7 text-zinc-300 sm:mt-6 sm:text-lg md:text-xl md:leading-8">
                    O Chronos Audit reúne recursos para leitura documental,
                    apoio à avaliação de riscos, organização de evidências,
                    padronização operacional e revisão técnica com foco em uso
                    responsável da IA.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.25,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center"
                >
                  <div className="rounded-[16px] border border-[#d4af37]/30 bg-gradient-to-b from-[#d4af37]/20 to-[#b88746]/10 p-0.5 shadow-lg shadow-[#d4af37]/10">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 w-full rounded-[14px] bg-[#d4af37] px-6 text-sm font-semibold text-black hover:bg-[#c9a633] sm:w-auto sm:text-base"
                    >
                      <Link href="/signup">Começar agora</Link>
                    </Button>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-12 rounded-[14px] border border-white/10 px-6 text-sm text-white hover:bg-white/10 hover:text-white sm:text-base"
                  >
                    <Link href="/chat">Explorar o chat</Link>
                  </Button>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.06,
                          delayChildren: 0.35,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 sm:mt-10 md:grid-cols-3"
                >
                  <FeaturePill
                    icon={<ShieldCheck className="size-5 text-[#d4af37]" />}
                    title="Confiança operacional"
                    text="Soluções desenhadas para reforçar consistência, revisão e segurança metodológica."
                  />
                  <FeaturePill
                    icon={<Sparkles className="size-5 text-[#d4af37]" />}
                    title="Produtividade com contexto"
                    text="Ganhe velocidade sem perder clareza, rastreabilidade e supervisão profissional."
                  />
                  <FeaturePill
                    icon={<BarChart3 className="size-5 text-[#d4af37]" />}
                    title="Escala com governança"
                    text="Estruture processos mais replicáveis para times, firmas e operações em crescimento."
                  />
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.45,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-10 px-4 sm:mt-14 sm:px-6 md:mt-16">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[#0b0b0c]"
                />

                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[24px] border border-white/10 bg-[#111214]/95 p-2 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:rounded-[28px] sm:p-3">
                  <div className="rounded-[20px] border border-[#d4af37]/15 bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,255,255,0.02),rgba(184,135,70,0.06))] p-4 sm:p-5 md:rounded-[24px] md:p-8">
                    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#f4e7b2]">
                              Visão consolidada de soluções
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                              Uma plataforma para apoiar cada etapa do trabalho
                            </h3>
                          </div>

                          <div className="w-fit rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#f4e7b2]">
                            Solutions Suite
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          <DashboardCard
                            title="Fluxos"
                            value="6"
                            description="Frentes principais de solução"
                          />
                          <DashboardCard
                            title="Foco"
                            value="360°"
                            description="Do planejamento à revisão"
                          />
                          <DashboardCard
                            title="Controle"
                            value="Alto"
                            description="Com rastreabilidade e governança"
                          />
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm text-zinc-300">
                            <BrainCircuit className="size-4 text-[#d4af37]" />
                            Como as soluções se conectam
                          </div>

                          <div className="space-y-3">
                            <TimelineItem
                              title="Entender"
                              text="Leitura de documentos, contexto do cliente e identificação inicial de pontos sensíveis."
                            />
                            <TimelineItem
                              title="Executar"
                              text="Apoio na análise, organização do racional, estruturação de testes e documentação."
                            />
                            <TimelineItem
                              title="Revisar"
                              text="Mais clareza para revisão técnica, consistência entre evidência e conclusão e apoio à qualidade."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                        <SideInfoCard
                          title="Firmas em crescimento"
                          text="Estruture operações com mais padronização, previsibilidade e suporte aos times."
                        />
                        <SideInfoCard
                          title="Auditoria com pressão de prazo"
                          text="Reduza atrito em rotinas repetitivas e recupere tempo para análise crítica."
                        />
                        <SideInfoCard
                          title="Mais clareza na revisão"
                          text="Aproxime evidência, raciocínio e conclusão para melhorar a supervisão."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0d0d0f] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm font-medium text-[#f4e7b2]">
                Soluções do Chronos Audit
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Recursos pensados para a realidade de auditoria
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">
                Cada solução foi desenhada para unir produtividade, clareza
                metodológica e uso responsável da tecnologia no dia a dia.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {solutions.map((item) => (
                <SolutionCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0b0b0c] py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-[#f4e7b2]">Recursos</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Da preparação à revisão, com mais estrutura
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">
                O objetivo não é apenas acelerar tarefas, mas organizar o
                trabalho com mais consistência, transparência e apoio ao
                julgamento profissional.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-semibold text-white">
                  Onde a plataforma ajuda mais
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat title="Leitura" value="Assistida" />
                  <MiniStat title="Documentação" value="Estruturada" />
                  <MiniStat title="Revisão" value="Clara" />
                  <MiniStat title="Escala" value="Sustentável" />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {resources.map((item) => (
                <ResourceRow
                  key={item.title}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0d0d0f] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm font-medium text-[#f4e7b2]">Governança</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                IA aplicada com responsabilidade e supervisão
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">
                O Chronos Audit foi pensado para apoiar operações que exigem
                controle, revisão e justificativa técnica.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {governanceItems.map((item) => (
                <FeaturePill
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0b0b0c] py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(212,175,55,0.12),rgba(255,255,255,0.02),rgba(184,135,70,0.08))] p-6 shadow-2xl shadow-black/20 sm:p-8 md:p-10">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-medium text-[#f4e7b2]">
                    Vamos evoluir sua operação de auditoria
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                    Centralize inteligência, evidência e governança em um só
                    fluxo
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                    Explore o Chronos Audit para transformar processos de
                    análise, documentação e revisão com uma experiência mais
                    clara, confiável e escalável.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#d4af37] text-black hover:bg-[#c9a633]"
                  >
                    <Link href="/signup">Inscreva-se</Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="border border-white/10 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/login">Entrar</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function FeaturePill({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  )
}

function SolutionCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="group rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(255,255,255,0.03))]">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-300">{text}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm text-[#f4e7b2] opacity-80 transition group-hover:opacity-100">
        <span>Mais clareza operacional</span>
        <ChevronRight className="size-4" />
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-sm text-[#f4e7b2]">{description}</p>
    </div>
  )
}

function TimelineItem({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  )
}

function SideInfoCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-semibold text-[#f4e7b2]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  )
}

function ResourceRow({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
          <ChevronRight className="size-5 text-[#d4af37]" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-300">{text}</p>
        </div>
      </div>
    </div>
  )
}

function MiniStat({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center sm:p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="mt-2 text-lg font-semibold text-[#f4e7b2] sm:text-xl">
        {value}
      </p>
    </div>
  )
}