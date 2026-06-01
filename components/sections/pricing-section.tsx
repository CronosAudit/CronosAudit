// components/sections/pricing-section.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { Check, Star, AlertCircle, X } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PricingSectionProps = {
  isAuthenticated?: boolean;
};

const plans = [
  {
    name: "BÁSICO",
    price: "R$500",
    features: [
      "Acesso à plataforma Chronos Audit",
      "Geração de relatórios de auditoria assistidos por IA",
      "Relatório de rastreabilidade e explicação do processo da IA (auditável)",
      "Suporte por e-mail",
      "Ajuda básica na configuração de IA em cloud",
    ],
    theme: "gray",
  },
  {
    name: "PROFISSIONAL",
    price: "R$700",
    features: [
      "Tudo do BÁSICO +",
      "Suporte em tempo real, em horário comercial",
      "Ajuda completa na configuração de máquina virtual dedicada",
      "Assistência na configuração da IA",
      "Suporte na integração com IA já utilizada pela empresa",
    ],
    theme: "Pro",
    popular: true,
  },
  {
    name: "VIP",
    price: "R$1.000",
    features: [
      "Tudo do PROFISSIONAL +",
      "Atendimento prioritário 24 horas por dia, 7 dias por semana",
      "Acesso a valores VIP para IA e máquinas virtuais",
      "Acesso a máquinas virtuais mais potentes",
      "Apoio em compliance, governança e rastreabilidade avançada",
    ],
    theme: "Vip",
  },
];

const comparisonData = [
  {
    feature: "Plataforma Chronos Audit",
    basico: true,
    profissional: true,
    vip: true,
  },
  {
    feature: "Relatórios de auditoria com IA",
    basico: true,
    profissional: true,
    vip: true,
  },
  {
    feature: "Relatório auditável da IA",
    basico: true,
    profissional: true,
    vip: true,
  },
  {
    feature: "Suporte por e-mail",
    basico: true,
    profissional: true,
    vip: true,
  },
  {
    feature: "Suporte em tempo real",
    basico: false,
    profissional: "Horário comercial",
    vip: "24h",
  },
  {
    feature: "Configuração de IA cloud",
    basico: "Básica",
    profissional: "Completa",
    vip: "Avançada",
  },
  {
    feature: "Configuração de máquina virtual",
    basico: false,
    profissional: true,
    vip: true,
  },
  {
    feature: "Instância fechada de IA",
    basico: false,
    profissional: true,
    vip: true,
  },
  {
    feature: "Máquinas virtuais potentes",
    basico: false,
    profissional: false,
    vip: true,
  },
  {
    feature: "Valores VIP de infraestrutura",
    basico: false,
    profissional: false,
    vip: true,
  },
  {
    feature: "Atendimento prioritário",
    basico: false,
    profissional: true,
    vip: true,
  },
  {
    feature: "Indicado para",
    basico: "Pequenas empresas",
    profissional: "Médias empresas",
    vip: "Grandes empresas",
  },
];

export function PricingSection({
  isAuthenticated = false,
}: PricingSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 bg-gradient-to-r from-[#F7E6A0] via-[#E8CE77] to-[#D9B74A] bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl"
          >
            Escolha o seu plano
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-zinc-400 md:text-xl"
          >
            Soluções completas para sua jornada de auditoria.
          </motion.p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-1 size-6 shrink-0 text-[#C9A633]" />

            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-zinc-400">
                *Toda máquina virtual já possui instalada um modelo de IA
                escolhido pelo cliente.
              </p>

              <p className="text-sm leading-relaxed text-zinc-400">
                **Serviços de IA são instâncias privadas, sem compartilhamento
                de dados públicos, de serviços atuais como: ChatGPT, Gemini,
                Copilot, entre outros.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Compare os Recursos
            </h2>

            <p className="text-zinc-500">
              Veja detalhadamente o que cada plano oferece para sua empresa.
            </p>
          </div>

          <PricingComparisonTable />
        </div>
      </div>
    </section>
  );
}

function PricingComparisonTable() {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-6 text-sm font-semibold text-zinc-400">
              Recurso
            </th>

            <th className="p-6 text-center text-sm font-bold uppercase tracking-wider text-white">
              Básico
            </th>

            <th className="p-6 text-center text-sm font-bold uppercase tracking-wider text-[#C9A633]">
              Profissional
            </th>

            <th className="p-6 text-center text-sm font-bold uppercase tracking-wider text-white">
              VIP
            </th>
          </tr>
        </thead>

        <tbody>
          {comparisonData.map((item, index) => (
            <tr
              key={item.feature}
              className={cn(
                "border-b border-white/5 transition-colors hover:bg-white/[0.02]",
                index === comparisonData.length - 1 && "border-0",
              )}
            >
              <td className="p-6 text-sm font-medium text-zinc-300">
                {item.feature}
              </td>

              <td className="p-6 text-center">
                <StatusIcon value={item.basico} />
              </td>

              <td className="bg-[#C9A633]/5 p-6 text-center">
                <StatusIcon value={item.profissional} isPrimary />
              </td>

              <td className="p-6 text-center">
                <StatusIcon value={item.vip} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusIcon({
  value,
  isPrimary,
}: {
  value: any;
  isPrimary?: boolean;
}) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <Check
          className={cn(
            "size-5",
            isPrimary ? "text-[#C9A633]" : "text-emerald-500",
          )}
        />
      </div>
    );
  }

  if (value === false) {
    return (
      <div className="flex justify-center">
        <X className="size-5 text-zinc-600" />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold",
        isPrimary
          ? "border-[#C9A633]/20 bg-[#C9A633]/5 text-[#C9A633]"
          : "border-white/10 bg-white/5 text-zinc-400",
      )}
    >
      {value}
    </span>
  );
}

function PricingCard({
  plan,
  index,
  isAuthenticated,
}: {
  plan: any;
  index: number;
  isAuthenticated: boolean;
}) {
  const isPro = plan.theme === "Pro";
  const isVip = plan.theme === "Vip";

  const ctaHref = isAuthenticated ? "/dashboard" : isVip ? "/contato" : "/signup";
  const ctaLabel = isAuthenticated
    ? "Ir para dashboard"
    : isVip
      ? "Consultar vendas"
      : "Começar Agora";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col rounded-[24px] border p-8 transition-all duration-300",
        isPro
          ? "border-[#C9A633]/50 bg-black shadow-[0_0_40px_rgba(201,166,51,0.15)]"
          : isVip
            ? "border-[#F4E7B2]/50 bg-[#9D812B]/20 shadow-[0_0_40px_rgba(244,231,178,0.15)] backdrop-blur-sm"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
      )}
    >
      {plan.popular && (
        <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-[#C9A633] px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(201,166,51,0.4)]">
          <Star className="size-3 fill-current" />
          Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="mb-1 text-xl font-bold uppercase text-white">
          {plan.name}
        </h3>

        <div className="mb-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{plan.price}</span>
          <span className="text-sm text-zinc-500">/mês</span>
        </div>
      </div>

      <div className="mb-10 flex-grow space-y-4">
        {plan.features.map((feature: string) => (
          <div key={feature} className="flex gap-3">
            <div
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border",
                isPro
                  ? "border-[#C9A633]/30 bg-[#C9A633]/10 text-[#C9A633]"
                  : isVip
                    ? "border-[#F4E7B2]/30 bg-[#F4E7B2]/10 text-[#F4E7B2]"
                    : "border-white/10 bg-white/5 text-zinc-400",
              )}
            >
              <Check className="size-3" strokeWidth={3} />
            </div>

            <span className="text-sm leading-tight text-zinc-300">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-8 flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#C9A633]" />

        <div className="space-y-2">
          <p className="text-[11px] leading-normal text-zinc-500">
            Os preços mencionados são referentes à assinatura do Chronos Audit.
            A contratação de máquinas virtuais* e serviços de IA** é necessária
            e irá incorrer em custos adicionais.
          </p>

          <div className="space-y-1">
            {isVip ? (
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C9A633]">
                Preços especiais, consultar vendas
              </p>
            ) : (
              <>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#C9A633]">
                  Máquinas Virtuais — A partir de R$200,00/mês
                </p>

                <p className="text-[9px] font-bold uppercase tracking-wider text-[#C9A633]">
                  Serviços de IA — A partir de R$50,00/mês
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <Button
        asChild
        className={cn(
          "w-full rounded-[14px] py-6 text-sm font-bold transition-all duration-300",
          isPro
            ? "bg-[#C9A633] text-black shadow-[0_0_20px_rgba(201,166,51,0.2)] hover:bg-[#E8CE77]"
            : isVip
              ? "bg-white text-black shadow-[0_0_20px_rgba(244,231,178,0.2)] hover:bg-white/60"
              : "border border-white/10 bg-white/10 text-white hover:bg-white/20",
        )}
      >
        <Link href={ctaHref} className="inline-flex items-center justify-center">
          <span>{ctaLabel}</span>

          <motion.span
            className="ml-2 inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </Link>
      </Button>
    </motion.div>
  );
}