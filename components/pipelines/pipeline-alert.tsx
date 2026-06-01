"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export type AlertType = "success" | "warning" | "error" | "info";

interface PipelineAlertProps {
  type: AlertType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const alertConfig = {
  success: {
    icon: CheckCircle2,
    bg: "bg-accent-teal/5",
    border: "border-accent-teal/30",
    color: "text-accent-teal",
    accentBg: "bg-accent-teal/10",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-accent-amber/5",
    border: "border-accent-amber-border",
    color: "text-accent-amber",
    accentBg: "bg-accent-amber/10",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-accent-pink/5",
    border: "border-accent-pink/30",
    color: "text-accent-pink",
    accentBg: "bg-accent-pink/10",
  },
  info: {
    icon: Info,
    bg: "bg-accent-blue/5",
    border: "border-accent-blue/30",
    color: "text-accent-blue",
    accentBg: "bg-accent-blue/10",
  },
};

export const PipelineAlert: React.FC<PipelineAlertProps> = ({
  type,
  title,
  message,
  action,
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) return null;

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        p-4 rounded-xl border
        transition-all duration-300
        ${config.bg} ${config.border}
        ${className}
      `}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${config.color}`}>
          <Icon className="w-5 h-5 mt-0.5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-100 mb-1">{title}</h3>
          <p className="text-sm text-text-300">{message}</p>

          {/* Action */}
          {action && (
            <button
              onClick={action.onClick}
              className={`
                mt-3 text-xs font-semibold
                px-3 py-1.5 rounded-lg
                transition-all duration-200
                ${config.accentBg} ${config.color}
                hover:opacity-80
              `}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss?.();
            }}
            className="flex-shrink-0 text-text-400 hover:text-text-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

interface AlertGroupProps {
  alerts: PipelineAlertProps[];
  className?: string;
}

export const AlertGroup: React.FC<AlertGroupProps> = ({ alerts, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {alerts.map((alert, index) => (
        <PipelineAlert key={index} {...alert} />
      ))}
    </div>
  );
};

export default PipelineAlert;
