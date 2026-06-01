"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock, Zap, Download } from "lucide-react";

export type DeploymentStatus = "pending" | "in-progress" | "success" | "failed";

interface DeploymentTimelineItem {
  id: string;
  environment: "staging" | "production";
  version: string;
  status: DeploymentStatus;
  timestamp: Date;
  duration?: number;
  commitHash?: string;
  description?: string;
}

interface DeploymentTimelineProps {
  items: DeploymentTimelineItem[];
  className?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-text-400",
    bg: "bg-text-400/10",
    border: "border-text-400/30",
    label: "Pendente",
  },
  "in-progress": {
    icon: Zap,
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
    border: "border-accent-amber-border",
    label: "Em Progresso",
  },
  success: {
    icon: CheckCircle2,
    color: "text-accent-teal",
    bg: "bg-accent-teal/10",
    border: "border-accent-teal/30",
    label: "Sucesso",
  },
  failed: {
    icon: AlertCircle,
    color: "text-accent-pink",
    bg: "bg-accent-pink/10",
    border: "border-accent-pink/30",
    label: "Falha",
  },
};

const DeploymentCard: React.FC<{
  item: DeploymentTimelineItem;
  isFirst?: boolean;
}> = ({ item, isFirst = false }) => {
  const config = statusConfig[item.status];
  const Icon = config.icon;
  const environmentLabel = item.environment === "staging" ? "🔵 Staging" : "🟢 Produção";

  return (
    <div className={`relative pb-8 ${isFirst ? "" : "pt-4"}`}>
      {/* Timeline line */}
      {!isFirst && (
        <div className="absolute left-5 top-0 bottom-8 w-0.5 bg-gradient-to-b from-border to-transparent" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-2 w-11 h-11 flex items-center justify-center">
        <div
          className={`
            w-11 h-11 rounded-full border-2
            flex items-center justify-center
            transition-all duration-300
            ${config.bg} ${config.border}
          `}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
      </div>

      {/* Content */}
      <div className="ml-20">
        <div
          className={`
            p-4 rounded-xl border
            transition-all duration-300
            ${config.bg} ${config.border}
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-text-100">
                Deploy: {item.version}
              </h4>
              <p className="text-xs text-text-400 mt-1">
                {environmentLabel}
              </p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${config.color} ${config.bg}`}>
              {config.label}
            </span>
          </div>

          {/* Meta info */}
          <div className="space-y-1 mb-3 text-xs text-text-400">
            <p>
              🕐{" "}
              {item.timestamp.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {item.duration && <p>⏱️ Duração: {item.duration} minutos</p>}
            {item.commitHash && (
              <p>
                💾 Commit:{" "}
                <code className="text-accent-amber">
                  {item.commitHash.slice(0, 7)}
                </code>
              </p>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-text-300 mb-3">{item.description}</p>
          )}

          {/* Actions */}
          {item.status === "success" && (
            <button className="text-xs flex items-center gap-1 text-accent-blue hover:text-accent-blue/80 transition-colors">
              <Download className="w-3 h-3" />
              Ver logs
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const DeploymentTimeline: React.FC<DeploymentTimelineProps> = ({
  items,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-400 text-sm">Nenhum deployment realizado ainda</p>
          </div>
        ) : (
          items.map((item, index) => (
            <DeploymentCard
              key={item.id}
              item={item}
              isFirst={index === 0}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DeploymentTimeline;
