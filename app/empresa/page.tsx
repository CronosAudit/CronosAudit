"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, LifeBuoy, MessageCircle } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Navbar, defaultMenuItems, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const cards = [
  {
    title: "Sobre",
    text: "Conheça nossa missão de apoiar auditorias com tecnologia, transparência e controles sólidos.",
    icon: Briefcase,
    href: "/empresa#sobre",
  },
  {
    title: "Planos",
    text: "Escolha o modelo que melhor se encaixa na sua equipe e tenha acesso a relatórios e auditorias aceleradas.",
    icon: BookOpen,
    href: "/planos",
  },
  {
    title: "Contato",
    text: "Fale com um especialista para tirar dúvidas, solicitar demo ou planejar a implantação.",
    icon: MessageCircle,
    href: "/contato",
  },
  {
    title: "Ajuda",
    text: "Encontre guias, respostas rápidas e suporte para usar a plataforma com confiança.",
    icon: LifeBuoy,
    href: "/central-de-ajuda",
  },
];

export default function EmpresaPage() {
  const { isAuthenticated } = useAuth();

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
            <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Empresa</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Chronos Audit é a sua parceira em auditoria moderna.
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              Somos uma plataforma que une experiência em auditoria, inteligência artificial e governança para tornar seus
              processos mais seguros, rastreáveis e preparados para qualquer verificação.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c9a633]">
                <Link href="/planos">
                  <span>Ver planos</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/contato">
                  <span>Entrar em contato</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-[#d4af37] shadow-inner shadow-black/10">
                  <card.icon className="size-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{card.text}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#d4af37]">
                  Ver mais
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="sobre" className="border-t border-white/10 bg-[#070707]/80 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Sobre</p>
                <h2 className="mt-5 text-3xl font-semibold text-white">Missão e propósito</h2>
                <p className="mt-6 text-sm leading-7 text-zinc-400">
                  Criar uma plataforma que combine análise inteligente, controle operacional e transparência para que
                  equipes de auditoria possam entregar resultados seguros e escaláveis.
                </p>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8">
                <div>
                  <h3 className="text-lg font-semibold text-white">Compromisso com o controle</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Nosso foco é garantir que cada evidência e conclusão tenha contexto claro, rastreabilidade e
                    conformidade interna.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Equipe orientada por auditoria</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Trabalhamos com metodologias de auditoria e tecnologia para entregar suporte prático ao dia a dia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
