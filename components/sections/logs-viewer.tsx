"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Copy, Download } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warning" | "error" | "success";
  message: string;
  details?: string;
  context?: string;
}

interface LogsViewerProps {
  logs: LogEntry[];
  maxHeight?: string;
  className?: string;
  showDetails?: boolean;
}

const levelConfig = {
  info: { color: "text-accent-blue", bg: "bg-accent-blue/10", icon: "ℹ️" },
  warning: {
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
    icon: "⚠️",
  },
  error: { color: "text-accent-pink", bg: "bg-accent-pink/10", icon: "❌" },
  success: {
    color: "text-accent-teal",
    bg: "bg-accent-teal/10",
    icon: "✅",
  },
};

const LogEntry: React.FC<{ entry: LogEntry; showDetails?: boolean }> = ({
  entry,
  showDetails = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = levelConfig[entry.level];

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full px-4 py-3 flex items-start gap-3
          hover:bg-surface-2 transition-colors
          text-left group
        `}
      >
        {/* Level icon */}
        <span className="text-lg mt-0.5">{config.icon}</span>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-100 break-words">{entry.message}</p>
          <p className="text-xs text-text-500 mt-1">
            {entry.timestamp.toLocaleTimeString("pt-BR")}
          </p>
        </div>

        {/* Expand indicator */}
        {(entry.details || entry.context) && showDetails && (
          <ChevronDown
            className={`
              w-4 h-4 text-text-400 flex-shrink-0 mt-1
              transition-transform duration-200
              ${isExpanded ? "rotate-180" : ""}
            `}
          />
        )}
      </button>

      {/* Expanded details */}
      {isExpanded && (entry.details || entry.context) && showDetails && (
        <div className="px-4 pb-3 bg-surface-1 border-t border-border">
          {entry.details && (
            <div className="mb-3 font-mono text-xs text-text-300 bg-bg-300 p-2 rounded break-words overflow-x-auto">
              {entry.details}
            </div>
          )}
          {entry.context && (
            <p className="text-xs text-text-400">{entry.context}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const LogsViewer: React.FC<LogsViewerProps> = ({
  logs,
  maxHeight = "h-96",
  className = "",
  showDetails = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    const text = logs
      .map(
        (log) =>
          `[${log.timestamp.toLocaleTimeString("pt-BR")}] [${log.level.toUpperCase()}] ${log.message}`
      )
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`
        w-full rounded-xl border border-border
        bg-bg-200 overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-1">
        <h3 className="text-sm font-semibold text-text-100">Logs em Tempo Real</h3>
        <button
          onClick={handleCopyLogs}
          className={`
            p-2 rounded-lg transition-colors
            hover:bg-surface-2
            ${copied ? "text-accent-teal" : "text-text-400"}
          `}
          title="Copiar logs"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      {/* Logs container */}
      <div className={`${maxHeight} overflow-y-auto overflow-x-hidden`}>
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-400 text-sm">Nenhum log disponível</p>
          </div>
        ) : (
          logs.map((log) => (
            <LogEntry
              key={log.id}
              entry={log}
              showDetails={showDetails}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LogsViewer;
