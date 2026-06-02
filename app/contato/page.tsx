"use client";

import { BackgroundPaths } from "@/components/ui/background-paths";
import {
  Navbar,
  defaultMenuItems,
  dashboardMenuItems,
} from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Globe } from "lucide-react";
import Image from "next/image";
import Footer4Col from "@/components/ui/footer-column";

interface TeamMember {
  id: number;
  name: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Victor Rosetti",
    image: "/victor.png",
  },
  {
    id: 2,
    name: "Vinicius Binda",
    image: "/vbinda.png",
  },
  {
    id: 3,
    name: "Bruno Dourado",
    image: "/bruno.png",
  },
  {
    id: 4,
    name: "Vinicius Nishimura",
    image: "/nishimura.png",
  },
  {
    id: 5,
    name: "Felipe Martins",
    image: "/felipe.png",
  },
  {
    id: 6,
    name: "Mauricio Suster",
    image: "/suster.png",
  },
];

const whatsappMessage = encodeURIComponent(
  "Olá! Gostaria de conhecer a plataforma Chronos Audit e entender como ela pode apoiar auditorias, compliance, governança e gestão de riscos.",
);

const contactInfo = {
  whatsapp: "+55 (27) 99903-2832",
  whatsappLink: `https://wa.me/5527999032832?text=${whatsappMessage}`,
  email: "Victor.Quiroz@fecap.br",
  website: "www.chronosaudit.com.br",
};

export default function ContatoPage() {
  const isAuthenticated = false;

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#050505] text-white">
      <Navbar
        menuItems={isAuthenticated ? dashboardMenuItems : defaultMenuItems}
        showAuthButtons={!isAuthenticated}
        showContactButtonMobile={!isAuthenticated}
        showUserMenu={isAuthenticated}
      />

      <div className="relative flex-1 pt-24">
        <div className="absolute inset-0 -z-20">
          <BackgroundPaths />
        </div>

        <div className="absolute inset-0 -z-10 bg-[#050505]/95" />

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-[#f4e7b2]/80">
              Equipe
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Conheça nosso time
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
              Profissionais especializados em auditoria, compliance,
              rastreabilidade e inteligência artificial aplicada à governança.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    <div className="relative h-24 w-24">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20 backdrop-blur">
                <h3 className="mb-6 text-xl font-semibold text-white">
                  Entre em contato
                </h3>

                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                    <MessageCircle className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">WhatsApp</p>
                    <a
                      href={contactInfo.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-white transition hover:text-[#ffc65c]"
                    >
                      {contactInfo.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                    <Mail className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="break-all text-base font-medium text-white transition hover:text-[#ffc65c]"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-white/10 pt-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc65c]/20 text-[#ffc65c]">
                    <Globe className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">Website</p>
                    <a
                      href={`https://${contactInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-base font-medium text-white transition hover:text-[#ffc65c]"
                    >
                      {contactInfo.website}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20 backdrop-blur">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-36 w-36 items-center justify-center rounded-2xl border border-white/20 bg-white p-2">
                    <Image
                      src="/whatsapp-qr-code.png"
                      alt="QR Code do WhatsApp Chronos Audit"
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-xl object-contain"
                    />
                  </div>

                  <p className="text-center text-sm text-zinc-400">
                    Escaneie para conversar conosco no WhatsApp.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
      <Footer4Col />
    </main>
  );
}
