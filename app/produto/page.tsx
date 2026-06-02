import Link from "next/link";
import { ArrowRight, Cpu, FileSearch, GitBranch, ShieldCheck } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Navbar, defaultMenuItems, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Cpu className="size-6 text-[#d4af37]" />,
    title: "Auditoria com IA",
    description:
      "Tome decisões mais rápidas com análise automática de documentos, padrões e evidências para auditorias mais completas.",
  },
  {
    icon: <FileSearch className="size-6 text-[#d4af37]" />,
    title: "Relatórios auditáveis",
    description:
      "Gere relatórios estruturados com histórico de validações, anotações e rastreabilidade para revisão técnica.",
  },
  {
    icon: <GitBranch className="size-6 text-[#d4af37]" />,
    title: "Rastreabilidade",
    description:
      "Conecte evidências, conclusões e fluxos de trabalho para garantir trilhas de auditoria claras e confiáveis.",
  },
  {
    icon: <ShieldCheck className="size-6 text-[#d4af37]" />,
    title: "Compliance",
    description:
      "Aplique controles, normas e boas práticas em cada etapa para profissionais e comitês de auditoria.",
  },
];

export default function ProdutoPage() {
  const isAuthenticated = false;

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#050505] text-white">
      <Navbar
        menuItems={isAuthenticated ? dashboardMenuItems : defaultMenuItems}
        showAuthButtons={!isAuthenticated}
        showContactButtonMobile={!isAuthenticated}
        showUserMenu={isAuthenticated}
      />

      <div className="relative pt-24">
        <div className="absolute inset-0 -z-20">
          <BackgroundPaths />
        </div>
        <div className="absolute inset-0 -z-10 bg-[#050505]/95" />

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">
              Produto
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Auditoria inteligente com governança e evidência.
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              Chronos Audit ajuda equipes a transformar dados, documentos e resultados em relatórios auditáveis,
              rastreáveis e alinhados às melhores práticas de compliance.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c9a633]">
                <Link href="/planos">
                  <span>Ver planos</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/contato">
                  <span>Fale com especialista</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-[#d4af37] shadow-inner shadow-black/10">
                  {feature.icon}
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#070707]/80 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">O que entregamos</p>
                <h2 className="mt-5 text-3xl font-semibold text-white">Resultados que você controla.</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  Relatórios, trilhas de auditoria e controles de compliance são gerados em um único lugar, com
                  visibilidade para revisores e gestores.
                </p>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="rounded-2xl bg-[#111111] p-6">
                  <p className="text-sm text-[#d4af37]">Auditoria com IA</p>
                  <p className="mt-4 text-sm leading-7 text-zinc-300">
                    Automação das etapas repetitivas e suporte à análise documental para equipes mais rápidas.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#111111] p-6">
                  <p className="text-sm text-[#d4af37]">Relatórios auditáveis</p>
                  <p className="mt-4 text-sm leading-7 text-zinc-300">
                    Todos os resultados acompanham razão, evidências e verificações para revisão posterior.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#111111] p-6">
                  <p className="text-sm text-[#d4af37]">Rastreabilidade</p>
                  <p className="mt-4 text-sm leading-7 text-zinc-300">
                    Históricos completos de versões, edições e responsáveis, com links para cada evidência.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-semibold text-white">Compliance integrado</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  A plataforma foi pensada para apoiar equipes em auditorias internas, externas e em avaliações de
                  conformidade regulatória.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                  <li>‍• Gestão de políticas e normas internas</li>
                  <li>‍• Controle de acessos e registros de decisões</li>
                  <li>‍• Preparação de evidências para inspeções</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
