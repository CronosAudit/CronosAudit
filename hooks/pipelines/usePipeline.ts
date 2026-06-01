"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  Pipeline,
  PipelineStage,
  DeploymentTimelineItem,
  LogEntry,
  Metric,
  Alert,
} from "@/lib/pipelines/pipeline-types";

/**
 * Hook para buscar dados de pipeline em tempo real
 */
export function usePipelineData(pipelineId?: string) {
  const [data, setData] = useState<{
    pipeline: Pipeline | null;
    stages: PipelineStage[];
    loading: boolean;
    error: Error | null;
  }>({
    pipeline: null,
    stages: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setData({
        pipeline: {
          id: pipelineId || "pipeline-1",
          name: "CI/CD Pipeline",
          description: "Main production pipeline",
          stages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        stages: [
          {
            id: "lint",
            name: "Lint & Type Check",
            status: "success",
            duration: 45,
          },
          { id: "build", name: "Build", status: "success", duration: 120 },
          {
            id: "security",
            name: "Security Scan",
            status: "running",
            description: "npm audit + Trivy",
          },
          { id: "deploy", name: "Deploy", status: "pending" },
        ],
        loading: false,
        error: null,
      });
    }, 500);
  }, [pipelineId]);

  return data;
}

/**
 * Hook para monitorar logs em tempo real via WebSocket
 */
export function useLogStream(streamId: string) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulated WebSocket connection
    setIsConnected(true);

    // Simulated log updates
    const interval = setInterval(() => {
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          level: "info",
          message: `Log entry at ${new Date().toLocaleTimeString()}`,
        },
        ...prev.slice(0, 49),
      ]);
    }, 2000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [streamId]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, isConnected, clearLogs };
}

/**
 * Hook para métricas em tempo real
 */
export function useMetrics(intervalMs = 5000) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setMetrics([
      {
        label: "CPU Usage",
        value: Math.random() * 100,
        unit: "%",
        status: "good",
        trend: "stable",
      },
      {
        label: "Memory",
        value: Math.random() * 1000,
        unit: "MB",
        status: "good",
        trend: "stable",
      },
    ]);
    setLoading(false);

    // Updates
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value:
            m.label === "CPU Usage"
              ? Math.random() * 100
              : Math.random() * 1000,
          trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as
            | "up"
            | "down"
            | "stable",
        }))
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { metrics, loading };
}

/**
 * Hook para alerts e notificações
 */
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback(
    (alert: Omit<Alert, "id" | "timestamp">) => {
      const newAlert: Alert = {
        ...alert,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setAlerts((prev) => [newAlert, ...prev]);

      // Auto-dismiss after 5 seconds if not dismissible
      if (!alert.dismissible) {
        setTimeout(() => {
          setAlerts((prev) =>
            prev.filter((a) => a.id !== newAlert.id)
          );
        }, 5000);
      }
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { alerts, addAlert, removeAlert };
}

/**
 * Hook para fetch de deployments recentes
 */
export function useDeployments(limit = 10) {
  const [deployments, setDeployments] = useState<DeploymentTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setLoading(true);
        // Simulated API call
        setTimeout(() => {
          setDeployments([
            {
              id: "dep-1",
              environment: "production",
              version: "v1.2.5",
              status: "success",
              timestamp: new Date(Date.now() - 3600000),
              duration: 8,
              commitHash: "a1b2c3d4",
            },
            {
              id: "dep-2",
              environment: "staging",
              version: "v1.2.4",
              status: "success",
              timestamp: new Date(Date.now() - 86400000),
              duration: 7,
              commitHash: "x1y2z3a4",
            },
          ]);
          setLoading(false);
        }, 300);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      }
    };

    fetchDeployments();
  }, [limit]);

  return { deployments, loading, error };
}

/**
 * Hook para status de health check
 */
export function useHealthCheck(intervalMs = 30000) {
  const [status, setStatus] = useState<{
    healthy: boolean;
    services: Record<string, boolean>;
    uptime: number;
  }>({
    healthy: true,
    services: {
      api: true,
      database: true,
      redis: true,
      supabase: true,
    },
    uptime: 99.98,
  });
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      // Simulated health check
      await new Promise((resolve) => setTimeout(resolve, 300));
      setStatus((prev) => ({
        ...prev,
        uptime: 99.98 + Math.random() * 0.02,
      }));
    } catch (err) {
      console.error("Health check failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, intervalMs);
    return () => clearInterval(interval);
  }, [checkHealth, intervalMs]);

  return { ...status, loading, checkHealth };
}

/**
 * Hook para cache de dados com invalidação
 */
export function useDataCache<T>(
  fetcher: () => Promise<T>,
  key: string,
  ttl = 60000
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, ttl);
    return () => clearInterval(interval);
  }, [refetch, ttl]);

  return { data, loading, error, refetch };
}

/**
 * Hook para controlar visibilidade/expandir componentes
 */
export function useComponentVisibility(initialState = true) {
  const [visible, setVisible] = useState(initialState);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return { visible, toggle, show, hide };
}

/**
 * Hook para gerenciar filtros
 */
export function useFilters<T extends Record<string, any>>(
  initialFilters: T
) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback(
    (key: keyof T, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return { filters, updateFilter, resetFilters };
}

/**
 * Hook para paginação
 */
export function usePagination<T>(
  items: T[],
  itemsPerPage = 10
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

/**
 * Hook para debounce
 */
export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para throttle
 */
export function useThrottle<T extends any[]>(
  callback: (...args: T) => void,
  delay = 1000
) {
  const lastRun = useState(Date.now())[0];

  return useCallback(
    (...args: T) => {
      const now = Date.now();
      if (now - lastRun >= delay) {
        callback(...args);
      }
    },
    [callback, delay]
  );
}
