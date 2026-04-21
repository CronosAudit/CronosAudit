"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpIcon,
  Check,
  Copy,
  Download,
  FileSearch,
  FileText,
  FileUp,
  Paperclip,
  Scale,
  ShieldCheck,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LandingProps } from "./types";
import { AuditMetadataForm } from "./audit-metadata-form";
import { InlineMetaBadge, QuickAction } from "./chat-ui";

export function ChatLandingView({
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
  isLoading,
  isGeneratingReport,
  hasMessage,
  activeConversation,
  latestReport,
  errorMessage,
  textareaRef,
  adjustHeight,
  fileInputRef,
  handleFileChange,
  handleClear,
  handleSubmit,
  handleGenerateReport,
  companyQuery,
  setCompanyQuery,
  companySuggestions,
  setCompanySuggestions,
  isSearchingCompanies,
  showCompanySuggestions,
  setShowCompanySuggestions,
}: LandingProps) {
  const suggestedPrompt =
    "Analise este documento e identifique riscos relevantes, inconsistências, pontos de atenção para auditoria e uma proposta de evidências a serem solicitadas.";

  const [copiedPrompt, setCopiedPrompt] = useState(false);

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(suggestedPrompt);
      setCopiedPrompt(true);

      window.setTimeout(() => {
        setCopiedPrompt(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar prompt:", error);
    }
  }

  return (
    <section
      id="chat"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-3 py-4 sm:px-4 sm:py-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <Link
            href="/dashboard"
            className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 backdrop-blur-md transition hover:bg-black/45 hover:text-white sm:px-4"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="truncate">Voltar</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/35 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-[28px] lg:rounded-[32px]">
          <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(212,175,55,0.12),rgba(212,175,55,0.03))] px-4 py-5 sm:px-6 sm:py-6 lg:px-7">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#f4e7b2] sm:px-4 sm:text-sm">
                <Sparkles className="size-4 shrink-0" />
                <span className="truncate">Assistente Chronos Audit</span>
              </div>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
                Converse com a IA da sua auditoria
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:mt-4 sm:text-base sm:leading-7 md:text-lg">
                Envie documentos, consolide achados, identifique inconsistências
                e gere o relatório final com mais contexto, governança e
                rastreabilidade.
              </p>

              {activeConversation && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5 sm:gap-3">
                  <InlineMetaBadge
                    icon={<MessageSquare className="size-3.5" />}
                    label={activeConversation.title}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="px-3 pb-4 pt-4 sm:px-5 sm:pb-6 sm:pt-5 md:px-6 md:pb-8 md:pt-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              {errorMessage && (
                <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 sm:mb-5">
                  {errorMessage}
                </div>
              )}

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
              />

              {latestReport?.resultLink && (
                <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:mb-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Último relatório disponível
                      </p>
                      <p className="mt-1 break-all text-sm text-emerald-100/90">
                        Hash: {latestReport.reportHash}
                      </p>
                    </div>

                    <a
                      href={latestReport.resultLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#c9a633] sm:w-auto"
                    >
                      <Download className="size-4 shrink-0" />
                      Abrir relatório
                    </a>
                  </div>
                </div>
              )}

              <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:mb-5 sm:p-5">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#f4e7b2]">
                    <ShieldCheck className="size-4 shrink-0" />
                    Sugestão de prompt
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCopyPrompt}
                    className="h-9 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="mr-2 size-4 text-emerald-400" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 size-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>

                <p className="break-words text-sm leading-6 text-zinc-300">
                  &quot;{suggestedPrompt}&quot;
                </p>
              </div>

              <div className="relative rounded-[22px] border border-white/10 bg-[#0f1012]/80 shadow-xl shadow-black/20 sm:rounded-[24px]">
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
                  placeholder="Ex.: Leia este contrato e destaque riscos, cláusulas críticas e evidências necessárias..."
                  className={cn(
                    "min-h-[72px] w-full resize-none border-none px-4 py-4",
                    "bg-transparent text-sm text-white sm:px-5 sm:py-5 md:text-base",
                    "placeholder:text-zinc-500",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                  )}
                  style={{ overflow: "hidden" }}
                />

                <div className="flex flex-col gap-3 border-t border-white/10 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="hidden rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white sm:inline-flex"
                    >
                      <Paperclip className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full justify-start rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white sm:w-auto sm:max-w-[320px]"
                    >
                      <FileUp className="mr-2 size-4 shrink-0" />
                      <span className="truncate">
                        {file ? file.name : "Enviar arquivo"}
                      </span>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClear}
                      className="w-full rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white sm:w-auto"
                    >
                      Limpar
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!hasMessage || isLoading}
                      className={cn(
                        "w-full rounded-xl px-4 font-medium transition-all sm:w-auto",
                        hasMessage
                          ? "bg-[#d4af37] text-black hover:bg-[#c9a633]"
                          : "bg-neutral-700 text-neutral-400",
                      )}
                    >
                      <ArrowUpIcon className="mr-2 size-4 shrink-0" />
                      {isLoading ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 xl:grid-cols-4">
                <QuickAction
                  icon={<FileSearch className="size-4" />}
                  label="Analisar documento"
                  onClick={() =>
                    setMessage(
                      "Analise este documento e destaque inconsistências, riscos e lacunas de evidência.",
                    )
                  }
                />
                <QuickAction
                  icon={<ShieldCheck className="size-4" />}
                  label="Mapear riscos"
                  onClick={() =>
                    setMessage(
                      "Mapeie os principais riscos materiais encontrados.",
                    )
                  }
                />
                <QuickAction
                  icon={<Scale className="size-4" />}
                  label="Avaliar governança"
                  onClick={() =>
                    setMessage(
                      "Avalie os pontos de governança e controle interno.",
                    )
                  }
                />
                <QuickAction
                  icon={<FileUp className="size-4" />}
                  label="Ler evidências"
                  onClick={() =>
                    setMessage(
                      "Leia as evidências e aponte lacunas documentais.",
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}