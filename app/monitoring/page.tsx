"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, Zap, TrendingUp, Activity } from "lucide-react";
import { Breadcrumb } from "@/components/sections/breadcrumb";
import { MetricsGrid } from "@/components/sections/metrics-card";
import { LogsViewer } from "@/components/sections/logs-viewer";
import { PipelineFlow } from "@/components/pipelines/pipeline-flow";
import { DeploymentTimeline } from "@/components/sections/deployment-timeline";
import { PipelineAlert, AlertGroup } from "@/components/pipelines/pipeline-alert";
import { StatusBar } from "@/components/sections/status-bar";

import type {
  Metric,
  LogEntry,
  Alert,
  PipelineStage,
  DeploymentTimelineItem,
} from "@/lib/pipelines/pipeline-types";

interface MonitoringData {
  metrics: Metric[];
  logs: LogEntry[];
  alerts: Alert[];
  stages: PipelineStage[];
  deployments: DeploymentTimelineItem[];
  isLive: boolean;
}

export default function MonitoringPage() {
  const [data, setData] = useState<MonitoringData>({
    metrics: [
      {
        label: "CPU Usage",
        value: "38",
        unit: "%",
        status: "good",
        trend: "up",
        trendValue: "+2% from 1h ago",
      },
      {
        label: "Memory",
        value: "762",
        unit: "MB",
        status: "good",
        trend: "stable",
        trendValue: "Within normal range",
      },
      {
        label: "Response Time",
        value: "145",
        unit: "ms",
        status: "good",
        trend: "down",
        trendValue: "-12ms improvement",
      },
      {
        label: "Error Rate",
        value: "0.05",
        unit: "%",
        status: "good",
        trend: "down",
        trendValue: "Best in 24h",
      },
    ],
    logs: [
      {
        id: "1",
        timestamp: new Date(),
        level: "success",
        category: "deploy",
        message: "✓ Deployment completed successfully",
        details: "v1.2.5 deployed to production",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 30000),
        level: "info",
        category: "build",
        message: "🔍 Running security scan",
        details: "Trivy container image scan",
      },
    ],
    alerts: [
      {
        type: "success",
        title: "Production health check passed",
        message: "All services are responding normally",
        dismissible: true,
      },
    ],
    stages: [
      {
        id: "lint",
        name: "Lint & Type",
        status: "success",
        duration: 45,
      },
      {
        id: "build",
        name: "Build",
        status: "success",
        duration: 120,
      },
      {
        id: "test",
        name: "Tests",
        status: "running",
      },
      {
        id: "deploy",
        name: "Deploy",
        status: "pending",
      },
    ],
    deployments: [
      {
        id: "dep-1",
        environment: "production",
        version: "v1.2.5",
        status: "success",
        timestamp: new Date(Date.now() - 300000),
        duration: 8,
        commitHash: "a1b2c3d",
        description: "Production release",
      },
    ],
    isLive: true,
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Simulated live updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        logs: [
          {
            id: Date.now().toString(),
            timestamp: new Date(),
            level: ["info", "success", "warning"][
              Math.floor(Math.random() * 3)
            ] as any,
            category: ["build", "deploy", "health", "general"][
              Math.floor(Math.random() * 4)
            ] as any,
            message: `System update: ${Date.now()}`,
            details: "Automatic monitoring update",
          },
          ...prevData.logs.slice(0, 19),
        ],
        metrics: prevData.metrics.map((m) => ({
          ...m,
          value:
            typeof m.value === "string"
              ? (Math.random() * 100).toFixed(1)
              : m.value,
        })),
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  return (
    <div className="w-full bg-bg-0 text-text-100 min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-surface-1 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <Breadcrumb
            items={[
              { label: "Dashboard" },
              { label: "Monitoring" },
              { label: "Real-time" },
            ]}
          />
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-100">
                Monitoramento em Tempo Real
              </h1>
              <p className="text-text-400 mt-1">
                Acompanhe a performance do seu sistema
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-3 h-3 rounded-full animate-pulse
                  ${data.isLive ? "bg-accent-teal" : "bg-accent-pink"}
                `}
              />
              <span className="text-sm text-text-400">
                {data.isLive ? "Ao vivo" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-text-400 hover:text-text-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-sm">Auto-atualizar</span>
            </label>

            {autoRefresh && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className={`
                  px-3 py-1.5 rounded-lg text-sm
                  bg-surface-2 text-text-100 border border-border
                  hover:bg-surface-3 transition-colors
                `}
              >
                <option value={1000}>1 seg</option>
                <option value={5000}>5 seg</option>
                <option value={10000}>10 seg</option>
                <option value={30000}>30 seg</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 text-text-400 text-sm">
            <Activity className="w-4 h-4" />
            Atualizado em {new Date().toLocaleTimeString("pt-BR")}
          </div>
        </div>

        {/* Status Overview */}
        <section className="mb-8">
          <StatusBar
            variant="success"
            title="Sistema operacional"
            subtitle="Todos os serviços funcionando normalmente"
            estimatedTime="Uptime: 99.98%"
            actions={[
              {
                label: "Ver saúde dos serviços",
                onClick: () => alert("Showing services health"),
              },
            ]}
          />
        </section>

        {/* Alerts */}
        <section className="mb-8">
          {data.alerts.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-text-100 mb-4">
                Notificações
              </h2>
              <AlertGroup alerts={data.alerts} />
            </>
          )}
        </section>

        {/* Metrics Grid */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent-amber" />
            <h2 className="text-xl font-bold text-text-100">Métricas</h2>
          </div>
          <MetricsGrid metrics={data.metrics} />
        </section>

        {/* Pipeline Status */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-accent-blue" />
            <h2 className="text-xl font-bold text-text-100">
              Status do Pipeline
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-border bg-surface-1">
              <h3 className="text-sm font-semibold text-text-400 uppercase mb-6">
                Pipeline Vertical
              </h3>
              <PipelineFlow
                stages={data.stages}
                variant="vertical"
                animated={true}
              />
            </div>
            <div className="p-6 rounded-xl border border-border bg-surface-1">
              <h3 className="text-sm font-semibold text-text-400 uppercase mb-6">
                Pipeline Horizontal
              </h3>
              <PipelineFlow
                stages={data.stages}
                variant="horizontal"
                animated={true}
              />
            </div>
          </div>
        </section>

        {/* Recent Deployments */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-100 mb-4">
            Deployments Recentes
          </h2>
          <div className="p-6 rounded-xl border border-border bg-surface-1">
            <DeploymentTimeline items={data.deployments} />
          </div>
        </section>

        {/* Logs Stream */}
        <section className="mb-20">
          <h2 className="text-xl font-bold text-text-100 mb-4">
            Stream de Logs
          </h2>
          <LogsViewer logs={data.logs} maxHeight="h-96" showDetails={true} />
        </section>

        {/* Footer Info */}
        <div className="p-6 rounded-xl border border-border bg-surface-1 text-center">
          <p className="text-text-400 text-sm">
            Você está visualizando dados em tempo real de:{" "}
            <span className="text-accent-amber font-semibold">
              Cronos Audit Production
            </span>
          </p>
          <p className="text-text-500 text-xs mt-2">
            Última atualização: {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
