import Link from "next/link";
import { BookOpen, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Navbar, defaultMenuItems, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";

const topics = [
  {
    title: "Primeiros passos",
    description: "Comece a usar a plataforma com confiança e descubra os recursos essenciais.",
    icon: BookOpen,
  },
  {
    title: "Perguntas frequentes",
    description: "Respostas rápidas para dúvidas comuns sobre auditoria, relatórios e compliance.",
    icon: MessageCircle,
  },
  {
    title: "Políticas de uso",
    description: "Entenda os requisitos de segurança, privacidade e governança da plataforma.",
    icon: ShieldCheck,
  },
];

export default function CentralDeAjudaPage() {
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
            <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Central de ajuda</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Encontre suporte, respostas e guias práticos.
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              Acesse conteúdos desenvolvidos para acelerar seu entendimento da plataforma e solucionar dúvidas do dia a dia.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-2xl bg-[#0f0f12] px-4 py-3 text-[#d4af37] shadow-inner shadow-black/10">
                <Search className="size-5" />
                <span className="text-sm">Busque por palavras chave</span>
              </div>
              <div className="flex-1 rounded-2xl border border-white/10 bg-[#09090b] p-4 text-sm text-zinc-400">
                Digite termos como “relatórios”, “compliance” ou “rastreabilidade” para encontrar o conteúdo certo.
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-[#d4af37] shadow-inner shadow-black/10">
                  <topic.icon className="size-6" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-white">{topic.title}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">{topic.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-[#0d0d0f]/90 p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Precisa de algo mais específico?</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Fale com o nosso time de atendimento.</h2>
              </div>
              <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c9a633]">
                <Link href="/contato">
                  <span>Solicitar suporte</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
