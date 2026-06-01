"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";

type PipelineStatus = "pending" | "running" | "success" | "failed";

export interface PipelineStage {
  id: string;
  name: string;
  status: PipelineStatus;
  duration?: number;
  description?: string;
}

export type PipelineStageProps = PipelineStage;

interface PipelineFlowProps {
  stages: PipelineStage[];
  variant?: "horizontal" | "vertical";
  showDescription?: boolean;
  animated?: boolean;
  className?: string;
}

const statusStyles = {
  pending: {
    bg: "bg-surface-3",
    border: "border-border",
    text: "text-text-400",
    icon: <Clock className="w-4 h-4" />,
  },
  running: {
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/30",
    text: "text-accent-blue",
    icon: <Zap className="w-4 h-4 animate-pulse" />,
  },
  success: {
    bg: "bg-accent-teal/10",
    border: "border-accent-teal/30",
    text: "text-accent-teal",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  failed: {
    bg: "bg-accent-pink/10",
    border: "border-accent-pink/30",
    text: "text-accent-pink",
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

const PipelineStageCard: React.FC<{
  stage: PipelineStage;
  showDescription?: boolean;
  index: number;
  total: number;
  isLast?: boolean;
}> = ({ stage, showDescription, index, total, isLast }) => {
  const style = statusStyles[stage.status];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Stage Card */}
      <div
        className={`
          relative w-full max-w-xs px-4 py-3 rounded-lg border
          transition-all duration-300
          ${style.bg} ${style.border}
          ${stage.status === "running" ? "ring-2 ring-offset-2 ring-offset-bg-0 ring-accent-blue" : ""}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`${style.text}`}>{style.icon}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-100">{stage.name}</p>
            {showDescription && stage.description && (
              <p className="text-xs text-text-400 mt-1">{stage.description}</p>
            )}
          </div>
          {stage.duration && (
            <span className="text-xs text-text-400">{stage.duration}s</span>
          )}
        </div>
      </div>

      {/* Connector Line */}
      {!isLast && (
        <div className="h-8 w-0.5 bg-gradient-to-b from-border to-transparent"></div>
      )}
    </div>
  );
};

export const PipelineFlow: React.FC<PipelineFlowProps> = ({
  stages,
  variant = "vertical",
  showDescription = false,
  animated = true,
  className = "",
}) => {
  const [animatedStages, setAnimatedStages] = useState(
    stages.map((s) => ({ ...s, status: "pending" as PipelineStatus }))
  );

  useEffect(() => {
    if (!animated) {
      setAnimatedStages(stages);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < stages.length) {
        setAnimatedStages((prev) => {
          const updated = [...prev];
          updated[currentIndex].status = stages[currentIndex].status;
          if (currentIndex > 0) {
            updated[currentIndex - 1].status = stages[currentIndex - 1].status;
          }
          return updated;
        });
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [stages, animated]);

  if (variant === "horizontal") {
    return (
      <div className={`w-full overflow-x-auto ${className}`}>
        <div className="flex gap-4 pb-4 px-4 min-w-min">
          {animatedStages.map((stage, index) => {
            const style = statusStyles[stage.status];
            return (
              <div key={stage.id} className="flex items-center gap-4">
                <div
                  className={`
                    relative px-4 py-3 rounded-lg border
                    transition-all duration-300
                    whitespace-nowrap
                    ${style.bg} ${style.border}
                    ${stage.status === "running" ? "ring-2 ring-offset-2 ring-offset-bg-0 ring-accent-blue" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div className={`${style.text}`}>{style.icon}</div>
                    <span className="text-sm font-semibold text-text-100">
                      {stage.name}
                    </span>
                  </div>
                </div>

                {index < animatedStages.length - 1 && (
                  <div className="h-0.5 w-8 bg-gradient-to-r from-border to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {animatedStages.map((stage, index) => (
        <PipelineStageCard
          key={stage.id}
          stage={stage}
          showDescription={showDescription}
          index={index}
          total={animatedStages.length}
          isLast={index === animatedStages.length - 1}
        />
      ))}
    </div>
  );
};

export default PipelineFlow;
