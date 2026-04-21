"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Shield,
  Users,
  BrainCircuit,
  FileSearch,
  Gauge,
  Sparkles,
} from "lucide-react"

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const innerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const dashboardItemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.15 + index * 0.12,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

const bars = ["35%", "48%", "62%", "78%", "92%"]

export function FeaturesSection() {
  return (
    <section
      id="solucoes"
      className="relative border-t border-white/5 bg-[#0d0d0f] py-16 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-1 text-sm text-[#f4e7b2]">
            Recursos da plataforma
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Recursos pensados para uma auditoria mais inteligente
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-300 md:text-lg">
            O Chronos Audit une inteligência artificial, rastreabilidade e
            governança em uma experiência moderna para apoiar firmas e auditores
            em todas as etapas do trabalho.
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-6"
        >
          <AnimatedCard className="col-span-full lg:col-span-2">
            <CardContent className="pt-8">
              <motion.div
                variants={innerVariants}
                className="relative mx-auto flex h-24 w-56 items-center justify-center"
              >
                <motion.div
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [0.98, 1.04, 0.98],
                  }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.04)_60%,transparent_100%)] blur-xl"
                />

                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.15,
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                  }}
                  className="relative block text-5xl font-semibold text-[#f4e7b2]"
                >
                  100%
                </motion.span>
              </motion.div>

              <motion.h3
                variants={innerVariants}
                className="mt-6 text-center text-3xl font-semibold text-white"
              >
                Adaptável
              </motion.h3>

              <motion.p
                variants={innerVariants}
                className="mx-auto mt-3 max-w-xs text-center text-sm leading-6 text-zinc-300"
              >
                Estruture fluxos, revisões e evidências de acordo com a
                metodologia da sua firma.
              </motion.p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard className="col-span-full sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-8">
              <motion.div
                variants={innerVariants}
                className="relative mx-auto flex aspect-square size-28 items-center justify-center rounded-full border border-white/10 bg-black/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5"
              >
                <motion.div
                  animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.03, 1] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Shield className="size-12 text-[#d4af37]" strokeWidth={1.5} />
                </motion.div>
              </motion.div>

              <motion.div
                variants={innerVariants}
                className="mt-6 space-y-2 text-center"
              >
                <h3 className="text-lg font-medium text-white">
                  Seguro por padrão
                </h3>
                <p className="text-sm leading-6 text-zinc-300">
                  Governança, supervisão humana e rastreabilidade para apoiar o
                  uso responsável da IA na auditoria.
                </p>
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard className="col-span-full sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-8">
              <motion.div
                variants={innerVariants}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 8, 0, -8, 0] }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Gauge className="size-5 text-[#d4af37]" />
                  </motion.div>

                  <span className="text-sm font-medium text-[#f4e7b2]">
                    Performance operacional
                  </span>
                </div>

                <div className="h-28 rounded-xl border border-[#d4af37]/10 bg-[linear-gradient(180deg,rgba(212,175,55,0.10),rgba(212,175,55,0.02))] p-3">
                  <div className="flex h-full items-end gap-2">
                    {bars.map((height, index) => (
                      <motion.span
                        key={height}
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={[
                          "w-full rounded-t",
                          index === 0 && "bg-[#6f5a1a]",
                          index === 1 && "bg-[#8e7220]",
                          index === 2 && "bg-[#a88529]",
                          index === 3 && "bg-[#c49d30]",
                          index === 4 && "bg-[#d4af37]",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={innerVariants}
                className="mt-6 space-y-2 text-center"
              >
                <h3 className="text-lg font-medium text-white">
                  Mais rapidez na execução
                </h3>
                <p className="text-sm leading-6 text-zinc-300">
                  Reduza esforço em tarefas repetitivas e concentre o tempo da
                  equipe em análise crítica e julgamento profissional.
                </p>
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard className="col-span-full lg:col-span-3">
            <CardContent className="grid h-full gap-6 pt-8 sm:grid-cols-2">
              <motion.div
                variants={innerVariants}
                className="relative z-10 flex flex-col justify-between space-y-8"
              >
                <div className="relative flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <BrainCircuit
                      className="size-6 text-[#d4af37]"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">
                    IA aplicada com contexto
                  </h3>
                  <p className="text-sm leading-6 text-zinc-300">
                    Apoio na leitura de documentos, organização de evidências,
                    análise inicial de riscos e estruturação de papéis de
                    trabalho.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={innerVariants}
                className="relative mt-2 rounded-2xl border border-white/10 bg-black/20 p-5 sm:mt-0"
              >
                <div className="absolute left-4 top-3 flex gap-1">
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="block size-2 rounded-full bg-[#d4af37]/70"
                  />
                  <span className="block size-2 rounded-full bg-white/20" />
                  <span className="block size-2 rounded-full bg-white/20" />
                </div>

                <div className="pt-5">
                  <div className="space-y-3">
                    {[
                      {
                        title: "Entrada",
                        text: "Contratos, balancetes, políticas, relatórios e evidências",
                      },
                      {
                        title: "Processamento",
                        text: "Classificação, sumarização e apoio à documentação",
                      },
                      {
                        title: "Saída",
                        text: "Evidência estruturada e pronta para revisão",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        custom={index}
                        variants={dashboardItemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-[#f4e7b2]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-300">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard className="col-span-full lg:col-span-3">
            <CardContent className="grid h-full gap-6 pt-8 sm:grid-cols-2">
              <motion.div
                variants={innerVariants}
                className="relative z-10 flex flex-col justify-between space-y-8"
              >
                <div className="relative flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                  <motion.div
                    animate={{ y: [0, -2, 0], scale: [1, 1.04, 1] }}
                    transition={{
                      duration: 4.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Users className="size-6 text-[#d4af37]" strokeWidth={1.5} />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">
                    Colaboração com segurança
                  </h3>
                  <p className="text-sm leading-6 text-zinc-300">
                    Compartilhe análises, trilhas de revisão e achados com mais
                    clareza entre equipe, supervisores e revisores.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={innerVariants} className="relative mt-2 sm:mt-0">
                <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 sm:block" />

                <div className="grid h-full gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-4 text-[#d4af37]" />
                      <p className="text-sm font-medium text-white">
                        Revisão coordenada
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">
                      Histórico claro de observações, ajustes e validações.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.28, duration: 0.5 }}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileSearch className="size-4 text-[#d4af37]" />
                      <p className="text-sm font-medium text-white">
                        Busca rápida
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">
                      Localize evidências, documentos e pontos críticos com mais
                      rapidez.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </CardContent>
          </AnimatedCard>
        </motion.div>
      </div>
    </section>
  )
}

function AnimatedCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className={className}
    >
      <Card className="h-full overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/20">
        {children}
      </Card>
    </motion.div>
  )
}