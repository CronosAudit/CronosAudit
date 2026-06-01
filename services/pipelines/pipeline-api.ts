/**
 * Pipeline API Service
 * Funções para integrar com backend APIs e services
 */

import type {
  Pipeline,
  PipelineStage,
  DeploymentTimelineItem,
  LogEntry,
  Metric,
  HealthCheckResponse,
  SecurityScan,
  TestSuite,
  ApiResponse,
} from "@/lib/pipelines/pipeline-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// ==================== Pipeline API ====================

/**
 * Buscar dados de um pipeline específico
 */
export async function getPipeline(pipelineId: string): Promise<Pipeline> {
  const response = await fetch(`${API_BASE_URL}/pipelines/${pipelineId}`);
  if (!response.ok) throw new Error("Failed to fetch pipeline");
  const data: ApiResponse<Pipeline> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Buscar todos os pipelines
 */
export async function getPipelines(): Promise<Pipeline[]> {
  const response = await fetch(`${API_BASE_URL}/pipelines`);
  if (!response.ok) throw new Error("Failed to fetch pipelines");
  const data: ApiResponse<Pipeline[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Criar novo pipeline
 */
export async function createPipeline(
  pipeline: Omit<Pipeline, "id" | "createdAt" | "updatedAt">
): Promise<Pipeline> {
  const response = await fetch(`${API_BASE_URL}/pipelines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pipeline),
  });
  if (!response.ok) throw new Error("Failed to create pipeline");
  const data: ApiResponse<Pipeline> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Atualizar pipeline
 */
export async function updatePipeline(
  pipelineId: string,
  updates: Partial<Pipeline>
): Promise<Pipeline> {
  const response = await fetch(`${API_BASE_URL}/pipelines/${pipelineId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update pipeline");
  const data: ApiResponse<Pipeline> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Deletar pipeline
 */
export async function deletePipeline(pipelineId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pipelines/${pipelineId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete pipeline");
}

// ==================== Stages ====================

/**
 * Buscar estágios de um pipeline
 */
export async function getPipelineStages(
  pipelineId: string
): Promise<PipelineStage[]> {
  const response = await fetch(
    `${API_BASE_URL}/pipelines/${pipelineId}/stages`
  );
  if (!response.ok) throw new Error("Failed to fetch stages");
  const data: ApiResponse<PipelineStage[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Atualizar status de um estágio
 */
export async function updateStageStatus(
  pipelineId: string,
  stageId: string,
  status: PipelineStage["status"]
): Promise<PipelineStage> {
  const response = await fetch(
    `${API_BASE_URL}/pipelines/${pipelineId}/stages/${stageId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok) throw new Error("Failed to update stage");
  const data: ApiResponse<PipelineStage> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

// ==================== Deployments ====================

/**
 * Buscar deployments recentes
 */
export async function getDeployments(
  limit = 10,
  offset = 0
): Promise<DeploymentTimelineItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/deployments?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) throw new Error("Failed to fetch deployments");
  const data: ApiResponse<DeploymentTimelineItem[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Buscar deployment específico
 */
export async function getDeployment(
  deploymentId: string
): Promise<DeploymentTimelineItem> {
  const response = await fetch(`${API_BASE_URL}/deployments/${deploymentId}`);
  if (!response.ok) throw new Error("Failed to fetch deployment");
  const data: ApiResponse<DeploymentTimelineItem> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Iniciar novo deployment
 */
export async function startDeployment(
  environment: "staging" | "production",
  version: string
): Promise<DeploymentTimelineItem> {
  const response = await fetch(`${API_BASE_URL}/deployments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ environment, version }),
  });
  if (!response.ok) throw new Error("Failed to start deployment");
  const data: ApiResponse<DeploymentTimelineItem> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Fazer rollback de deployment
 */
export async function rollbackDeployment(
  deploymentId: string,
  targetVersion: string
): Promise<DeploymentTimelineItem> {
  const response = await fetch(
    `${API_BASE_URL}/deployments/${deploymentId}/rollback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetVersion }),
    }
  );
  if (!response.ok) throw new Error("Failed to rollback deployment");
  const data: ApiResponse<DeploymentTimelineItem> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

// ==================== Logs ====================

/**
 * Buscar logs
 */
export async function getLogs(
  limit = 100,
  offset = 0,
  filters?: { level?: string; category?: string }
): Promise<LogEntry[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ...(filters?.level && { level: filters.level }),
    ...(filters?.category && { category: filters.category }),
  });

  const response = await fetch(`${API_BASE_URL}/logs?${params}`);
  if (!response.ok) throw new Error("Failed to fetch logs");
  const data: ApiResponse<LogEntry[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Stream de logs em tempo real (SSE)
 */
export function subscribeToLogs(
  callback: (log: LogEntry) => void,
  filters?: { level?: string; category?: string }
): () => void {
  const params = new URLSearchParams(
    filters as Record<string, string>
  );
  const eventSource = new EventSource(
    `${API_BASE_URL}/logs/stream?${params}`
  );

  eventSource.onmessage = (event) => {
    try {
      const log = JSON.parse(event.data) as LogEntry;
      callback(log);
    } catch (err) {
      console.error("Failed to parse log", err);
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
  };

  return () => eventSource.close();
}

// ==================== Metrics ====================

/**
 * Buscar métricas atuais
 */
export async function getMetrics(): Promise<Metric[]> {
  const response = await fetch(`${API_BASE_URL}/metrics`);
  if (!response.ok) throw new Error("Failed to fetch metrics");
  const data: ApiResponse<Metric[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Buscar métricas históricas
 */
export async function getMetricsHistory(
  metricName: string,
  startTime: Date,
  endTime: Date
): Promise<Metric[]> {
  const params = new URLSearchParams({
    name: metricName,
    start: startTime.toISOString(),
    end: endTime.toISOString(),
  });

  const response = await fetch(`${API_BASE_URL}/metrics/history?${params}`);
  if (!response.ok) throw new Error("Failed to fetch metrics history");
  const data: ApiResponse<Metric[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

// ==================== Health Check ====================

/**
 * Fazer health check
 */
export async function getHealthStatus(): Promise<HealthCheckResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error("Failed to fetch health status");
  const data: ApiResponse<HealthCheckResponse> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

/**
 * Subscribe to health updates (SSE)
 */
export function subscribeToHealth(
  callback: (health: HealthCheckResponse) => void
): () => void {
  const eventSource = new EventSource(`${API_BASE_URL}/health/stream`);

  eventSource.onmessage = (event) => {
    try {
      const health = JSON.parse(event.data) as HealthCheckResponse;
      callback(health);
    } catch (err) {
      console.error("Failed to parse health update", err);
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
  };

  return () => eventSource.close();
}

// ==================== Security ====================

/**
 * Buscar relatório de segurança
 */
export async function getSecurityScan(
  deploymentId: string
): Promise<SecurityScan> {
  const response = await fetch(
    `${API_BASE_URL}/deployments/${deploymentId}/security`
  );
  if (!response.ok) throw new Error("Failed to fetch security scan");
  const data: ApiResponse<SecurityScan> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

// ==================== Tests ====================

/**
 * Buscar resultados de testes
 */
export async function getTestResults(
  pipelineId: string
): Promise<TestSuite[]> {
  const response = await fetch(
    `${API_BASE_URL}/pipelines/${pipelineId}/tests`
  );
  if (!response.ok) throw new Error("Failed to fetch test results");
  const data: ApiResponse<TestSuite[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error?.message);
  return data.data;
}

// ==================== Utilities ====================

/**
 * Retry com backoff exponencial
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < maxRetries - 1) {
        const delay = initialDelayMs * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries reached");
}

/**
 * Criar AbortController para timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 30000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
}
