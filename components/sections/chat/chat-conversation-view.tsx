"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpIcon,
  Download,
  ExternalLink,
  FileText,
  FileUp,
  Hourglass,
  Loader2,
  Menu,
  MessageSquare,
  Paperclip,
  PanelLeft,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConversationProps } from "./types";
import { AuditMetadataForm } from "./audit-metadata-form";
import { InlineMetaBadge, StatusBadge } from "./chat-ui";
import { formatConversationDate, formatTimeLabel } from "./utils";

export function ChatConversationView({
  conversations,
  activeConversationId,
  activeConversation,
  sidebarOpen,
  setSidebarOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  createConversation,
  deleteConversation,
  setActiveConversationId,
  message,
  setMessage,
  file,
  cnpj,
  setCnpj,
  regimeTributario,
  setRegimeTributario,
  anoFiscal,
  setAnoFiscal,
  docType,
  setDocType,
  messages,
  latestReport,
  conversationFiles,
  isLoading,
  isGeneratingReport,
  hasMessage,
  errorMessage,
  textareaRef,
  adjustHeight,
  fileInputRef,
  handleFileChange,
  handleClear,
  handleSubmit,
  handleGenerateReport,
  messagesEndRef,
  companyQuery,
  setCompanyQuery,
  companySuggestions,
  setCompanySuggestions,
  isSearchingCompanies,
  showCompanySuggestions,
  setShowCompanySuggestions,
}: ConversationProps) {
  const [conversationToDelete, setConversationToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);

  const handleRequestDeleteConversation = (
    conversationId: string,
    conversationTitle: string,
  ) => {
    setConversationToDelete({
      id: conversationId,
      title: conversationTitle,
    });
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingConversation) return;
    setConversationToDelete(null);
  };

  const handleConfirmDeleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      setIsDeletingConversation(true);
      await Promise.resolve(deleteConversation(conversationToDelete.id));
      setConversationToDelete(null);
    } finally {
      setIsDeletingConversation(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full overflow-hidden bg-black">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {conversationToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fechar confirmação de exclusão"
            onClick={handleCloseDeleteModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative z-[81] w-full max-w-md rounded-3xl border border-white/10 bg-[#111214]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
                <AlertTriangle className="size-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white">
                  Excluir conversa?
                </h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Tem certeza de que deseja excluir esta conversa? Essa ação não
                  poderá ser desfeita.
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Conversa selecionada
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {conversationToDelete.title}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCloseDeleteModal}
                disabled={isDeletingConversation}
                className="rounded-xl border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDeleteConversation}
                disabled={isDeletingConversation}
                className="rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
              >
                {isDeletingConversation ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 size-4" />
                    Sim, excluir
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-white/10 bg-[#0b0c0f]/95 backdrop-blur-2xl transition-all duration-300 lg:static lg:z-auto lg:block",
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          sidebarOpen ? "w-[310px]" : "w-[310px] lg:w-[96px]",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <Link
              href="/dashboard"
              className={cn(
                "min-w-0 transition-all duration-300",
                sidebarOpen
                  ? "flex-1"
                  : "flex-1 lg:flex lg:items-center lg:justify-center",
              )}
            >
              <div
                className={cn(
                  "flex items-center transition-all duration-300",
                  sidebarOpen ? "gap-3" : "justify-center",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 via-[#b88746]/10 to-transparent text-[#d4af37] shadow-lg shadow-[#d4af37]/10">
                  <Hourglass className="size-5 shrink-0" />
                </div>

                <div
                  className={cn(
                    "min-w-0 overflow-hidden leading-tight transition-all duration-300",
                    !sidebarOpen && "lg:hidden",
                  )}
                >
                  <p className="truncate text-sm font-semibold tracking-[0.22em] text-[#f4e7b2]">
                    Chronos
                  </p>
                  <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">
                    Audit
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="hidden text-zinc-300 hover:bg-white/10 hover:text-white lg:inline-flex"
              >
                <PanelLeft className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(false)}
                className="text-zinc-300 hover:bg-white/10 hover:text-white lg:hidden"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <div className="border-b border-white/10 p-4">
            <Button
              type="button"
              onClick={createConversation}
              className={cn(
                "w-full rounded-2xl bg-[var(--accent-amber)] text-black hover:brightness-105",
                !sidebarOpen && "lg:px-0",
              )}
            >
              <Plus className={cn("size-4 shrink-0", sidebarOpen && "mr-2")} />
              <span className={cn(!sidebarOpen && "lg:hidden")}>
                Nova conversa
              </span>
            </Button>
          </div>

          <div className="chat-scroll-y flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;

                return (
                  <div
                    key={conversation.id}
                    className={cn(
                      "group rounded-2xl border transition",
                      isActive
                        ? "border-[var(--accent-amber-border)] bg-[var(--accent-amber-soft)]"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-start justify-between gap-3 px-3 py-3",
                        !sidebarOpen && "lg:justify-center lg:px-2",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveConversationId(conversation.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={cn(
                          "min-w-0 flex-1 text-left",
                          !sidebarOpen && "lg:flex lg:flex-1 lg:justify-center",
                        )}
                        title={conversation.title}
                        aria-label={conversation.title}
                      >
                        {sidebarOpen ? (
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {conversation.title}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {formatConversationDate(conversation.updatedAt)}
                            </p>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl border transition",
                              isActive
                                ? "border-[var(--accent-amber-border)] bg-[var(--accent-amber-soft)] text-[var(--accent-amber)]"
                                : "border-white/10 bg-white/[0.03] text-zinc-400 group-hover:border-white/15 group-hover:text-white",
                            )}
                          >
                            <MessageSquare className="size-4" />
                          </div>
                        )}
                      </button>

                      {sidebarOpen && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRequestDeleteConversation(
                              conversation.id,
                              conversation.title,
                            )
                          }
                          className="shrink-0 rounded-lg p-1 text-zinc-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
                          aria-label={`Excluir conversa ${conversation.title}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/30 px-3 py-3 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(true)}
                className="text-zinc-300 hover:bg-white/10 hover:text-white lg:hidden"
              >
                <Menu className="size-4" />
              </Button>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 transition hover:bg-black/45 hover:text-white"
              >
                <ArrowLeft className="size-4 shrink-0" />
                <span className="hidden sm:inline">Voltar</span>
              </Link>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {activeConversation.title}
                </p>
                <p className="truncate text-xs text-zinc-400">
                  {activeConversation.conversationHash}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="chat-scroll-y flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
          <div className="flex w-full flex-col gap-5">
            {errorMessage && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            )}

            <div
              className={cn(
                "grid w-full gap-5",
                "grid-cols-1",
                sidebarOpen
                  ? "2xl:grid-cols-[minmax(0,1.7fr)_320px]"
                  : "xl:grid-cols-[minmax(0,1.9fr)_300px] 2xl:grid-cols-[minmax(0,2.2fr)_320px]",
              )}
            >
              <div className="chat-panel-strong min-w-0 overflow-hidden rounded-3xl">
                <div className="chat-divider border-b px-4 py-4 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <InlineMetaBadge
                      icon={<MessageSquare className="size-3.5" />}
                      label={`${messages.length} mensagens`}
                    />
                    <InlineMetaBadge
                      icon={<FileText className="size-3.5" />}
                      label={`${conversationFiles.length} arquivos`}
                    />
                    {latestReport?.resultLink && (
                      <InlineMetaBadge
                        icon={<Download className="size-3.5" />}
                        label="Relatório disponível"
                      />
                    )}
                  </div>
                </div>

                <div className="chat-scroll-y max-h-[46vh] overflow-y-auto px-3 py-4 sm:max-h-[50vh] sm:px-5 lg:max-h-[56vh] xl:max-h-[60vh]">
                  <div className="space-y-4">
                    {messages.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex w-full",
                          item.role === "user"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[98%] rounded-3xl border px-4 py-3 sm:max-w-[94%]",
                            !sidebarOpen && "2xl:max-w-[92%]",
                            sidebarOpen && "xl:max-w-[88%] 2xl:max-w-[86%]",
                            item.role === "user"
                              ? "border-[var(--accent-amber-border)] bg-[var(--accent-amber-soft)] text-zinc-100"
                              : "border-white/10 bg-white/[0.04] text-zinc-200",
                          )}
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                              {item.role === "user" ? "Você" : "Assistente"}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {formatTimeLabel(item.createdAt)}
                            </span>
                          </div>

                          <div className="whitespace-pre-wrap break-words text-sm leading-6 sm:text-[15px]">
                            {item.content}
                          </div>

                          {(item.fileName ||
                            item.reportLink ||
                            item.reportStatus) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.fileName && (
                                <InlineMetaBadge
                                  icon={<FileUp className="size-3.5" />}
                                  label={item.fileName}
                                />
                              )}

                              {item.reportStatus && (
                                <StatusBadge label={item.reportStatus} />
                              )}

                              {item.reportLink && (
                                <a
                                  href={item.reportLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-100 transition hover:bg-emerald-500/20"
                                >
                                  <Download className="size-3.5" />
                                  Abrir relatório
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {(isLoading || isGeneratingReport) && (
                      <div className="flex justify-start">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-zinc-300">
                          <div className="flex items-center gap-2 text-sm">
                            <Loader2 className="size-4 animate-spin text-[var(--accent-amber)]" />
                            {isGeneratingReport
                              ? "Gerando relatório..."
                              : "Processando solicitação..."}
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="chat-divider border-t p-3 sm:p-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      adjustHeight();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="Digite sua análise, pedido de revisão ou envie um documento..."
                    className={cn(
                      "w-full resize-none rounded-2xl border border-white/10 bg-white/[0.02]",
                      "px-4 py-3 text-sm text-white sm:px-5 md:text-base",
                      "placeholder:text-zinc-500",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "min-h-[72px] max-h-[140px] sm:min-h-[76px] sm:max-h-[150px]",
                    )}
                    style={{ overflowY: "auto", overflowX: "hidden" }}
                  />

                  <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full justify-start rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white sm:w-auto sm:max-w-[360px]"
                      >
                        <Paperclip className="mr-2 size-4" />
                        <span className="truncate">
                          {file ? file.name : "Enviar arquivo"}
                        </span>
                      </Button>

                      {file && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClear}
                          className="rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          Limpar rascunho
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
                      <Button
                        type="button"
                        onClick={handleGenerateReport}
                        disabled={
                          isGeneratingReport || conversationFiles.length === 0
                        }
                        className="rounded-xl border border-white/10 bg-white/[0.05] text-zinc-100 hover:bg-white/10 disabled:opacity-50"
                      >
                        {isGeneratingReport ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 size-4" />
                            Gerar relatório
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!hasMessage || isLoading}
                        className={cn(
                          "rounded-xl px-4 font-medium",
                          hasMessage
                            ? "bg-[var(--accent-amber)] text-black hover:brightness-105"
                            : "bg-neutral-700 text-neutral-400",
                        )}
                      >
                        <ArrowUpIcon className="mr-2 size-4" />
                        {isLoading ? "Enviando..." : "Enviar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="min-w-0 space-y-5">
                <div className="chat-panel rounded-3xl p-4 sm:p-5">
                  <AuditMetadataForm
                    cnpj={cnpj}
                    setCnpj={setCnpj}
                    regimeTributario={regimeTributario}
                    setRegimeTributario={setRegimeTributario}
                    anoFiscal={anoFiscal}
                    setAnoFiscal={setAnoFiscal}
                    docType={docType}
                    setDocType={setDocType}
                    companyQuery={companyQuery}
                    setCompanyQuery={setCompanyQuery}
                    companySuggestions={companySuggestions}
                    setCompanySuggestions={setCompanySuggestions}
                    isSearchingCompanies={isSearchingCompanies}
                    showCompanySuggestions={showCompanySuggestions}
                    setShowCompanySuggestions={setShowCompanySuggestions}
                    compact
                  />
                </div>

                <div className="chat-panel rounded-3xl p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-[#f4e7b2]">
                    <FileText className="size-4 shrink-0" />
                    Arquivos da conversa
                  </div>

                  {conversationFiles.length === 0 ? (
                    <p className="text-sm text-zinc-400">
                      Nenhum arquivo anexado nesta conversa.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {conversationFiles.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3"
                        >
                          <p className="truncate text-sm font-medium text-white">
                            {item.originalFileName}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatConversationDate(item.createdAt)} às{" "}
                            {formatTimeLabel(item.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {latestReport && (
                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">
                        Último relatório
                      </p>
                      <StatusBadge label={latestReport.status} />
                    </div>

                    <div className="space-y-2 text-sm text-emerald-100/90">
                      <p className="break-all">
                        Hash: {latestReport.reportHash}
                      </p>

                      {latestReport.generatedAt && (
                        <p>
                          Gerado em{" "}
                          {formatConversationDate(latestReport.generatedAt)} às{" "}
                          {formatTimeLabel(latestReport.generatedAt)}
                        </p>
                      )}

                      {latestReport.resultLink ? (
                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-200/80">
                            Link do relatório
                          </p>
                          <a
                            href={latestReport.resultLink}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-sm text-white underline decoration-emerald-300/40 underline-offset-4 transition hover:text-emerald-100"
                          >
                            {latestReport.resultLink}
                          </a>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
                          O relatório foi gerado, mas nenhum link de visualização
                          foi retornado pela API.
                        </div>
                      )}
                    </div>

                    {latestReport.resultLink && (
                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <a
                          href={latestReport.resultLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber)] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-105"
                        >
                          <Download className="size-4" />
                          Visualizar relatório
                        </a>

                        <a
                          href={latestReport.resultLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          <ExternalLink className="size-4" />
                          Abrir link
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}