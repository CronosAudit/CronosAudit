"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Clock3,
  BrainCircuit,
  FileSearch,
  Hourglass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { cn } from "@/lib/utils"
import { BackgroundPaths } from "@/components/ui/background-paths"
import type { Variants } from "framer-motion"

const transitionVariants: { container?: Variants; item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.2,
      },
    },
  },
}

const menuItems = [
  { name: "Soluções", href: "#solucoes" },
  { name: "Recursos", href: "#recursos" },
  { name: "Governança", href: "#governanca" },
  { name: "Contato", href: "#contato" },
  { name: "Chat", href: "/chat" },
]

export function HeroSection() {
  return (
    <>
      <HeroHeader />

      <main className="overflow-hidden bg-[#0b0b0c] text-white">
        <section className="relative">
          <div className="relative pt-28 md:pt-36">
            <div className="absolute inset-0 -z-20">
              <BackgroundPaths />
            </div>

            <div className="absolute inset-0 -z-10 bg-[#0b0b0c]/88" />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="absolute left-[-8rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.06)_35%,transparent_72%)] blur-3xl" />
              <div className="absolute right-[-10rem] top-[10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(120,119,108,0.14)_0%,rgba(120,119,108,0.06)_40%,transparent_75%)] blur-3xl" />
              <div className="absolute bottom-[-12rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(166,124,82,0.14)_0%,rgba(166,124,82,0.04)_45%,transparent_75%)] blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_100%,transparent_0%,#0b0b0c_62%)]" />
            </div>

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#recursos"
                    className="group mx-auto flex w-fit items-center gap-4 rounded-full border border-[#d4af37]/20 bg-white/5 p-1 pl-4 shadow-md shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/10"
                  >
                    <span className="text-sm text-[#f4e7b2]">
                      IA responsável para auditoria, risco e evidência
                    </span>

                    <span className="block h-4 w-px bg-[#d4af37]/30" />

                    <div className="size-6 overflow-hidden rounded-full bg-[#d4af37] text-black duration-500">
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

                  <h1 className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-6xl xl:text-[5.25rem]">
                    Auditoria inteligente com{" "}
                    <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                      governança, rastreabilidade
                    </span>{" "}
                    e precisão
                  </h1>

                  <p className="mx-auto mt-8 max-w-3xl text-balance text-lg text-zinc-300 md:text-xl">
                    O Cronos Audit apoia firmas e auditores independentes no
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
                          delayChildren: 0.35,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-3 md:flex-row"
                >
                  <div className="rounded-[16px] border border-[#d4af37]/30 bg-gradient-to-b from-[#d4af37]/20 to-[#b88746]/10 p-0.5 shadow-lg shadow-[#d4af37]/10">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-[14px] bg-[#d4af37] px-6 text-base font-semibold text-black hover:bg-[#c9a633]"
                    >
                      <Link href="#contato">
                        <span className="text-nowrap">
                          Solicitar demonstração
                        </span>
                      </Link>
                    </Button>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="rounded-[14px] border border-white/10 px-6 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href="#solucoes">
                      <span className="text-nowrap">
                        Conhecer a plataforma
                      </span>
                    </Link>
                  </Button>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.06,
                          delayChildren: 0.45,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3"
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
                      delayChildren: 0.55,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-10 overflow-hidden px-2 sm:mt-14 md:mt-20">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[#0b0b0c]"
                />

                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111214]/95 p-3 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm">
                  <div className="rounded-[24px] border border-[#d4af37]/15 bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,255,255,0.02),rgba(184,135,70,0.06))] p-6 md:p-8">
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#f4e7b2]">
                              Painel de Auditoria
                            </p>
                            <h3 className="mt-1 text-xl font-semibold text-white">
                              Evidências, riscos e IA em um só fluxo
                            </h3>
                          </div>
                          <div className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#f4e7b2]">
                            Cronos Audit
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
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

                      <div className="space-y-4">
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

        <section className="border-t border-white/5 bg-[#0d0d0f] pb-16 pt-16 md:pb-24">
          <div className="group relative mx-auto max-w-6xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href="#solucoes"
                className="text-sm text-[#f4e7b2] duration-150 hover:opacity-80"
              >
                <span>Explorar soluções do Cronos Audit</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>

            <div className="mx-auto mt-2 grid max-w-4xl grid-cols-2 gap-4 transition-all duration-500 group-hover:opacity-50 md:grid-cols-4">
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

function HeroHeader() {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="group fixed z-50 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-4 transition-all duration-300 sm:px-6 lg:px-8",
            isScrolled &&
              "max-w-5xl rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center">
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-2 block cursor-pointer p-2.5 text-white lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 opacity-0 duration-200 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-zinc-300 transition duration-150 hover:text-[#f4e7b2]"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 bg-[#121214] p-6 shadow-2xl shadow-black/30 group-data-[state=active]:block md:flex-nowrap lg:mb-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-zinc-300 transition duration-150 hover:text-[#f4e7b2]"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white",
                    isScrolled && "lg:hidden"
                  )}
                >
                  <Link href="#contato">
                    <span>Falar com especialista</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "bg-[#d4af37] text-black hover:bg-[#c9a633]",
                    isScrolled && "lg:hidden"
                  )}
                >
                  <Link href="#solucoes">
                    <span>Ver plataforma</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "hidden bg-[#d4af37] text-black hover:bg-[#c9a633]",
                    isScrolled && "lg:inline-flex"
                  )}
                >
                  <Link href="#contato">
                    <span>Agendar demo</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 via-[#b88746]/10 to-transparent text-[#d4af37] shadow-lg shadow-[#d4af37]/10">
        <Hourglass className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-[0.22em] text-[#f4e7b2]">
          CRONOS
        </p>
        <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">
          Audit
        </p>
      </div>
    </div>
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
        <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
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
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="mt-2 text-xl font-semibold text-[#f4e7b2]">{value}</p>
    </div>
  )
}