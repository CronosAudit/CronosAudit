import Link from "next/link";
import { Headphones, ShieldCheck, Sparkles } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Navbar, defaultMenuItems, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Suporte técnico",
    description:
      "Receba orientação rápida sobre funcionalidades, problemas de uso e ajustes na configuração.",
    icon: Headphones,
  },
  {
    title: "Segurança e compliance",
    description:
      "Entenda como proteger seus dados, gerenciar acessos e manter a conformidade enquanto usa a plataforma.",
    icon: ShieldCheck,
  },
  {
    title: "Boas práticas",
    description:
      "Acesse recomendações para estruturar auditorias, revisar evidências e preparar relatórios confiáveis.",
    icon: Sparkles,
  },
];

export default function SuportePage() {
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
            <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Suporte</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Conte com nosso suporte sempre que precisar.
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              Nossa equipe está pronta para ajudar na resolução de dúvidas, no uso da plataforma e no acompanhamento
              do seu projeto de auditoria.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c9a633]">
                <Link href="/contato">
                  <span>Fale com a equipe</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/central-de-ajuda">
                  <span>Ver central de ajuda</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {resources.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center transition hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/10"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-[#d4af37] shadow-inner shadow-black/10">
                  <item.icon className="size-7" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#070707]/80 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">Como podemos ajudar</p>
                <h2 className="mt-5 text-3xl font-semibold text-white">Atendimento focado no seu sucesso.</h2>
                <p className="mt-6 text-sm leading-7 text-zinc-400">
                  A equipe de suporte se dedica a responder com clareza, acompanhar seu processo de implantação e garantir
                  que sua auditoria siga com segurança e eficiência.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#d4af37]">Canais disponíveis</p>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      Email, chat e atendimento agendado para demandas técnicas e de operação.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#d4af37]">Tempo de resposta</p>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      Priorizamos retornos rápidos para solicitações de suporte e dúvidas de uso da plataforma.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#d4af37]">Recursos complementares</p>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      Conteúdos, FAQs e tutoriais que ajudam a resolver questões sem perder tempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
