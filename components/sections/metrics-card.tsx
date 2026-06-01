"use client";

import React, { useEffect, useState } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "good" | "warning" | "critical";
  className?: string;
}

const statusStyles = {
  good: {
    bg: "bg-accent-teal/5",
    border: "border-accent-teal/30",
    color: "text-accent-teal",
  },
  warning: {
    bg: "bg-accent-amber/5",
    border: "border-accent-amber-border",
    color: "text-accent-amber",
  },
  critical: {
    bg: "bg-accent-pink/5",
    border: "border-accent-pink/30",
    color: "text-accent-pink",
  },
};

const trendIcons = {
  up: "📈",
  down: "📉",
  stable: "➡️",
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  status = "good",
  className = "",
}) => {
  const style = statusStyles[status];

  return (
    <div
      className={`
        p-6 rounded-xl border
        transition-all duration-300 hover:border-accent-amber-border
        ${style.bg} ${style.border}
        ${className}
      `}
    >
      {/* Icon + Label */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-text-400 uppercase tracking-wide">
            {label}
          </p>
        </div>
        {icon && <div className="text-text-400">{icon}</div>}
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <p className={`text-3xl font-bold ${style.color}`}>{value}</p>
          {unit && <span className="text-text-400 text-sm">{unit}</span>}
        </div>
      </div>

      {/* Trend */}
      {trend && trendValue && (
        <div className="flex items-center gap-1 text-xs text-text-400">
          <span>{trendIcons[trend]}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

interface MetricsGridProps {
  metrics: MetricCardProps[];
  className?: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default MetricCard;
