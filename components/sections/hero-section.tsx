"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Clock3,
  BrainCircuit,
  FileSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { cn } from "@/lib/utils"
import { Header } from "./header"
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


export function HeroSection() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-[#0b0b0c] text-white">
        <section className="relative">
          <div className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36">
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
                    href="/recursos"
                    className="group mx-auto inline-flex max-w-full items-center gap-3 rounded-full border border-[#d4af37]/20 bg-white/5 px-3 py-2 text-left shadow-md shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/10 sm:gap-4 sm:pl-4"
                  >
                    <span className="text-xs text-[#f4e7b2] sm:text-sm">
                      IA responsável para auditoria, risco e evidência
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
                    Auditoria inteligente com{" "}
                    <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                      governança, rastreabilidade
                    </span>{" "}
                    e precisão
                  </h1>

                  <p className="mx-auto mt-5 max-w-3xl text-balance text-base leading-7 text-zinc-300 sm:mt-6 sm:text-lg md:text-xl md:leading-8">
                    O Chronos Audit apoia firmas e auditores independentes no
                    uso ético e responsável da inteligência artificial em
                    planejamento, execução, análise de riscos e documentação de
                    evidências.
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
                      <Link href="/signup">
                        <span className="text-nowrap">Inscreva-se</span>
                      </Link>
                    </Button>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-12 rounded-[14px] border border-white/10 px-6 text-sm text-white hover:bg-white/10 hover:text-white sm:text-base"
                  >
                    <Link href="/login">
                      <span className="text-nowrap">Entrar</span>
                    </Link>
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
                    title="Governança"
                    text="Fluxos auditáveis com controle, consistência e responsabilidade."
                  />
                  <FeaturePill
                    icon={<BrainCircuit className="size-5 text-[#d4af37]" />}
                    title="IA aplicada"
                    text="Apoio na leitura, análise e estruturação de julgamentos profissionais."
                  />
                  <FeaturePill
                    icon={<FileSearch className="size-5 text-[#d4af37]" />}
                    title="Rastreabilidade"
                    text="Evidências organizadas, recuperáveis e prontas para revisão."
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
                    <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#f4e7b2]">
                              Painel de Auditoria
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                              Evidências, riscos e IA em um só fluxo
                            </h3>
                          </div>

                          <div className="w-fit rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#f4e7b2]">
                            Chronos Audit
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          <DashboardCard
                            title="Riscos relevantes"
                            value="18"
                            description="Mapeados e priorizados"
                          />
                          <DashboardCard
                            title="Papéis gerados"
                            value="126"
                            description="Com rastreabilidade"
                          />
                          <DashboardCard
                            title="Eficiência"
                            value="+42%"
                            description="Em rotinas repetitivas"
                          />
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm text-zinc-300">
                            <Clock3 className="size-4 text-[#d4af37]" />
                            Linha de trabalho assistida por IA
                          </div>

                          <div className="space-y-3">
                            <TimelineItem
                              title="Planejamento"
                              text="Leitura inicial de documentos, compreensão do negócio e identificação de áreas críticas."
                            />
                            <TimelineItem
                              title="Execução"
                              text="Apoio na análise de dados, testes, cruzamentos e organização de evidências."
                            />
                            <TimelineItem
                              title="Conclusão"
                              text="Documentação estruturada, rastreável e alinhada à revisão de qualidade."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                        <SideInfoCard
                          title="Uso ético da IA"
                          text="Aplicação com supervisão humana, governança e transparência metodológica."
                        />
                        <SideInfoCard
                          title="Empresas que usam IA"
                          text="Avaliação dos processos automatizados e dos riscos associados à tecnologia."
                        />
                        <SideInfoCard
                          title="Simplicidade e escala"
                          text="Solução pensada para a realidade das firmas brasileiras."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0d0d0f] py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6 flex flex-col items-center justify-between gap-3 text-center sm:mb-8 md:flex-row md:text-left">
              <div>
                <p className="text-sm font-medium text-[#f4e7b2]">
                  Plataforma focada em auditoria
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Estrutura pensada para governança, evidências e revisão.
                </p>
              </div>

              <Link
                href="/solucoes"
                className="inline-flex items-center text-sm text-[#f4e7b2] transition hover:opacity-80"
              >
                <span>Explorar soluções do Chronos Audit</span>
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <MiniStat title="IA responsável" value="100%" />
              <MiniStat title="Rastreabilidade" value="Completa" />
              <MiniStat title="Foco" value="Auditoria" />
              <MiniStat title="Escalabilidade" value="Alta" />
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