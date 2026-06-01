"use client";

import React from "react";
import { GitBranch, Zap, Shield, Cloud, Code } from "lucide-react";

interface PipelineStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  items?: string[];
  variant?: "primary" | "secondary" | "tertiary";
  index: number;
}

const variantStyles = {
  primary: {
    bg: "bg-accent-amber/5",
    border: "border-accent-amber-border",
    textColor: "text-accent-amber",
    title: "text-text-100",
  },
  secondary: {
    bg: "bg-accent-blue/5",
    border: "border-accent-blue/20",
    textColor: "text-accent-blue",
    title: "text-text-100",
  },
  tertiary: {
    bg: "bg-accent-teal/5",
    border: "border-accent-teal/20",
    textColor: "text-accent-teal",
    title: "text-text-100",
  },
};

const PipelineStepCard: React.FC<PipelineStepProps> = ({
  icon,
  title,
  description,
  items,
  variant = "primary",
  index,
}) => {
  const style = variantStyles[variant];

  return (
    <div
      className={`
        relative p-6 rounded-xl border backdrop-blur-sm
        transition-all duration-300 hover:border-accent-amber-border
        group overflow-hidden
        ${style.bg} ${style.border}
      `}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Gradient background effect */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          bg-gradient-to-br from-accent-amber/5 to-transparent
        `}
      />

      <div className="relative z-10">
        {/* Icon + Step Number */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`
              w-10 h-10 rounded-lg
              flex items-center justify-center
              ${style.bg} border ${style.border}
              ${style.textColor}
            `}
          >
            {icon}
          </div>
          <span className="text-sm font-semibold text-text-400">
            Passo {index + 1}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold mb-2 ${style.title}`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-300 mb-4">{description}</p>

        {/* Items List */}
        {items && items.length > 0 && (
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-text-400 flex items-start gap-2"
              >
                <span className={`${style.textColor} mt-1`}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface PipelineGridProps {
  className?: string;
}

export const PipelineGrid: React.FC<PipelineGridProps> = ({
  className = "",
}) => {
  const steps = [
    {
      icon: <Code className="w-5 h-5" />,
      title: "Desenvolvimento",
      description:
        "Escreva código e commit para branches de feature no repositório Git",
      items: [
        "Feature branch a partir de develop",
        "Trabalhe localmente com npm run dev",
        "Commit com mensagens descritivas",
        "Push para o repositório",
      ],
      variant: "primary" as const,
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: "Pull Request",
      description:
        "Crie PR para review de código antes de mergear para develop",
      items: [
        "Code review automático (ESLint + TypeScript)",
        "Revisão manual de pares",
        "Discussões e sugestões",
        "Aprovação necessária antes de merge",
      ],
      variant: "secondary" as const,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Build & Test",
      description:
        "Sistema automático faz build, testes e validação de segurança",
      items: [
        "Lint com ESLint",
        "Type checking com TypeScript",
        "Build da aplicação",
        "Testes unitários (quando aplicável)",
      ],
      variant: "tertiary" as const,
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Security Scan",
      description:
        "Verificação automática de vulnerabilidades em dependências",
      items: [
        "npm audit - Verificação de CVEs",
        "OWASP Dependency Check",
        "Trivy - Scanning de Docker images",
        "Relatórios de vulnerabilidades",
      ],
      variant: "primary" as const,
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      title: "Deploy Automático",
      description:
        "Após merge, deploy automático para staging ou produção",
      items: [
        "Branch develop → Staging",
        "Branch main → Produção",
        "Health checks automáticos",
        "Monitoramento em tempo real",
      ],
      variant: "secondary" as const,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Monitoramento",
      description:
        "Acompanhamento contínuo da aplicação em produção",
      items: [
        "Application Insights ativa",
        "Alertas de erros",
        "Métricas de performance",
        "Rollback automático se necessário",
      ],
      variant: "tertiary" as const,
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <PipelineStepCard
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
            items={step.items}
            variant={step.variant}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineGrid;
