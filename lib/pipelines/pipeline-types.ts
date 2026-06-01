/**
 * Pipeline Types & Interfaces
 * Tipos compartilhados para componentes de pipeline
 */

/* ==================== Pipeline ====================*/

export interface PipelineStage {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "failed";
  duration?: number; // em segundos
  description?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  createdAt: Date;
  updatedAt: Date;
}

/* ==================== Deployment ====================*/

export type Environment = "staging" | "production";
export type DeploymentStatus = "pending" | "in-progress" | "success" | "failed";

export interface DeploymentTimelineItem {
  id: string;
  environment: Environment;
  version: string;
  status: DeploymentStatus;
  timestamp: Date;
  duration?: number; // em minutos
  commitHash?: string;
  description?: string;
}

export interface DeploymentMetadata {
  gitBranch?: string;
  gitCommit?: string;
  triggeredBy?: string;
  pullRequestNumber?: number;
  rollbackTarget?: string;
}

/* ==================== Alerts ====================*/

export type AlertType = "success" | "warning" | "error" | "info";

export interface Alert {
  type: AlertType;
  title: string;
  message: string;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp?: Date;
  id?: string;
}

/* ==================== Metrics ====================*/

export type MetricStatus = "good" | "warning" | "critical";
export type TrendDirection = "up" | "down" | "stable";

export interface Metric {
  label: string;
  value: number | string;
  unit?: string;
  status?: MetricStatus;
  trend?: TrendDirection;
  trendValue?: string;
  icon?: string;
  previousValue?: number;
  timestamp?: Date;
}

export interface MetricsSnapshot {
  timestamp: Date;
  metrics: Metric[];
  environmentalNotes?: string;
}

/* ==================== Logs ====================*/

export type LogLevel = "info" | "warning" | "error" | "success";
export type LogCategory =
  | "build"
  | "test"
  | "deploy"
  | "security"
  | "health"
  | "general";

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category?: LogCategory;
  message: string;
  details?: string;
  context?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

export interface LogStream {
  id: string;
  name: string;
  entries: LogEntry[];
  maxEntries?: number;
}

/* ==================== Health Check ====================*/

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export interface ServiceHealth {
  name: string;
  status: HealthStatus;
  lastChecked: Date;
  responseTime?: number; // em ms
  message?: string;
}

export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: Date;
  services: Record<string, ServiceHealth>;
  uptime?: number; // em segundos
  version?: string;
}

/* ==================== Notifications ====================*/

export type NotificationType =
  | "deployment-started"
  | "deployment-completed"
  | "deployment-failed"
  | "security-alert"
  | "performance-warning"
  | "quota-warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: "info" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
}

/* ==================== Build & Test ====================*/

export interface BuildResult {
  id: string;
  status: "success" | "failed";
  duration: number; // em segundos
  startTime: Date;
  endTime: Date;
  warnings: number;
  errors: number;
  details?: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: number; // em ms
  message?: string;
}

export interface TestSuite {
  name: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestResult[];
}

/* ==================== Security ====================*/

export interface Vulnerability {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  package: string;
  version: string;
  fixedVersion?: string;
  cve?: string;
  url?: string;
}

export interface SecurityScan {
  id: string;
  timestamp: Date;
  status: "success" | "failed";
  vulnerabilitiesFound: number;
  vulnerabilities: Vulnerability[];
  duration: number;
}

/* ==================== Performance ====================*/

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  baseline?: number;
  threshold?: number;
  status: "good" | "warning" | "critical";
}

export interface PerformanceReport {
  timestamp: Date;
  metrics: PerformanceMetric[];
  summary: string;
}

/* ==================== Configuration ====================*/

export interface PipelineConfig {
  id: string;
  name: string;
  enabled: boolean;
  trigger: "push" | "pull-request" | "schedule" | "manual";
  branches?: string[];
  environment?: Record<string, string>;
  notifications?: {
    onSuccess?: boolean;
    onFailure?: boolean;
    channels: ("email" | "slack" | "webhook")[];
  };
}

/* ==================== API Responses ====================*/

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: Date;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/* ==================== Dashboard ====================*/

export interface DashboardData {
  currentPipeline?: Pipeline;
  recentDeployments: DeploymentTimelineItem[];
  metrics: Metric[];
  logs: LogEntry[];
  alerts: Alert[];
  health: ServiceHealth[];
}

export interface DashboardWidget {
  id: string;
  type:
    | "pipeline"
    | "metrics"
    | "logs"
    | "deployments"
    | "alerts"
    | "health";
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config?: Record<string, any>;
}

/* ==================== Filters ====================*/

export interface DeploymentFilter {
  environment?: Environment;
  status?: DeploymentStatus;
  startDate?: Date;
  endDate?: Date;
  version?: string;
  triggeredBy?: string;
}

export interface LogFilter {
  level?: LogLevel[];
  category?: LogCategory[];
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

/* ==================== WebSocket Events ====================*/

export interface WebSocketMessage<T> {
  event: string;
  data: T;
  timestamp: Date;
}

export interface PipelineUpdateEvent extends WebSocketMessage<Pipeline> {
  event: "pipeline:update" | "pipeline:stage-update" | "pipeline:complete";
}

export interface LogStreamEvent extends WebSocketMessage<LogEntry> {
  event: "log:new";
}

export interface MetricUpdateEvent extends WebSocketMessage<Metric> {
  event: "metric:update";
}
