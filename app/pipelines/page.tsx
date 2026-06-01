"use client";

import React, { useState, useEffect } from "react";
import { PipelineFlow, type PipelineStageProps } from "@/components/pipelines/pipeline-flow";
import { PipelineGrid } from "@/components/pipelines/pipeline-grid";
import { DeploymentTimeline } from "@/components/sections/deployment-timeline";
import { PipelineAlert, AlertGroup } from "@/components/pipelines/pipeline-alert";
import { MetricsGrid } from "@/components/sections/metrics-card";
import { LogsViewer } from "@/components/sections/logs-viewer";
import { StatusBar } from "@/components/sections/status-bar";
import { PipelineHeroSection } from "@/components/pipelines/pipeline-hero-section";
import { Breadcrumb } from "@/components/sections/breadcrumb";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warning" | "error" | "success";
  message: string;
  details?: string;
  context?: string;
}

export default function PipelinesShowcase() {
  const [pipelineStages, setPipelineStages] = useState<PipelineStageProps[]>([
    {
      id: "lint",
      name: "Lint & Type Check",
      status: "success",
      duration: 45,
      description: "ESLint + TypeScript validation",
    },
    {
      id: "build",
      name: "Build",
      status: "success",
      duration: 120,
      description: "Compile Next.js application",
    },
    {
      id: "security",
      name: "Security Scan",
      status: "running",
      description: "npm audit + Trivy",
    },
    {
      id: "deploy",
      name: "Deploy",
      status: "pending",
      description: "Deploy to Azure",
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 5000),
      level: "success",
      message: "✓ Dependencies installed successfully",
      details: "npm ci completed in 12.5s",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 4000),
      level: "info",
      message: "🔍 Running ESLint validation",
      details: "eslint . --format json",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 3000),
      level: "success",
      message: "✓ No ESLint errors found",
      details: "0 errors, 0 warnings",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 2000),
      level: "info",
      message: "🔍 Running TypeScript compiler",
      details: "tsc --noEmit",
    },
    {
      id: "5",
      timestamp: new Date(),
      level: "success",
      message: "✓ Build completed successfully",
      details: "Total size: 2.1MB",
    },
  ]);

  const deployments = [
    {
      id: "dep-1",
      environment: "production" as const,
      version: "v1.2.5",
      status: "success" as const,
      timestamp: new Date(Date.now() - 3600000),
      duration: 8,
      commitHash: "a1b2c3d4e5f6",
      description: "Release feature: AI chat improvements",
    },
    {
      id: "dep-2",
      environment: "staging" as const,
      version: "v1.2.4",
      status: "success" as const,
      timestamp: new Date(Date.now() - 86400000),
      duration: 7,
      commitHash: "x1y2z3a4b5c6",
      description: "Testing new CNPJ search API",
    },
    {
      id: "dep-3",
      environment: "staging" as const,
      version: "v1.2.3",
      status: "failed" as const,
      timestamp: new Date(Date.now() - 172800000),
      duration: 2,
      commitHash: "m1n2o3p4q5r6",
      description: "Docker image scan failed",
    },
  ];

  const metrics = [
    {
      label: "CPU Usage",
      value: "42",
      unit: "%",
      status: "good" as const,
      trend: "stable" as const,
      trendValue: "Normal",
    },
    {
      label: "Memory",
      value: "845",
      unit: "MB",
      status: "good" as const,
      trend: "down" as const,
      trendValue: "-5MB from last hour",
    },
    {
      label: "Requests/min",
      value: "1,250",
      unit: "req",
      status: "good" as const,
      trend: "up" as const,
      trendValue: "+120 from yesterday",
    },
    {
      label: "Error Rate",
      value: "0.08",
      unit: "%",
      status: "good" as const,
      trend: "down" as const,
      trendValue: "↓ 20% improvement",
    },
  ];

  const alerts = [
    {
      type: "success" as const,
      title: "Deploy bem-sucedido",
      message: "Version 1.2.5 foi deployado com sucesso em produção",
      dismissible: true,
      action: {
        label: "Ver detalhes",
        onClick: () => alert("Mostrando detalhes do deploy"),
      },
    },
    {
      type: "info" as const,
      title: "Nova versão disponível",
      message: "Next.js 15.1.0 foi lançado. Considere atualizar.",
      dismissible: true,
      action: {
        label: "Revisar changelog",
        onClick: () => alert("Abrindo changelog"),
      },
    },
  ];

  return (
    <div className="w-full bg-bg-0 text-text-100 min-h-screen">
      {/* Hero Section */}
      <PipelineHeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        {/* Breadcrumb */}
        <div className="mb-12">
          <Breadcrumb
            items={[
              { label: "Dashboard" },
              { label: "Deployments" },
              { label: "Pipelines" },
            ]}
          />
        </div>

        {/* Section 1: Current Pipeline Status */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-100 mb-2">
              Status do Pipeline
            </h2>
            <p className="text-text-400">
              Acompanhe o progresso do seu deployment em tempo real
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vertical Flow */}
            <div className="p-6 rounded-xl border border-border bg-surface-1">
              <h3 className="text-sm font-semibold text-text-400 uppercase mb-6">
                CI/CD Pipeline (Vertical)
              </h3>
              <PipelineFlow
                stages={pipelineStages}
                variant="vertical"
                animated={true}
              />
            </div>

            {/* Horizontal Flow */}
            <div className="p-6 rounded-xl border border-border bg-surface-1">
              <h3 className="text-sm font-semibold text-text-400 uppercase mb-6">
                CI/CD Pipeline (Horizontal)
              </h3>
              <PipelineFlow
                stages={pipelineStages}
                variant="horizontal"
                animated={true}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Status Bars */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-100 mb-2">
              Status Indicators
            </h2>
            <p className="text-text-400">
              Diferentes tipos de status para diferentes cenários
            </p>
          </div>

          <div className="space-y-4">
            <StatusBar
              variant="default"
              title="Build em progresso"
              subtitle="feature/ai-improvements"
              progress={65}
              estimatedTime="3 min"
              actions={[
                {
                  label: "Ver logs",
                  onClick: () => alert("Showing logs"),
                },
              ]}
            />

            <StatusBar
              variant="success"
              title="Deploy completado com sucesso"
              subtitle="Production v1.2.5"
              estimatedTime="Completed at 2:30 PM"
              actions={[
                {
                  label: "Rollback",
                  onClick: () => alert("Rollback initiated"),
                  variant: "secondary",
                },
                {
                  label: "Ver metrics",
                  onClick: () => alert("Showing metrics"),
                },
              ]}
            />

            <StatusBar
              variant="warning"
              title="Teste de performance em progresso"
              subtitle="Load testing: 1000 concurrent users"
              progress={45}
              estimatedTime="2 min remaining"
            />

            <StatusBar
              variant="error"
              title="Falha no security scan"
              subtitle="3 vulnerabilidades encontradas"
              actions={[
                {
                  label: "Ver detalhes",
                  onClick: () => alert("Showing vulnerabilities"),
                },
              ]}
            />
          </div>
        </section>

        {/* Section 3: Alerts */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-100 mb-2">
              Notificações
            </h2>
            <p className="text-text-400">
              Sistema de alertas para eventos importantes
            </p>
          </div>

          <AlertGroup alerts={alerts} />
        </section>

        {/* Section 4: Metrics */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-100 mb-2">
              Métricas do Sistema
            </h2>
            <p className="text-text-400">
              Acompanhe a performance em tempo real
            </p>
          </div>

          <MetricsGrid metrics={metrics} />
        </section>

        {/* Section 5: Logs */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-100 mb-2">
              Logs em Tempo Real
            </h2>
            <p className="text-text-400">
              Acompanhe todos os eventos do pipeline
            </p>
          </div>

          <LogsViewer logs={logs} maxHeight="h-96" />
        </section>

        {/* Section 6: Deployment Timeline */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-100 mb-2">
              Histórico de Deployments
            </h2>
            <p className="text-text-400">
              Veja todos os deployments anteriores
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-surface-1">
            <DeploymentTimeline items={deployments} />
          </div>
        </section>

        {/* Section 7: Pipeline Steps */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-100 mb-2">
              Fluxo do Pipeline
            </h2>
            <p className="text-text-400">
              Entenda cada passo do processo CI/CD
            </p>
          </div>

          <PipelineGrid />
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <div
            className={`
              p-8 md:p-12 rounded-2xl border border-accent-amber-border
              bg-gradient-to-r from-accent-amber/5 to-accent-blue/5
              text-center
            `}
          >
            <h2 className="text-3xl font-bold text-text-100 mb-4">
              Pronto para começar?
            </h2>
            <p className="text-text-400 mb-8 max-w-2xl mx-auto">
              Configure seus pipelines agora e comece a deploy automaticamente.
              Suporta GitHub Actions e Azure DevOps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className={`
                  px-8 py-3 rounded-lg font-semibold
                  bg-accent-amber text-bg-0
                  hover:bg-accent-amber/90
                  transition-all duration-200
                `}
              >
                Configurar Agora
              </button>
              <button
                className={`
                  px-8 py-3 rounded-lg font-semibold
                  border border-accent-amber-border text-text-100
                  hover:bg-accent-amber/5
                  transition-all duration-200
                `}
              >
                Ver Documentação
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
