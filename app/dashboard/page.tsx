"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileBarChart2,
  Filter,
  FolderKanban,
  ListTodo,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";

import { Navbar, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type TaskStatus = "Pendente" | "Em andamento" | "Concluída" | "Atrasada";
type ReportStatus = "Gerando" | "Processando" | "Concluído" | "Falhou";
type Priority = "Alta" | "Média" | "Baixa";

type DashboardTask = {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  createdAt?: string;
};

type DashboardReport = {
  id: string;
  name: string;
  source: string;
  createdAt: string;
  status: ReportStatus;
  progress: number;
  findings: number;
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  kind: "report" | "task" | "alert" | "success";
};

type SummaryCard = {
  title: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
};

type LooseRecord = Record<string, any>;

const EMPTY_SUMMARY_CARDS: SummaryCard[] = [
  {
    title: "Relatórios ativos",
    value: "0",
    helper: "Nenhum relatório encontrado",
    icon: FileBarChart2,
  },
  {
    title: "Tarefas abertas",
    value: "0",
    helper: "Nenhuma tarefa aberta",
    icon: ListTodo,
  },
  {
    title: "Em processamento",
    value: "0",
    helper: "Nenhum processamento em andamento",
    icon: Loader2,
  },
  {
    title: "Conformidade média",
    value: "0%",
    helper: "Sem dados suficientes ainda",
    icon: ShieldCheck,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

  const [tasks, setTasks] = React.useState<DashboardTask[]>([]);
  const [reports, setReports] = React.useState<DashboardReport[]>([]);
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  const [summaryCards, setSummaryCards] =
    React.useState<SummaryCard[]>(EMPTY_SUMMARY_CARDS);

  const [radarPoints, setRadarPoints] = React.useState([
    { label: "Conformidade", value: 0 },
    { label: "Risco", value: 0 },
    { label: "Cobertura", value: 0 },
    { label: "Automação", value: 0 },
  ]);

  const loadDashboard = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setError("Usuário não autenticado.");
        return;
      }

      const authDisplayName =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.display_name ||
        "";

      setUserName(authDisplayName);
      setUserEmail(user.email ?? "");

      const [
        profileData,
        tasksData,
        reportsData,
        activityData,
        processingJobsData,
      ] = await Promise.all([
        loadProfile(user.id),
        loadTasks(user.id),
        loadReports(user.id),
        loadActivities(user.id),
        loadProcessingJobs(user.id),
      ]);

      setUserName(profileData?.full_name || authDisplayName || "usuário");
      setUserEmail(profileData?.email || user.email || "");

      const mappedTasks = tasksData.map(mapTaskRecordToDashboardTask);
      const mappedReports = reportsData.map(mapReportRecordToDashboardReport);
      const mappedActivities = activityData.map(
        mapActivityRecordToDashboardActivity,
      );

      setTasks(mappedTasks);
      setReports(mappedReports);
      setActivities(mappedActivities);

      const reportsAtivos = mappedReports.length;

      const tarefasAbertas = mappedTasks.filter(
        (task) => task.status !== "Concluída",
      ).length;

      const processando =
        processingJobsData.filter((job) =>
          ["pending", "processing", "running"].includes(
            String(job.status || "").toLowerCase(),
          ),
        ).length +
        mappedReports.filter((report) =>
          ["Gerando", "Processando"].includes(report.status),
        ).length;

      const tarefasAlta = mappedTasks.filter(
        (task) => task.priority === "Alta" && task.status !== "Concluída",
      ).length;

      const mediaProgressoRelatorios =
        mappedReports.length > 0
          ? Math.round(
              mappedReports.reduce((acc, item) => acc + item.progress, 0) /
                mappedReports.length,
            )
          : 0;

      const tarefasConcluidas = mappedTasks.filter(
        (task) => task.status === "Concluída",
      ).length;

      const conformidadeMedia =
        mappedTasks.length > 0
          ? Math.round((tarefasConcluidas / mappedTasks.length) * 100)
          : 0;

      const cobertura =
        reportsAtivos > 0
          ? Math.min(
              100,
              Math.round(
                ((reportsAtivos + processingJobsData.length) /
                  Math.max(
                    1,
                    reportsAtivos + tarefasAbertas + processingJobsData.length,
                  )) *
                  100,
              ),
            )
          : 0;

      const risco =
        mappedTasks.length > 0
          ? Math.round(
              (mappedTasks.filter((t) => t.status === "Atrasada").length /
                mappedTasks.length) *
                100,
            )
          : 0;

      setSummaryCards([
        {
          title: "Relatórios ativos",
          value: String(reportsAtivos),
          helper:
            reportsAtivos > 0
              ? `${mappedReports.filter((r) => r.status === "Concluído").length} concluídos`
              : "Nenhum relatório encontrado",
          icon: FileBarChart2,
        },
        {
          title: "Tarefas abertas",
          value: String(tarefasAbertas),
          helper:
            tarefasAlta > 0
              ? `${tarefasAlta} com alta prioridade`
              : "Sem tarefas críticas",
          icon: ListTodo,
        },
        {
          title: "Em processamento",
          value: String(processando),
          helper:
            processando > 0
              ? "Existem análises em andamento"
              : "Nada sendo processado agora",
          icon: Loader2,
        },
        {
          title: "Conformidade média",
          value: `${conformidadeMedia}%`,
          helper:
            mappedTasks.length > 0
              ? "Baseado no andamento das tarefas"
              : "Sem dados suficientes ainda",
          icon: ShieldCheck,
        },
      ]);

      setRadarPoints([
        { label: "Conformidade", value: clampPercentage(conformidadeMedia) },
        { label: "Risco", value: clampPercentage(risco) },
        { label: "Cobertura", value: clampPercentage(cobertura) },
        {
          label: "Automação",
          value: clampPercentage(mediaProgressoRelatorios),
        },
      ]);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar a dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredTasks = React.useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return tasks;

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(term) ||
        task.project.toLowerCase().includes(term) ||
        task.status.toLowerCase().includes(term) ||
        task.priority.toLowerCase().includes(term)
      );
    });
  }, [search, tasks]);

  const filteredReports = React.useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return reports;

    return reports.filter((report) => {
      return (
        report.name.toLowerCase().includes(term) ||
        report.source.toLowerCase().includes(term) ||
        report.status.toLowerCase().includes(term)
      );
    });
  }, [search, reports]);

  const upcomingTasks = React.useMemo(() => {
    return [...tasks]
      .filter((task) => task.status !== "Concluída")
      .sort((a, b) => parseDateForSort(a.createdAt || a.dueDate) - parseDateForSort(b.createdAt || b.dueDate))
      .slice(0, 3);
  }, [tasks]);

  const urgentIssuesCount = React.useMemo(() => {
    const lateTasks = tasks.filter((task) => task.status === "Atrasada").length;
    const failedReports = reports.filter(
      (report) => report.status === "Falhou",
    ).length;
    return lateTasks + failedReports;
  }, [tasks, reports]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      <Navbar
        menuItems={dashboardMenuItems}
        showAuthButtons={false}
        showContactButtonMobile={false}
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <main className="bg-[#0b0b0c] text-white overflow-x-hidden">
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-[#0b0b0c]/88" />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute left-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16)_0%,rgba(212,175,55,0.05)_35%,transparent_72%)] blur-3xl md:h-[34rem] md:w-[34rem]" />
            <div className="absolute right-[-10rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(120,119,108,0.12)_0%,rgba(120,119,108,0.05)_40%,transparent_75%)] blur-3xl md:h-[30rem] md:w-[30rem]" />
            <div className="absolute bottom-[-12rem] left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(166,124,82,0.12)_0%,rgba(166,124,82,0.03)_45%,transparent_75%)] blur-3xl md:h-[28rem] md:w-[28rem]" />
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pt-36">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/5 px-4 py-2 text-sm text-[#f4e7b2] backdrop-blur-md">
                      <Sparkles className="size-4" />
                      Painel inteligente do Chronos Audit
                    </div>

                    <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                      Olá
                      <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                        {" "}
                        {userName || "usuário"}
                      </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                      Acompanhe suas tarefas, relatórios, processamento e os
                      principais pontos de atenção da sua conta.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={() => router.push("/chat")}
                      className="h-11 rounded-2xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633]"
                    >
                      <Plus className="mr-2 size-4" />
                      Novo relatório
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/dashboard/documentos")}
                      className="h-11 rounded-2xl border border-white/10 px-5 text-sm text-white hover:bg-white/10 hover:text-white"
                    >
                      <FolderKanban className="mr-2 size-4" />
                      Arquivos de Exemplo
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <div
                        key={card.title}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                            <Icon
                              className={cn(
                                "size-5 text-[#d4af37]",
                                card.title === "Em processamento" &&
                                  Number(card.value) > 0 &&
                                  "animate-spin",
                              )}
                            />
                          </div>
                          <TrendingUp className="size-4 text-emerald-400" />
                        </div>

                        <p className="mt-4 text-sm text-zinc-400">
                          {card.title}
                        </p>
                        <p className="mt-1 text-3xl font-semibold text-white">
                          {isLoading ? "..." : card.value}
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          {card.helper}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#f4e7b2]">
                      Pontos de atenção
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      Saúde operacional
                    </h2>
                  </div>
                  <ShieldCheck className="size-5 text-[#d4af37]" />
                </div>

                <div className="mt-6 space-y-4">
                  {radarPoints.map((point) => (
                    <div key={point.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300">{point.label}</span>
                        <span className="font-medium text-white">
                          {isLoading ? "..." : `${point.value}%`}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746]"
                          style={{ width: `${point.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-5 text-amber-300" />
                    <div>
                      <p className="text-sm font-semibold text-amber-100">
                        {urgentIssuesCount > 0
                          ? `${urgentIssuesCount} ponto(s) exigem atenção`
                          : "Nenhum ponto crítico no momento"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-200/80">
                        {urgentIssuesCount > 0
                          ? "Existem tarefas atrasadas ou relatórios com falha que precisam de revisão."
                          : "Sua operação está estável neste momento."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

           

            <section className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-5 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#f4e7b2]">
                    Relatórios criados
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Processamento e resultados
                  </h2>
                </div>

                <Button
                  variant="ghost"
                  className="h-11 rounded-2xl border border-white/10 px-4 text-sm text-white hover:bg-white/10 hover:text-white"
                >
                  <BarChart3 className="mr-2 size-4" />
                  Exportar visão
                </Button>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                <div className="hidden grid-cols-[1.5fr_1fr_0.9fr_0.9fr_48px] bg-white/[0.04] px-5 py-4 text-sm font-medium text-zinc-300 md:grid">
                  <div>Relatório</div>
                  <div>Origem</div>
                  <div>Status</div>
                  <div>Achados</div>
                  <div />
                </div>

                <div className="divide-y divide-white/10">
                  {isLoading ? (
                    <div className="px-5 py-6">
                      <LoadingState text="Carregando relatórios..." />
                    </div>
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className="grid gap-4 bg-black/10 px-5 py-5 md:grid-cols-[1.5fr_1fr_0.9fr_0.9fr_48px] md:items-center"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              {report.id.slice(0, 8)}
                            </span>
                            <ReportStatusBadge label={report.status} />
                          </div>
                          <p className="mt-2 text-sm font-semibold text-white sm:text-base">
                            {report.name}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500">
                            Criado em {report.createdAt}
                          </p>

                          <div className="mt-3 max-w-sm space-y-2">
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                              <span>Progresso</span>
                              <span>{report.progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746]"
                                style={{ width: `${report.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-zinc-300">
                          {report.source}
                        </div>

                        <div>
                          <p className="text-sm text-white">{report.status}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {report.status === "Concluído"
                              ? "Disponível para revisão"
                              : report.status === "Falhou"
                                ? "Requer nova tentativa"
                                : "Aguardando conclusão"}
                          </p>
                        </div>

                        <div className="text-sm font-medium text-white">
                          {report.findings} apontamentos
                        </div>

                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                          aria-label="Mais ações"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-6">
                      <EmptyState text="Nenhum relatório encontrado para este usuário." />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

async function loadProfile(userId: string): Promise<LooseRecord | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

async function loadTasks(userId: string): Promise<LooseRecord[]> {
  const { data, error } = await supabase
    .from("project_tasks")
    .select(
      `
      *,
      audit_projects (
        id,
        title,
        code
      )
    `,
    )
    .or(`assigned_to.eq.${userId},created_by.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

async function loadReports(userId: string): Promise<LooseRecord[]> {
  const { data, error } = await supabase
    .from("audit_reports")
    .select(
      `
      *,
      audit_conversations!inner (
        id,
        title,
        audit_type,
        created_by,
        project_id
      )
    `,
    )
    .eq("audit_conversations.created_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

async function loadActivities(userId: string): Promise<LooseRecord[]> {
  const { data, error } = await supabase
    .from("audit_conversation_messages")
    .select(
      `
      *,
      audit_conversations!inner (
        id,
        title,
        created_by
      )
    `,
    )
    .eq("audit_conversations.created_by", userId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

async function loadProcessingJobs(userId: string): Promise<LooseRecord[]> {
  const { data, error } = await supabase
    .from("file_processing_jobs")
    .select(
      `
      *,
      audit_conversations!inner (
        id,
        created_by
      )
    `,
    )
    .eq("audit_conversations.created_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

function mapTaskRecordToDashboardTask(row: LooseRecord): DashboardTask {
  const dueDateRaw = row.due_date || row.deadline || row.due_at;
  const status = normalizeTaskStatus(row.status);
  const progress = inferTaskProgress(status);

  return {
    id: String(row.id ?? cryptoRandomId()),
    title: row.title || "Sem título",
    project:
      row.audit_projects?.title ||
      row.audit_projects?.code ||
      "Projeto não informado",
    dueDate: formatDateLabel(dueDateRaw),
    status,
    priority: inferTaskPriority(row, dueDateRaw, status),
    progress,
    createdAt: row.created_at || undefined,
  };
}

function mapReportRecordToDashboardReport(row: LooseRecord): DashboardReport {
  const normalizedStatus = normalizeReportStatus(row.status);
  const findingsCount = extractFindingsCount(row.response_payload);

  return {
    id: String(row.id ?? cryptoRandomId()),
    name:
      row.audit_conversations?.title ||
      row.markdown_content?.slice(0, 48)?.trim() ||
      "Relatório de auditoria",
    source:
      row.generator_endpoint ||
      row.audit_conversations?.audit_type ||
      "Sistema Chronos",
    createdAt: formatDateLabel(row.created_at || row.generated_at),
    status: normalizedStatus,
    progress: inferReportProgress(normalizedStatus),
    findings: findingsCount,
  };
}

function mapActivityRecordToDashboardActivity(row: LooseRecord): ActivityItem {
  const senderType = String(row.sender_type || "").toLowerCase();

  return {
    id: String(row.id ?? cryptoRandomId()),
    title:
      senderType === "agent"
        ? "Resposta da IA"
        : senderType === "system"
          ? "Evento do sistema"
          : "Mensagem do usuário",
    description: row.content || "Sem conteúdo disponível.",
    time: formatRelativeTime(row.created_at),
    kind:
      senderType === "agent"
        ? "success"
        : senderType === "system"
          ? "alert"
          : "task",
  };
}

function extractFindingsCount(payload: any): number {
  if (!payload || typeof payload !== "object") return 0;

  if (Array.isArray(payload.findings)) return payload.findings.length;
  if (Array.isArray(payload.inconsistencies))
    return payload.inconsistencies.length;
  if (typeof payload.total_findings === "number") return payload.total_findings;
  if (typeof payload.findings_count === "number") return payload.findings_count;
  if (typeof payload.issues_count === "number") return payload.issues_count;

  return 0;
}

function inferTaskPriority(
  row: LooseRecord,
  dueDateValue: string | null | undefined,
  status: TaskStatus,
): Priority {
  const raw = String(row.priority || "").toLowerCase();

  if (raw.includes("alta") || raw.includes("high")) return "Alta";
  if (
    raw.includes("média") ||
    raw.includes("media") ||
    raw.includes("medium")
  ) {
    return "Média";
  }
  if (raw.includes("baixa") || raw.includes("low")) return "Baixa";

  if (status === "Atrasada") return "Alta";

  if (dueDateValue) {
    const due = new Date(dueDateValue);
    if (!Number.isNaN(due.getTime())) {
      const now = Date.now();
      const diff = due.getTime() - now;
      const days = diff / (1000 * 60 * 60 * 24);

      if (days <= 2) return "Alta";
      if (days <= 7) return "Média";
    }
  }

  return "Baixa";
}

function inferTaskProgress(status: TaskStatus) {
  switch (status) {
    case "Concluída":
      return 100;
    case "Em andamento":
      return 60;
    case "Atrasada":
      return 35;
    default:
      return 10;
  }
}

function inferReportProgress(status: ReportStatus) {
  switch (status) {
    case "Concluído":
      return 100;
    case "Falhou":
      return 100;
    case "Processando":
      return 65;
    default:
      return 25;
  }
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}

function normalizeTaskStatus(value: string | null | undefined): TaskStatus {
  const normalized = String(value || "").toLowerCase();

  switch (normalized) {
    case "doing":
    case "in_progress":
    case "em andamento":
      return "Em andamento";
    case "done":
    case "completed":
    case "concluída":
    case "concluida":
      return "Concluída";
    case "blocked":
    case "overdue":
    case "atrasada":
      return "Atrasada";
    default:
      return "Pendente";
  }
}

function normalizeReportStatus(value: string | null | undefined): ReportStatus {
  const normalized = String(value || "").toLowerCase();

  if (normalized.includes("processing") || normalized.includes("processando")) {
    return "Processando";
  }

  if (
    normalized.includes("completed") ||
    normalized.includes("concluído") ||
    normalized.includes("concluido") ||
    normalized === "done"
  ) {
    return "Concluído";
  }

  if (
    normalized.includes("failed") ||
    normalized.includes("error") ||
    normalized.includes("falhou")
  ) {
    return "Falhou";
  }

  return "Gerando";
}

function clampPercentage(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) return "Sem data";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(value: string | null | undefined) {
  if (!value) return "agora";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "agora";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  if (hours < 24) return `há ${hours} h`;
  return `há ${days} d`;
}

function parseDateForSort(value: string) {
  if (!value || value === "Sem data") return Number.MAX_SAFE_INTEGER;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return Number.MAX_SAFE_INTEGER;

  return parsed.getTime();
}

function StatusBadge({ label }: { label: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    Pendente: "border-white/10 bg-white/5 text-zinc-300",
    "Em andamento": "border-blue-500/20 bg-blue-500/10 text-blue-200",
    Concluída: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    Atrasada: "border-red-500/20 bg-red-500/10 text-red-200",
  };

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        styles[label],
      )}
    >
      {label}
    </span>
  );
}

function PriorityBadge({ label }: { label: Priority }) {
  const styles: Record<Priority, string> = {
    Alta: "border-rose-500/20 bg-rose-500/10 text-rose-200",
    Média: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    Baixa: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
  };

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        styles[label],
      )}
    >
      Prioridade {label}
    </span>
  );
}

function ReportStatusBadge({ label }: { label: ReportStatus }) {
  const styles: Record<ReportStatus, string> = {
    Gerando: "border-blue-500/20 bg-blue-500/10 text-blue-200",
    Processando: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    Concluído: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    Falhou: "border-red-500/20 bg-red-500/10 text-red-200",
  };

  const icons: Record<ReportStatus, React.ReactNode> = {
    Gerando: <Loader2 className="size-3.5 animate-spin" />,
    Processando: <Clock3 className="size-3.5" />,
    Concluído: <CheckCircle2 className="size-3.5" />,
    Falhou: <AlertTriangle className="size-3.5" />,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        styles[label],
      )}
    >
      {icons[label]}
      {label}
    </span>
  );
}

function MiniAgendaItem({
  title,
  meta,
  tone,
}: {
  title: string;
  meta: string;
  tone: "warning" | "neutral" | "success";
}) {
  const dotStyles = {
    warning: "bg-amber-400",
    neutral: "bg-blue-400",
    success: "bg-emerald-400",
  };

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className={cn("mt-1 size-2.5 rounded-full", dotStyles[tone])} />
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-400">{meta}</p>
      </div>
    </div>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
      <Loader2 className="size-4 animate-spin text-[#d4af37]" />
      {text}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
      {text}
    </div>
  );
}