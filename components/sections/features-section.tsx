"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Users,
  BrainCircuit,
  FileSearch,
  Gauge,
  Sparkles,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="solucoes"
      className="relative border-t border-white/5 bg-[#0d0d0f] py-16 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
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
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          <Card className="col-span-full overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm lg:col-span-2">
            <CardContent className="pt-8">
              <div className="relative mx-auto flex h-24 w-56 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.04)_60%,transparent_100%)] blur-xl" />
                <span className="relative block text-5xl font-semibold text-[#f4e7b2]">
                  100%
                </span>
              </div>

              <h3 className="mt-6 text-center text-3xl font-semibold text-white">
                Adaptável
              </h3>

              <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-6 text-zinc-300">
                Estruture fluxos, revisões e evidências de acordo com a
                metodologia da sua firma.
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-full overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-8">
              <div className="relative mx-auto flex aspect-square size-28 items-center justify-center rounded-full border border-white/10 bg-black/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                <Shield className="size-12 text-[#d4af37]" strokeWidth={1.5} />
              </div>

              <div className="mt-6 space-y-2 text-center">
                <h3 className="text-lg font-medium text-white">
                  Seguro por padrão
                </h3>
                <p className="text-sm leading-6 text-zinc-300">
                  Governança, supervisão humana e rastreabilidade para apoiar o
                  uso responsável da IA na auditoria.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-8">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <Gauge className="size-5 text-[#d4af37]" />
                  <span className="text-sm font-medium text-[#f4e7b2]">
                    Performance operacional
                  </span>
                </div>

                <div className="h-28 rounded-xl border border-[#d4af37]/10 bg-[linear-gradient(180deg,rgba(212,175,55,0.10),rgba(212,175,55,0.02))] p-3">
                  <div className="flex h-full items-end gap-2">
                    <span className="h-[35%] w-full rounded-t bg-[#6f5a1a]" />
                    <span className="h-[48%] w-full rounded-t bg-[#8e7220]" />
                    <span className="h-[62%] w-full rounded-t bg-[#a88529]" />
                    <span className="h-[78%] w-full rounded-t bg-[#c49d30]" />
                    <span className="h-[92%] w-full rounded-t bg-[#d4af37]" />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-center">
                <h3 className="text-lg font-medium text-white">
                  Mais rapidez na execução
                </h3>
                <p className="text-sm leading-6 text-zinc-300">
                  Reduza esforço em tarefas repetitivas e concentre o tempo da
                  equipe em análise crítica e julgamento profissional.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm lg:col-span-3">
            <CardContent className="grid h-full gap-6 pt-8 sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-8">
                <div className="relative flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                  <BrainCircuit
                    className="size-6 text-[#d4af37]"
                    strokeWidth={1.5}
                  />
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
              </div>

              <div className="relative mt-2 rounded-2xl border border-white/10 bg-black/20 p-5 sm:mt-0">
                <div className="absolute left-4 top-3 flex gap-1">
                  <span className="block size-2 rounded-full bg-[#d4af37]/70" />
                  <span className="block size-2 rounded-full bg-white/20" />
                  <span className="block size-2 rounded-full bg-white/20" />
                </div>

                <div className="pt-5">
                  <div className="space-y-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-wide text-[#f4e7b2]">
                        Entrada
                      </p>
                      <p className="mt-1 text-sm text-zinc-300">
                        Contratos, balancetes, políticas, relatórios e
                        evidências
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-wide text-[#f4e7b2]">
                        Processamento
                      </p>
                      <p className="mt-1 text-sm text-zinc-300">
                        Classificação, sumarização e apoio à documentação
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-wide text-[#f4e7b2]">
                        Saída
                      </p>
                      <p className="mt-1 text-sm text-zinc-300">
                        Evidência estruturada e pronta para revisão
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm lg:col-span-3">
            <CardContent className="grid h-full gap-6 pt-8 sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-8">
                <div className="relative flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                  <Users className="size-6 text-[#d4af37]" strokeWidth={1.5} />
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
              </div>

              <div className="relative mt-2 sm:mt-0">
                <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 sm:block" />

                <div className="grid h-full gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-4 text-[#d4af37]" />
                      <p className="text-sm font-medium text-white">
                        Revisão coordenada
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">
                      Histórico claro de observações, ajustes e validações.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}