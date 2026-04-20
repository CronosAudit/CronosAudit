"use client"

import React from "react"
import { Check, Star, AlertCircle, X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
]

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
]

export function PricingSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-[#F7E6A0] via-[#E8CE77] to-[#D9B74A] bg-clip-text text-transparent"
          >
            Escolha o seu plano
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Soluções completas para sua jornada de auditoria.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="size-6 text-[#C9A633] mt-1 shrink-0" />
            <div className="space-y-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                *Toda máquina virtual já possui instalada um modelo de IA escolhido pelo cliente
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                **Serviços de IA são instâncias privadas, sem compartilhamento de dados públicos, de serviços atuais como: Chat-GPT, Gemini, Copilot, entre outros
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Compare os Recursos</h2>
            <p className="text-zinc-500">Veja detalhadamente o que cada plano oferece para sua empresa.</p>
          </div>
          <PricingComparisonTable />
        </div>
      </div>
    </section>
  )
}

function PricingComparisonTable() {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-6 text-sm font-semibold text-zinc-400">Recurso</th>
            <th className="p-6 text-center text-sm font-bold text-white uppercase tracking-wider">Básico</th>
            <th className="p-6 text-center text-sm font-bold text-[#C9A633] uppercase tracking-wider">Profissional</th>
            <th className="p-6 text-center text-sm font-bold text-white uppercase tracking-wider">VIP</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((item, index) => (
            <tr
              key={item.feature}
              className={cn(
                "border-b border-white/5 transition-colors hover:bg-white/[0.02]",
                index === comparisonData.length - 1 && "border-0"
              )}
            >
              <td className="p-6 text-sm text-zinc-300 font-medium">{item.feature}</td>
              <td className="p-6 text-center">
                <StatusIcon value={item.basico} />
              </td>
              <td className="p-6 text-center bg-[#C9A633]/5">
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
  )
}

function StatusIcon({ value, isPrimary }: { value: any; isPrimary?: boolean }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <Check className={cn("size-5", isPrimary ? "text-[#C9A633]" : "text-emerald-500")} />
      </div>
    )
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <X className="size-5 text-zinc-600" />
      </div>
    )
  }
  return (
    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border",
      isPrimary
        ? "text-[#C9A633] border-[#C9A633]/20 bg-[#C9A633]/5"
        : "text-zinc-400 border-white/10 bg-white/5"
    )}>
      {value}
    </span>
  )
}

function PricingCard({ plan, index }: { plan: any; index: number }) {
  const isPro = plan.theme === "Pro"
  const isVip = plan.theme === "Vip"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col p-8 rounded-[24px] border transition-all duration-300",
        isPro
          ? "border-[#C9A633]/50 bg-black shadow-[0_0_40px_rgba(201,166,51,0.15)]"
          : isVip
            ? "border-[#F4E7B2]/50 bg-[#9D812B]/20 shadow-[0_0_40px_rgba(244,231,178,0.15)] backdrop-blur-sm"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
      )}
    >
      {plan.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1 bg-[#C9A633] text-black text-[12px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(201,166,51,0.4)]">
          <Star className="size-3 fill-current" />
          Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-1 uppercase">
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-bold text-white">{plan.price}</span>
          <span className="text-zinc-500 text-sm">/mês</span>
        </div>
      </div>

      <div className="space-y-4 mb-10 flex-grow">
        {plan.features.map((feature: string) => (
          <div key={feature} className="flex gap-3">
            <div
              className={cn(
                "flex-shrink-0 size-5 rounded-full flex items-center justify-center border",
                isPro
                  ? "border-[#C9A633]/30 bg-[#C9A633]/10 text-[#C9A633]"
                  : isVip
                    ? "border-[#F4E7B2]/30 bg-[#F4E7B2]/10 text-[#F4E7B2]"
                    : "border-white/10 bg-white/5 text-zinc-400"
              )}
            >
              <Check className="size-3" strokeWidth={3} />
            </div>
            <span className="text-zinc-300 text-sm leading-tight">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-8 p-4 rounded-xl border border-white/5 bg-white/[0.02] flex gap-3">
        <AlertCircle className="size-4 text-[#C9A633] mt-0.5 shrink-0" />
        <div className="space-y-2">
          <p className="text-[11px] text-zinc-500 leading-normal">
            Os preços mencionados são referentes à assinatura do Chronos Audit.
            A contratação de maquinas virtuais* e serviços de IA** é necessário e irá incorrer em custos adicionais
          </p>
          <div className="space-y-1">
            {isVip ? (
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#C9A633]">
                Preços especiais, consultar vendas
              </p>
            ) : (
              <>
                <p className="text-[9px] uppercase tracking-wider font-bold text-[#C9A633]">
                  Máquinas Virtuais — A partir de R$200,00/mês
                </p>
                <p className="text-[9px] uppercase tracking-wider font-bold text-[#C9A633]">
                  Serviços de IA — A partir de R$50,00/mês
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <Button
        className={cn(
          "w-full rounded-[14px] py-6 text-sm font-bold transition-all duration-300",
          isPro
            ? "bg-[#C9A633] text-black hover:bg-[#E8CE77] shadow-[0_0_20px_rgba(201,166,51,0.2)]"
            : isVip
              ? "bg-white text-black hover:bg-white/60 shadow-[0_0_20px_rgba(244,231,178,0.2)]"
              : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
        )}
      >
        {isVip ? (
          <p>
            Consultar vendas
          </p>
        ) : (
          <>
            <p>
              Começar Agora
            </p>
          </>
        )}
        <motion.span
          className="ml-2"
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </Button>
    </motion.div>
  )
}
