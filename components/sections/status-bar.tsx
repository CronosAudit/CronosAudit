"use client";

import React from "react";
import { Zap, AlertCircle, CheckCircle2 } from "lucide-react";

export type StatusBarVariant = "default" | "success" | "warning" | "error";

interface StatusBarProps {
  variant?: StatusBarVariant;
  title: string;
  subtitle?: string;
  progress?: number;
  estimatedTime?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
  className?: string;
}

const variantConfig = {
  default: {
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/30",
    icon: <Zap className="w-5 h-5 text-accent-blue" />,
    progress: "bg-accent-blue",
  },
  success: {
    bg: "bg-accent-teal/10",
    border: "border-accent-teal/30",
    icon: <CheckCircle2 className="w-5 h-5 text-accent-teal" />,
    progress: "bg-accent-teal",
  },
  warning: {
    bg: "bg-accent-amber/10",
    border: "border-accent-amber-border",
    icon: <AlertCircle className="w-5 h-5 text-accent-amber" />,
    progress: "bg-accent-amber",
  },
  error: {
    bg: "bg-accent-pink/10",
    border: "border-accent-pink/30",
    icon: <AlertCircle className="w-5 h-5 text-accent-pink" />,
    progress: "bg-accent-pink",
  },
};

export const StatusBar: React.FC<StatusBarProps> = ({
  variant = "default",
  title,
  subtitle,
  progress,
  estimatedTime,
  actions,
  className = "",
}) => {
  const config = variantConfig[variant];

  return (
    <div
      className={`
        p-4 rounded-xl border
        ${config.bg} ${config.border}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          {config.icon}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-100">{title}</h3>
            {subtitle && (
              <p className="text-xs text-text-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Estimated time */}
        {estimatedTime && (
          <div className="text-xs text-text-400 whitespace-nowrap">
            ⏱️ {estimatedTime}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mb-3">
          <div className="w-full bg-bg-300 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${config.progress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-text-400 mt-1">{progress}%</p>
        </div>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                text-xs font-semibold px-3 py-1.5 rounded-lg
                transition-all duration-200
                ${
                  action.variant === "secondary"
                    ? "bg-surface-2 text-text-200 hover:bg-surface-3"
                    : "bg-accent-amber/20 text-accent-amber hover:bg-accent-amber/30"
                }
              `}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
