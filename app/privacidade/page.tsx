"use client";

import Link from "next/link";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Navbar, defaultMenuItems, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const policies = [
  {
    title: "Dados coletados",
    description:
      "Coletamos informações essenciais para fornecer o serviço, incluindo dados de conta, auditoria e registros de uso da plataforma.",
  },
  {
    title: "Uso dos dados",
    description:
      "Os dados são utilizados para gerar relatórios, manter a rastreabilidade de auditorias e melhorar a experiência do usuário.",
  },
  {
    title: "Proteção de informações",
    description:
      "Adotamos controles de segurança para proteger os dados contra acesso não autorizado, perdas e alterações indevidas.",
  },
];

export default function PrivacidadePage() {
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
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Privacidade</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Política de privacidade
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              Saiba como a Chronos Audit protege suas informações e garante privacidade em todas as etapas da auditoria.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c9a633]">
                <Link href="/suporte">
                  <span>Ajuda</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/contato">
                  <span>Entrar em contato</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {policies.map((policy) => (
              <div key={policy.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20">
                <h2 className="text-xl font-semibold text-white">{policy.title}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">{policy.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
