import Link from "next/link";
import { FileText, FileSearch, Globe, Layers, ShieldCheck } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Navbar, defaultMenuItems, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";

const docs = [
  {
    title: "Guia da plataforma",
    description: "Visão geral das principais funcionalidades e como começar a usar o Chronos Audit.",
    icon: FileText,
  },
  {
    title: "Documentação técnica",
    description: "Detalhes sobre integração de dados, cargas de documento e exportação de relatórios.",
    icon: FileSearch,
  },
  {
    title: "Compliance e segurança",
    description: "Recomendações para uso responsável, gerenciamento de acesso e políticas internas.",
    icon: ShieldCheck,
  },
  {
    title: "Fluxos e processos",
    description: "Como a plataforma organiza etapas de auditoria, revisões e entrega de evidências.",
    icon: Layers,
  },
];

export default function DocumentacaoPage() {
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
            <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Documentação</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Tudo o que você precisa para usar o Chronos Audit.
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              Acesse guias, práticas recomendadas e conteúdos de apoio para estruturar auditorias, gerar relatórios e manter
              a conformidade.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c9a633]">
                <Link href="/suporte">
                  <span>Ir para suporte</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/central-de-ajuda">
                  <span>Central de ajuda</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {docs.map((doc) => (
              <div
                key={doc.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-[#d4af37] shadow-inner shadow-black/10">
                  <doc.icon className="size-6" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-white">{doc.title}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">{doc.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#070707]/80 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Base de conhecimento</p>
                <h2 className="mt-5 text-3xl font-semibold text-white">Respostas rápidas para sua equipe.</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  A documentação foi organizada para facilitar a busca por procedimentos, definições de auditoria e usos
                  da plataforma.
                </p>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8">
                <div>
                  <h3 className="text-lg font-semibold text-white">Tutoriais passo a passo</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Comece com os principais fluxos e avance para ajustes de processo e integração de dados.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">API e integrações</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Consulte os endpoints disponíveis e saiba como conectar informações de forma segura.
                  </p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-lg font-semibold text-white">Pronto para ir mais longe</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  Se precisar de apoio adicional, nosso suporte está disponível para orientar a implantação e o uso.
                </p>
                <div className="mt-8 space-y-3">
                  <Link href="/suporte" className="text-sm font-medium text-[#d4af37] hover:text-[#f4e7b2]">
                    Suporte técnico
                  </Link>
                  <Link href="/central-de-ajuda" className="text-sm font-medium text-[#d4af37] hover:text-[#f4e7b2]">
                    Central de ajuda
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
