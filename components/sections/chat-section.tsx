"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FileUp,
  MonitorIcon,
  ArrowUpIcon,
  Paperclip,
  ShieldCheck,
  BrainCircuit,
  FileSearch,
  Scale,
  BarChart3,
  ScrollText,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export function ChatSection() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 64,
    maxHeight: 220,
  });

  const hasMessage = message.trim().length > 0 || file !== null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setMessage("");
    setFile(null);
    adjustHeight(true);
  };

  const handleSubmit = async () => {
    if (!hasMessage) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (message) formData.append("message", message);
      if (file) formData.append("file", file);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sucesso:", data);
        handleClear();
        setUploadStatus({
          type: "success",
          message: "Arquivo enviado com sucesso!",
        });
        setTimeout(() => setUploadStatus(null), 5000);
      } else {
        console.error("Falha ao enviar ao backend");
        setUploadStatus({
          type: "error",
          message: "Erro ao enviar ao servidor. Tente novamente.",
        });
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      setUploadStatus({
        type: "error",
        message: "Erro de conexão. Verifique sua rede.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="chat"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 backdrop-blur-md transition hover:bg-black/45 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Voltar para o site
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <StatusBadge label="IA Assistiva" />
            <StatusBadge label="Supervisão Humana" />
            <StatusBadge label="Rastreabilidade" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/35 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(212,175,55,0.12),rgba(212,175,55,0.03))] px-5 py-5 sm:px-7">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-1 text-sm text-[#f4e7b2]">
                <Sparkles className="size-4" />
                Assistente Chronos Audit
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                Converse com a IA da sua auditoria
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base md:text-lg">
                Peça apoio para leitura de documentos, análise de riscos,
                estruturação de evidências, papéis de trabalho e revisões com
                mais contexto, governança e rastreabilidade.
              </p>
            </div>
          </div>

          <div className="px-4 pb-5 pt-5 sm:px-6 md:px-8 md:pb-8 md:pt-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-[#f4e7b2]">
                  <ShieldCheck className="size-4" />
                  Sugestão de prompt
                </div>
                <p className="text-sm leading-6 text-zinc-300">
                  “Analise este documento e identifique riscos relevantes,
                  inconsistências, pontos de atenção para auditoria e uma
                  proposta de evidências a serem solicitadas.”
                </p>
              </div>

              <AnimatePresence>
                {uploadStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className={cn(
                      "mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                      uploadStatus.type === "success"
                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border border-rose-500/20 bg-rose-500/10 text-rose-400"
                    )}
                  >
                    {uploadStatus.type === "success" ? (
                      <CheckCircle2 className="size-4 shrink-0" />
                    ) : (
                      <AlertCircle className="size-4 shrink-0" />
                    )}
                    {uploadStatus.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative rounded-[24px] border border-white/10 bg-[#0f1012]/80 shadow-xl shadow-black/20">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    adjustHeight();
                  }}
                  placeholder="Ex.: Leia este contrato e destaque riscos, cláusulas críticas e evidências necessárias..."
                  className={cn(
                    "w-full resize-none border-none px-5 py-5",
                    "bg-transparent text-sm text-white md:text-base",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-zinc-500 min-h-[64px]"
                  )}
                  style={{ overflow: "hidden" }}
                />

                <div className="flex flex-col gap-3 border-t border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      <Paperclip className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white truncate max-w-[200px]"
                    >
                      <FileUp className="mr-2 size-4 shrink-0" />
                      {file ? file.name : "Enviar arquivo"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClear}
                      className="rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      Limpar
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!hasMessage || isLoading}
                      className={cn(
                        "rounded-xl px-4 font-medium transition-all",
                        hasMessage
                          ? "bg-[#d4af37] text-black hover:bg-[#c9a633]"
                          : "bg-neutral-700 text-neutral-400"
                      )}
                    >
                      <ArrowUpIcon className="mr-2 size-4" />
                      {isLoading ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <QuickAction
                  icon={<FileSearch className="size-4" />}
                  label="Analisar documento"
                />
                <QuickAction
                  icon={<ShieldCheck className="size-4" />}
                  label="Mapear riscos"
                />
                <QuickAction
                  icon={<ScrollText className="size-4" />}
                  label="Gerar papel de trabalho"
                />
                <QuickAction
                  icon={<BrainCircuit className="size-4" />}
                  label="Resumir achados"
                />
                <QuickAction
                  icon={<Scale className="size-4" />}
                  label="Avaliar governança"
                />
                <QuickAction
                  icon={<BarChart3 className="size-4" />}
                  label="Interpretar indicadores"
                />
                <QuickAction
                  icon={<MonitorIcon className="size-4" />}
                  label="Criar dashboard"
                />
                <QuickAction
                  icon={<FileUp className="size-4" />}
                  label="Ler evidências"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-full border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10 hover:text-white"
    >
      {icon}
      <span className="ml-2 text-xs sm:text-sm">{label}</span>
    </Button>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#f4e7b2]">
      {label}
    </span>
  );
}