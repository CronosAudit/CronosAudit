// app/dashboard/page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  CheckCircle2,
  Clock3,
  Edit3,
  FileBarChart2,
  FileDown,
  FileText,
  Folder,
  ListTodo,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";

declare module "jspdf";
declare module "jspdf-autotable";

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
  conversationId: string;
  name: string;
  source: string;
  createdAt: string;
  status: ReportStatus;
  progress: number;
  findings: number;
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
  const [isSavingAction, setIsSavingAction] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

  const [tasks, setTasks] = React.useState<DashboardTask[]>([]);
  const [reports, setReports] = React.useState<DashboardReport[]>([]);
  const [summaryCards, setSummaryCards] =
    React.useState<SummaryCard[]>(EMPTY_SUMMARY_CARDS);

  const [radarPoints, setRadarPoints] = React.useState([
    { label: "Conformidade", value: 0 },
    { label: "Risco", value: 0 },
    { label: "Cobertura", value: 0 },
    { label: "Automação", value: 0 },
  ]);

  const [openReportActionsId, setOpenReportActionsId] = React.useState<
    string | null
  >(null);
  const [editingReport, setEditingReport] =
    React.useState<DashboardReport | null>(null);
  const [editingReportTitle, setEditingReportTitle] = React.useState("");

  const loadDashboard = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const user = session.user;

      const authDisplayName =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.display_name ||
        "";

      setUserName(authDisplayName);
      setUserEmail(user.email ?? "");

      const [tasksData, reportsData, processingJobsData] = await Promise.all([
        loadTasks(user.id),
        loadReports(user.id),
        loadProcessingJobs(user.id),
      ]);

      setUserName(authDisplayName || user.email?.split("@")[0] || "usuário");
      setUserEmail(user.email || "");

      const mappedTasks = tasksData.map(mapTaskRecordToDashboardTask);
      const mappedReports = reportsData.map(mapReportRecordToDashboardReport);

      setTasks(mappedTasks);
      setReports(mappedReports);

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
  }, [router]);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      if (!target?.closest("[data-report-actions]")) {
        setOpenReportActionsId(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenReportActionsId(null);
        setEditingReport(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  async function handleExportAllReportsCsv() {
    if (!filteredReports.length) return;
    exportReportsAsCsv(filteredReports, "visao-relatorios.csv");
  }

  async function handleExportAllReportsPdf() {
    if (!filteredReports.length) return;
    await exportReportsAsPdf(filteredReports, "visao-relatorios.pdf");
  }

  function handleEditReportTitle(report: DashboardReport) {
    setEditingReport(report);
    setEditingReportTitle(report.name);
    setOpenReportActionsId(null);
    setError("");
    setSuccessMessage("");
  }

  async function handleSaveReportTitle() {
    if (!editingReport || isSavingAction) return;

    const nextTitle = editingReportTitle.trim();

    if (!nextTitle) {
      setError("Informe um título para salvar.");
      return;
    }

    try {
      setIsSavingAction(true);
      setError("");
      setSuccessMessage("");

      const { error: updateError } = await supabase
        .from("audit_conversations")
        .update({
          title: nextTitle,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingReport.conversationId);

      if (updateError) {
        throw updateError;
      }

      setReports((current) =>
        current.map((item) =>
          item.conversationId === editingReport.conversationId
            ? { ...item, name: nextTitle }
            : item,
        ),
      );

      setEditingReport(null);
      setEditingReportTitle("");
      setSuccessMessage("Título atualizado com sucesso.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o título.",
      );
    } finally {
      setIsSavingAction(false);
    }
  }

  async function handleArchiveReport(report: DashboardReport) {
    if (isSavingAction) return;

    try {
      setIsSavingAction(true);
      setError("");
      setSuccessMessage("");
      setOpenReportActionsId(null);

      const { error: updateError } = await supabase
        .from("audit_conversations")
        .update({
          status: "archived",
          updated_at: new Date().toISOString(),
        })
        .eq("id", report.conversationId);

      if (updateError) {
        throw updateError;
      }

      setReports((current) =>
        current.filter((item) => item.conversationId !== report.conversationId),
      );
      setSuccessMessage("Conversa arquivada com sucesso.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível arquivar a conversa.",
      );
    } finally {
      setIsSavingAction(false);
    }
  }

  async function handleDeleteReport(report: DashboardReport) {
    if (isSavingAction) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta conversa? Essa ação remove a conversa e os relatórios vinculados.",
    );

    if (!confirmed) return;

    try {
      setIsSavingAction(true);
      setError("");
      setSuccessMessage("");
      setOpenReportActionsId(null);

      const { error: deleteError } = await supabase
        .from("audit_conversations")
        .delete()
        .eq("id", report.conversationId);

      if (deleteError) {
        throw deleteError;
      }

      setReports((current) =>
        current.filter((item) => item.conversationId !== report.conversationId),
      );
      setSuccessMessage("Conversa excluída com sucesso.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir a conversa.",
      );
    } finally {
      setIsSavingAction(false);
    }
  }

  function handleExportSingleReportCsv(report: DashboardReport) {
    exportReportsAsCsv([report], `conversa-${report.conversationId}-relatorio.csv`);
    setOpenReportActionsId(null);
  }

  async function handleExportSingleReportPdf(report: DashboardReport) {
    setOpenReportActionsId(null);
    await exportReportsAsPdf([report], `conversa-${report.conversationId}-relatorio.pdf`);
  }

  function exportReportsAsCsv(
    reportsToExport: DashboardReport[],
    filename: string,
  ) {
    const headers = [
      "ID do relatório",
      "ID da conversa",
      "Título",
      "Status",
      "Progresso",
      "Achados",
      "Criado em",
    ];

    const rows = reportsToExport.map((report) => [
      report.id,
      report.conversationId,
      report.name,
      report.status,
      `${report.progress}%`,
      String(report.findings ?? 0),
      report.createdAt,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  async function exportReportsAsPdf(
    reportsToExport: DashboardReport[],
    filename: string,
  ) {
    if (!reportsToExport.length) return;

    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable =
      autoTableModule.default ||
      (autoTableModule as any).autoTable ||
      (autoTableModule as any);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const headers = [
      "Título",
      "Status",
      "Progresso",
      "Achados",
      "Criado em",
    ];
    const body = reportsToExport.map((report) => [
      report.name,
      report.status,
      `${report.progress}%`,
      String(report.findings ?? 0),
      report.createdAt,
    ]);

    doc.setFontSize(14);
    doc.setTextColor(212, 175, 53);
    doc.text("Visão de Relatórios Chronos Audit", 40, 40);

    autoTable(doc, {
      startY: 70,
      head: [headers],
      body,
      headStyles: {
        fillColor: [212, 175, 53],
        textColor: 20,
      },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: 20,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      theme: "grid",
      margin: { left: 40, right: 40, bottom: 40 },
    });

    doc.save(filename);
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

      <main className="overflow-x-hidden bg-[#0b0b0c] text-white">
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

          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 pb-10 pt-24 sm:gap-8 sm:px-6 sm:pb-12 sm:pt-28 md:pt-32 lg:px-8 lg:pt-36">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {successMessage}
              </div>
            )}

            <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr] xl:gap-6">
              <div className="rounded-[24px] border border-white/10 bg-[#111214]/85 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:rounded-[28px] sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/5 px-3 py-2 text-xs text-[#f4e7b2] backdrop-blur-md sm:px-4 sm:text-sm">
                      <Sparkles className="size-4" />
                      Painel inteligente do Chronos Audit
                    </div>

                    <h1 className="mt-4 text-2xl font-semibold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
                      Olá
                      <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                        {" "}
                        {userName || "usuário"}
                      </span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:mt-4 sm:text-base sm:leading-7">
                      Acompanhe suas tarefas, relatórios, processamento e os
                      principais pontos de atenção da sua conta.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-col xl:flex-row">
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
                      <Folder className="mr-2 size-4" />
                      Documentos
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 xl:grid-cols-4">
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
                        <p className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                          {isLoading ? "..." : card.value}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500 sm:text-sm">
                          {card.helper}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#111214]/85 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:rounded-[28px] sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#f4e7b2]">
                      Pontos de atenção
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                      Saúde operacional
                    </h2>
                  </div>
                  <ShieldCheck className="size-5 text-[#d4af37]" />
                </div>

                <div className="mt-5 space-y-4 sm:mt-6">
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

                <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 sm:mt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-300" />
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

            <section className="rounded-[24px] border border-white/10 bg-[#111214]/85 p-3 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:rounded-[28px] sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="grid w-full gap-4 lg:max-w-[68%]">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f4e7b2] sm:text-sm">
                      Relatórios criados
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white sm:text-2xl">
                      Processamento e resultados
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-zinc-500 sm:hidden">
                      Use o menu de ações para editar, exportar, arquivar ou
                      excluir uma conversa.
                    </p>
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar relatório"
                    className="h-11 w-full rounded-2xl border border-white/10 bg-black/80 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>

                <div className="grid w-full grid-cols-2 gap-2 lg:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isLoading || isSavingAction || !filteredReports?.length}
                    onClick={handleExportAllReportsCsv}
                    className="h-10 w-full rounded-2xl border border-white/10 px-3 text-xs text-white hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-4 sm:text-sm"
                  >
                    <FileDown className="mr-2 size-4" />
                    <span className="sm:hidden">CSV</span>
                    <span className="hidden sm:inline">Exportar CSV</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isLoading || isSavingAction || !filteredReports?.length}
                    onClick={handleExportAllReportsPdf}
                    className="h-10 w-full rounded-2xl border border-white/10 px-3 text-xs text-white hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-4 sm:text-sm"
                  >
                    <FileText className="mr-2 size-4" />
                    <span className="sm:hidden">PDF</span>
                    <span className="hidden sm:inline">Exportar PDF</span>
                  </Button>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
                <div className="overflow-x-auto">
                  <div className="hidden grid-cols-[1.5fr_0.9fr_0.9fr_48px] bg-white/[0.04] px-5 py-4 text-sm font-medium text-zinc-300 md:grid">
                    <div>Relatório</div>
                    <div>Status</div>
                    <div>Achados</div>
                    <div />
                  </div>

                  <div className="divide-y divide-white/10 max-h-[42rem] overflow-y-auto">
                    {isLoading ? (
                    <div className="px-4 py-6 sm:px-5 sm:py-8">
                      <LoadingState text="Carregando relatórios..." />
                    </div>
                  ) : Array.isArray(filteredReports) &&
                    filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                      const progress = Math.min(
                        Math.max(Number(report.progress || 0), 0),
                        100,
                      );
                      const status = report.status || "Processando";
                      const isCompleted = status === "Concluído";
                      const isFailed = status === "Falhou";

                      return (
                        <article
                          key={report.id}
                          className="relative grid gap-3 bg-black/10 px-3 py-4 transition hover:bg-white/[0.03] sm:px-5 md:grid-cols-[1.5fr_0.9fr_0.9fr_48px] md:items-center md:gap-4"
                        >
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3 md:block">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">
                                    {String(report.conversationId || report.id || "").slice(0, 8) ||
                                      "sem-id"}
                                  </span>
                                  <ReportStatusBadge label={status} />
                                </div>

                                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-white sm:text-base md:truncate">
                                  {report.name || "Relatório sem nome"}
                                </p>
                              </div>

                              <div
                                className="shrink-0 md:hidden"
                                data-report-actions
                              >
                                <ReportActionsMenu
                                  report={report}
                                  isOpen={openReportActionsId === report.id}
                                  disabled={isSavingAction}
                                  onToggle={() =>
                                    setOpenReportActionsId((current) =>
                                      current === report.id ? null : report.id,
                                    )
                                  }
                                  onEdit={() => handleEditReportTitle(report)}
                                  onArchive={() => handleArchiveReport(report)}
                                  onDelete={() => handleDeleteReport(report)}
                                  onExportCsv={() =>
                                    handleExportSingleReportCsv(report)
                                  }
                                  onExportPdf={() =>
                                    handleExportSingleReportPdf(report)
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 md:hidden">
                              <span>{report.createdAt || "Sem data"}</span>
                              <span className="h-1 w-1 rounded-full bg-zinc-700" />
                              <span>
                                {Number(report.findings || 0)} apontamentos
                              </span>
                            </div>

                            <p className="mt-1 hidden text-sm text-zinc-500 md:block">
                              Criado em {report.createdAt || "data não informada"}
                            </p>

                            <div className="mt-3 max-w-sm space-y-2">
                              <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>Progresso</span>
                                <span>{progress}%</span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="hidden md:block">
                            <p className="text-sm text-white">{status}</p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {isCompleted
                                ? "Disponível para revisão"
                                : isFailed
                                  ? "Requer nova tentativa"
                                  : "Aguardando conclusão"}
                            </p>
                          </div>

                          <div className="hidden text-sm font-medium text-white md:block">
                            {Number(report.findings || 0)} apontamentos
                          </div>

                          <div
                            className="relative hidden md:block"
                            data-report-actions
                          >
                            <ReportActionsMenu
                              report={report}
                              isOpen={openReportActionsId === report.id}
                              disabled={isSavingAction}
                              onToggle={() =>
                                setOpenReportActionsId((current) =>
                                  current === report.id ? null : report.id,
                                )
                              }
                              onEdit={() => handleEditReportTitle(report)}
                              onArchive={() => handleArchiveReport(report)}
                              onDelete={() => handleDeleteReport(report)}
                              onExportCsv={() =>
                                handleExportSingleReportCsv(report)
                              }
                              onExportPdf={() =>
                                handleExportSingleReportPdf(report)
                              }
                            />
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 sm:px-5 sm:py-8">
                      <EmptyState text="Nenhum relatório encontrado para este usuário." />
                    </div>
                                   )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center sm:p-4">
          <div className="w-full max-w-2xl rounded-[24px] border border-white/10 bg-[#111214] p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:rounded-[28px] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d4af37] sm:text-sm">
                  Editar título da conversa
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                  Atualizar nome do relatório
                </h2>
              </div>
              <button
                type="button"
                disabled={isSavingAction}
                onClick={() => setEditingReport(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fechar modal"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-zinc-300">
                Título da conversa
              </label>
              <input
                type="text"
                value={editingReportTitle}
                disabled={isSavingAction}
                onChange={(event) => setEditingReportTitle(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                disabled={isSavingAction}
                onClick={() => setEditingReport(null)}
                className="h-11 w-full rounded-2xl border border-white/10 px-5 text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={isSavingAction}
                onClick={handleSaveReportTitle}
                className="h-11 w-full rounded-2xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isSavingAction ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar título"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
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
        project_id,
        status
      )
    `,
    )
    .eq("audit_conversations.created_by", userId)
    .neq("audit_conversations.status", "archived")
    .order("created_at", { ascending: false });

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
        created_by,
        status
      )
    `,
    )
    .eq("audit_conversations.created_by", userId)
    .neq("audit_conversations.status", "archived")
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
  const normalizedStatus = normalizeReportStatus(row);
  const findingsCount = extractFindingsCount(row.response_payload);
  const conversationId = String(row.conversation_id || row.audit_conversations?.id || "");

  return {
    id: String(row.id ?? cryptoRandomId()),
    conversationId: conversationId || String(row.id ?? cryptoRandomId()),
    name:
      row.audit_conversations?.title ||
      row.markdown_content?.slice(0, 48)?.trim() ||
      row.response_payload?.relatorio_markdown?.slice(0, 48)?.trim() ||
      row.report_hash ||
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

function extractFindingsCount(payload: any): number {
  if (!payload || typeof payload !== "object") return 0;

  if (Array.isArray(payload.findings)) return payload.findings.length;
  if (Array.isArray(payload.inconsistencies)) {
    return payload.inconsistencies.length;
  }
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

function normalizeReportStatus(row: LooseRecord): ReportStatus {
  const normalized = String(row.status || "").toLowerCase();

  const hasResult =
    Boolean(row.result_link) ||
    Boolean(row.storage_path) ||
    Boolean(row.markdown_content) ||
    Boolean(row.relatorio_markdown) ||
    Boolean(row.response_payload?.relatorio_markdown) ||
    Boolean(row.response_payload?.markdown_content);

  if (
    hasResult ||
    normalized.includes("completed") ||
    normalized.includes("complete") ||
    normalized.includes("concluído") ||
    normalized.includes("concluido") ||
    normalized.includes("sucesso") ||
    normalized === "done" ||
    normalized === "success"
  ) {
    return "Concluído";
  }

  if (
    normalized.includes("failed") ||
    normalized.includes("error") ||
    normalized.includes("falhou") ||
    normalized.includes("erro")
  ) {
    return "Falhou";
  }

  if (
    normalized.includes("processing") ||
    normalized.includes("processando") ||
    normalized.includes("running")
  ) {
    return "Processando";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("queued") ||
    normalized.includes("gerando")
  ) {
    return "Gerando";
  }

  return "Processando";
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs",
        styles[label],
      )}
    >
      {icons[label]}
      {label}
    </span>
  );
}

function ReportActionsMenu({
  report,
  isOpen,
  disabled,
  onToggle,
  onEdit,
  onArchive,
  onDelete,
  onExportCsv,
  onExportPdf,
}: {
  report: DashboardReport;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
}) {
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111214]/80 text-zinc-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Mais ações do relatório ${report.name || ""}`}
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar menu de ações"
            className="fixed inset-0 z-40 bg-black/45 md:hidden"
            onClick={onToggle}
          />

          <div className="fixed inset-x-3 bottom-3 z-50 max-h-[78vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#111214]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl md:absolute md:inset-auto md:right-0 md:top-full md:mt-3 md:w-72">
            <div className="mb-2 flex items-center justify-between px-2 md:hidden">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Ações</p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {report.name || "Relatório sem nome"}
                </p>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={onToggle}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fechar ações"
              >
                <X className="size-4" />
              </button>
            </div>

            <ActionButton
              icon={Edit3}
              label="Editar título"
              onClick={onEdit}
              disabled={disabled}
            />
            <ActionButton
              icon={Archive}
              label="Arquivar conversa"
              onClick={onArchive}
              disabled={disabled}
            />
            <ActionButton
              icon={FileDown}
              label="Exportar CSV"
              onClick={onExportCsv}
              disabled={disabled}
            />
            <ActionButton
              icon={FileText}
              label="Exportar PDF"
              onClick={onExportPdf}
              disabled={disabled}
            />
            <ActionButton
              icon={Trash2}
              label="Excluir conversa"
              onClick={onDelete}
              disabled={disabled}
              danger
            />
          </div>
        </>
      )}
    </>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  danger = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50",
        danger
          ? "text-red-300 hover:bg-red-500/10"
          : "text-white hover:bg-white/10",
      )}
    >
      <Icon
        className={cn("size-4", danger ? "text-red-400" : "text-[#d4af37]")}
      />
      {label}
    </button>
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
