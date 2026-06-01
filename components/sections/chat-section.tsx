"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

import {
  buildFallbackAssistantReply,
  generateConversationHash,
  normalizeCnpj,
  sanitizeFileName,
} from "./chat/utils";
import { useAutoResizeTextarea } from "./chat/use-auto-resize-textarea";
import { ChatLandingView } from "./chat/chat-landing-view";
import type {
  ChatConversation,
  ChatMessage,
  CompanySuggestion,
  ConversationFile,
  DocumentType,
  ReportData,
  TaxRegime,
} from "./chat/types";
import { ChatConversationView } from "./chat/chat-conversation-view";

type SafeResponseData = {
  error?: string | null;
  message?: string | null;
  details?: {
    raw?: string;
    message?: string;
  } | null;
  [key: string]: unknown;
};

async function readResponseSafely(
  response: Response,
): Promise<SafeResponseData> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return {
        error: response.ok ? null : "Resposta JSON inválida.",
        details: {
          message: "O servidor respondeu como JSON, mas o conteúdo é inválido.",
        },
      };
    }
  }

  const raw = await response.text().catch(() => "");

  const isHtml =
    raw.trim().startsWith("<!DOCTYPE html") || raw.includes("<html");
  const isBadGateway =
    response.status === 502 ||
    raw.includes("502 Bad Gateway") ||
    raw.includes("failed to connect to server of VM");

  return {
    error: response.ok ? null : "Erro ao gerar relatório.",
    details: {
      raw,
      message: isBadGateway
        ? "O serviço de geração do relatório retornou 502 Bad Gateway. Verifique se o backend/serviço externo está online e acessível."
        : isHtml
          ? `O servidor retornou uma página HTML em vez de JSON. Status HTTP: ${response.status}.`
          : raw.slice(0, 500) || `Falha HTTP ${response.status}.`,
    },
  };
}

function getErrorMessageFromResponse(
  responseData: SafeResponseData | null,
  fallback: string,
) {
  const details = responseData?.details as
    | { raw?: string; message?: string }
    | null
    | undefined;

  return (
    details?.message || responseData?.message || responseData?.error || fallback
  );
}

function getReportHashFromResponse(responseData: SafeResponseData | null) {
  return (
    responseData?.hash ||
    responseData?.report_hash ||
    responseData?.reportHash ||
    responseData?.cid_hash ||
    responseData?.id ||
    generateConversationHash()
  );
}

function getReportStatusFromResponse(responseData: SafeResponseData | null) {
  return (
    responseData?.status ||
    responseData?.report_status ||
    responseData?.reportStatus ||
    "completed"
  );
}

function getReportMarkdownFromResponse(responseData: SafeResponseData | null) {
  return (
    responseData?.markdown ||
    responseData?.markdown_content ||
    responseData?.markdownContent ||
    responseData?.relatorio_markdown ||
    responseData?.content ||
    null
  );
}

function getReportLinkFromResponse(responseData: SafeResponseData | null) {
  return (
    responseData?.link ||
    responseData?.result_link ||
    responseData?.resultLink ||
    responseData?.url ||
    responseData?.url_pdf ||
    responseData?.public_url ||
    responseData?.publicUrl ||
    responseData?.download_url ||
    responseData?.downloadUrl ||
    responseData?.file_url ||
    responseData?.fileUrl ||
    null
  );
}

export function ChatSection() {
  const SUPABASE_PROJECT_URL = "https://wtclrcxcsnsoqhwsnkss.supabase.co";
  const REPORTS_BUCKET = "relatorios";

  function buildPublicReportUrl(storagePath: string) {
    return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${REPORTS_BUCKET}/${encodeURIComponent(
      storagePath,
    )}`;
  }

  function getReportStoragePathFromResponse(
    responseData: SafeResponseData | null,
  ) {
    return (
      responseData?.storage_path ||
      responseData?.storagePath ||
      responseData?.file_path ||
      responseData?.filePath ||
      null
    );
  }

  function getReportStorageBucketFromResponse(
    responseData: SafeResponseData | null,
  ) {
    return (
      responseData?.storage_bucket ||
      responseData?.storageBucket ||
      REPORTS_BUCKET
    );
  }
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [cnpj, setCnpj] = useState("");
  const [regimeTributario, setRegimeTributario] =
    useState<TaxRegime>("simples_nacional");
  const [anoFiscal, setAnoFiscal] = useState("2025");
  const [docType, setDocType] = useState<DocumentType>("documento_contabil");

  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [userId, setUserId] = useState<string>("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationFiles, setConversationFiles] = useState<
    ConversationFile[]
  >([]);
  const [latestReport, setLatestReport] = useState<ReportData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [companyQuery, setCompanyQuery] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState<
    CompanySuggestion[]
  >([]);
  const [isSearchingCompanies, setIsSearchingCompanies] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 64,
    maxHeight: 220,
  });

  const activeConversation = useMemo(() => {
    return (
      conversations.find((item) => item.id === activeConversationId) ?? null
    );
  }, [conversations, activeConversationId]);

  const hasStartedChat = messages.length > 0;
  const hasMessage = message.trim().length > 0 || files.length > 0;

  const reportEndpoint = "/api/gerar-relatorio";
  const uploadDocumentEndpoint = "/api/upload-documento";
  const analysisEndpoint = process.env.NEXT_PUBLIC_CHRONOS_ANALYSIS_URL;

  const loadConversations = useCallback(async (currentUserId: string) => {
    const { data, error } = await supabase
      .from("audit_conversations")
      .select("id, title, updated_at, conversation_hash, audit_type, status")
      .eq("created_by", currentUserId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const mapped: ChatConversation[] =
      data?.map((item) => ({
        id: item.id,
        title: item.title,
        updatedAt: item.updated_at,
        conversationHash: item.conversation_hash,
        auditType: item.audit_type,
        status: item.status,
      })) ?? [];

    setConversations(mapped);
    return mapped;
  }, []);

  const loadConversationDetails = useCallback(
    async (conversationId: string) => {
      const [messagesResult, filesResult, reportsResult] = await Promise.all([
        supabase
          .from("audit_conversation_messages")
          .select("id, sender_type, content, metadata, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
        supabase
          .from("conversation_files")
          .select("id, original_file_name, storage_path, mime_type, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
        supabase
          .from("audit_reports")
          .select(
            "id, report_hash, status, markdown_content, result_link, storage_bucket, storage_path, generated_at",
          )
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      if (messagesResult.error) throw messagesResult.error;
      if (filesResult.error) throw filesResult.error;
      if (reportsResult.error) throw reportsResult.error;

      const mappedMessages: ChatMessage[] =
        messagesResult.data?.map((item) => ({
          id: item.id,
          role: item.sender_type === "user" ? "user" : "assistant",
          content: item.content || "",
          createdAt: item.created_at,
          fileName: item.metadata?.fileName ?? null,
          reportLink: item.metadata?.reportLink ?? null,
          reportStatus: item.metadata?.reportStatus ?? null,
        })) ?? [];

      const mappedFiles: ConversationFile[] =
        filesResult.data?.map((item) => ({
          id: item.id,
          originalFileName: item.original_file_name,
          storagePath: item.storage_path,
          mimeType: item.mime_type,
          createdAt: item.created_at,
        })) ?? [];

      const report = reportsResult.data?.[0]
        ? {
            id: reportsResult.data[0].id,
            reportHash: reportsResult.data[0].report_hash,
            status: reportsResult.data[0].status,
            markdownContent: reportsResult.data[0].markdown_content,
            resultLink: reportsResult.data[0].result_link,
            storageBucket: reportsResult.data[0].storage_bucket,
            storagePath: reportsResult.data[0].storage_path,
            generatedAt: reportsResult.data[0].generated_at,
          }
        : null;

      setMessages(mappedMessages);
      setConversationFiles(mappedFiles);
      setLatestReport(report);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setMessage("");
    setFiles([]);
    adjustHeight(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [adjustHeight]);

  const resetDraftState = useCallback(() => {
    setActiveConversationId("");
    setMessages([]);
    setConversationFiles([]);
    setLatestReport(null);
    setErrorMessage("");
  }, []);

  const insertAssistantMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      metadata?: Record<string, unknown>,
    ) => {
      await supabase.from("audit_conversation_messages").insert({
        conversation_id: conversationId,
        sender_type: "agent",
        message_type: "text",
        content,
        metadata: metadata ?? {},
        created_by: userId || null,
      });
    },
    [userId],
  );

  const insertUserMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      metadata?: Record<string, unknown>,
    ) => {
      await supabase.from("audit_conversation_messages").insert({
        conversation_id: conversationId,
        sender_type: "user",
        message_type: "text",
        content,
        metadata: metadata ?? {},
        created_by: userId,
      });
    },
    [userId],
  );

  const createConversation = useCallback(
    async (options?: { initialTitle?: string; silent?: boolean }) => {
      if (!userId) return null;

      try {
        setErrorMessage("");

        const now = new Date().toISOString();
        const conversationHash = generateConversationHash();

        const { data, error } = await supabase
          .from("audit_conversations")
          .insert({
            created_by: userId,
            title: options?.initialTitle || "Nova conversa",
            conversation_hash: conversationHash,
            status: "active",
            updated_at: now,
          })
          .select(
            "id, title, updated_at, conversation_hash, audit_type, status",
          )
          .single();

        if (error) throw error;

        const newConversation: ChatConversation = {
          id: data.id,
          title: data.title,
          updatedAt: data.updated_at,
          conversationHash: data.conversation_hash,
          auditType: data.audit_type,
          status: data.status,
        };

        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        setMessages([]);
        setConversationFiles([]);
        setLatestReport(null);
        setMobileSidebarOpen(false);

        if (!options?.silent) {
          await insertAssistantMessage(
            newConversation.id,
            "Nova conversa de auditoria criada. Você pode enviar documentos, solicitar análise e gerar o relatório final.",
          );
          await loadConversationDetails(newConversation.id);
        }

        return newConversation;
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível criar uma nova conversa.");
        return null;
      }
    },
    [userId, insertAssistantMessage, loadConversationDetails],
  );

  const startDraftConversation = useCallback(() => {
    resetDraftState();
    setMobileSidebarOpen(false);
    handleClear();
  }, [resetDraftState, handleClear]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setIsBootstrapping(true);
        setErrorMessage("");

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          setErrorMessage(
            "Faça login para acessar suas conversas de auditoria.",
          );
          return;
        }

        setUserId(user.id);

        const loaded = await loadConversations(user.id);

        if (loaded.length > 0) {
          setActiveConversationId((prev) => prev || loaded[0].id);
        } else {
          setActiveConversationId("");
          setMessages([]);
          setConversationFiles([]);
          setLatestReport(null);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível carregar suas conversas.");
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConversationId) return;

    const run = async () => {
      try {
        setErrorMessage("");
        await loadConversationDetails(activeConversationId);
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível carregar os detalhes da conversa.");
      }
    };

    run();
  }, [activeConversationId, loadConversationDetails]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isGeneratingReport]);

  useEffect(() => {
    const query = companyQuery.trim();

    if (query.length < 3) {
      setCompanySuggestions([]);
      setShowCompanySuggestions(false);
      setIsSearchingCompanies(false);
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setIsSearchingCompanies(true);

        const response = await fetch(
          `/api/cnpj/search?q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          },
        );

        const data = await readResponseSafely(response);

        if (!response.ok) {
          throw new Error(
            getErrorMessageFromResponse(data, "Falha ao buscar empresas."),
          );
        }

        const items = Array.isArray(data?.items) ? data.items : [];
        setCompanySuggestions(items as CompanySuggestion[]);
        setShowCompanySuggestions(items.length > 0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(error);
          setCompanySuggestions([]);
          setShowCompanySuggestions(false);
        }
      } finally {
        setIsSearchingCompanies(false);
      }
    }, 900);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [companyQuery]);

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = Array.from(e.target.files || []).slice(0, 5);

  setFiles(selectedFiles);

  if (selectedFiles.length > 0 && !message.trim()) {
    setMessage(
      selectedFiles.length === 1
        ? `Analise o arquivo "${selectedFiles[0].name}".`
        : `Analise os ${selectedFiles.length} arquivos selecionados.`,
    );
  }
};

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        setErrorMessage("");

        const { error } = await supabase
          .from("audit_conversations")
          .delete()
          .eq("id", conversationId);

        if (error) throw error;

        const next = conversations.filter((item) => item.id !== conversationId);
        setConversations(next);

        if (next.length === 0) {
          resetDraftState();
          handleClear();
          return;
        }

        if (conversationId === activeConversationId) {
          setActiveConversationId(next[0].id);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível excluir a conversa.");
      }
    },
    [conversations, activeConversationId, resetDraftState, handleClear],
  );

  const handleSubmit = async () => {
    if (!hasMessage || !userId) return;

    const normalizedCnpj = normalizeCnpj(cnpj);

    if (files.length > 0 && !normalizedCnpj) {
      setErrorMessage("Informe o CNPJ antes de enviar um documento.");
      return;
    }

    if (files.length > 0 && !anoFiscal.trim()) {
      setErrorMessage("Informe o ano fiscal antes de enviar um documento.");
      return;
    }

    let conversation = activeConversation;

    if (!conversation) {
      conversation = await createConversation({ silent: true });
      if (!conversation) return;
    }

    const now = new Date().toISOString();
    const trimmedMessage = message.trim();
    const selectedFiles = files;

    setIsLoading(true);
    setErrorMessage("");

    try {
      if (trimmedMessage) {
        await insertUserMessage(conversation.id, trimmedMessage, {
          cnpj: normalizedCnpj || null,
          regime_tributario: regimeTributario,
          ano_fiscal: anoFiscal,
        });
      }

      let uploadedFileName: string | null = null;
      let uploadedStoragePath: string | null = null;

      if (selectedFiles.length > 0) {
        const safeFileName = sanitizeFileName(selectedFiles[0].name);
        const storagePath = `${userId}/${conversation.conversationHash}/${Date.now()}-${safeFileName}`;

        const uploadResult = await supabase.storage
          .from("evidences")
          .upload(storagePath, selectedFiles[0], {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadResult.error) throw uploadResult.error;

        uploadedFileName = selectedFiles[0].name;
        uploadedStoragePath = storagePath;

        const { error: fileInsertError } = await supabase
          .from("conversation_files")
          .insert({
            conversation_id: conversation.id,
            uploaded_by: userId,
            original_file_name: selectedFiles[0].name,
            storage_bucket: "evidences",
            storage_path: storagePath,
            mime_type: selectedFiles[0].type || null,
            file_size_bytes: selectedFiles[0].size,
            upload_status: "uploaded",
          });

        if (fileInsertError) throw fileInsertError;

        const uploadDocumentResponse = await fetch(uploadDocumentEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cnpj: normalizedCnpj,
            arquivos: [storagePath],
            doc_type: docType,
            ano_fiscal: anoFiscal || "2025",
          }),
        });

        const uploadDocumentData = await readResponseSafely(
          uploadDocumentResponse,
        );

        if (!uploadDocumentResponse.ok) {
          throw new Error(
            getErrorMessageFromResponse(
              uploadDocumentData,
              "Falha ao enviar documento para processamento externo.",
            ),
          );
        }

        await insertAssistantMessage(
          conversation.id,
          `Arquivo "${selectedFiles[0].name}" enviado com sucesso. O documento foi armazenado no Supabase e encaminhado para o fluxo externo com CNPJ ${normalizedCnpj}, tipo "${docType}" e ano fiscal ${anoFiscal}.`,
          {
            fileName: selectedFiles[0].name,
            storagePath,
            processingStatus: "uploaded",
            cnpj: normalizedCnpj,
            docType,
            anoFiscal,
          },
        );
      }

      const { error: updateConversationError } = await supabase
        .from("audit_conversations")
        .update({
          title:
            conversation.title === "Nova conversa"
              ? (trimmedMessage || uploadedFileName || "Nova conversa").slice(
                  0,
                  60,
                )
              : conversation.title,
          updated_at: now,
        })
        .eq("id", conversation.id);

      if (updateConversationError) throw updateConversationError;

      let assistantText = buildFallbackAssistantReply(
        trimmedMessage,
        uploadedFileName,
      );

      if ((trimmedMessage || selectedFiles.length > 0) && analysisEndpoint) {
        try {
          const formData = new FormData();

          if (trimmedMessage) formData.append("message", trimmedMessage);
          if (selectedFiles.length > 0) formData.append("file", selectedFiles[0]);
          if (conversation.id) {
            formData.append("conversation_id", conversation.id);
          }
          if (conversation.conversationHash) {
            formData.append("conversation_hash", conversation.conversationHash);
          }
          if (uploadedStoragePath) {
            formData.append("storage_path", uploadedStoragePath);
          }
          if (normalizedCnpj) formData.append("cnpj", normalizedCnpj);
          if (regimeTributario) {
            formData.append("regime_tributario", regimeTributario);
          }
          if (anoFiscal) formData.append("ano_fiscal", anoFiscal);
          if (docType) formData.append("doc_type", docType);

          const response = await fetch(analysisEndpoint, {
            method: "POST",
            body: formData,
          });

          const data = await readResponseSafely(response);

          if (response.ok) {
            assistantText =
              (data?.reply as string) ||
              (data?.message as string) ||
              (data?.response as string) ||
              assistantText;
          }
        } catch {
          assistantText = buildFallbackAssistantReply(
            trimmedMessage,
            uploadedFileName,
          );
        }
      }

      if (trimmedMessage || selectedFiles.length > 0) {
        await insertAssistantMessage(conversation.id, assistantText, {
          fileName: uploadedFileName,
          cnpj: normalizedCnpj || null,
          regime_tributario: regimeTributario,
          ano_fiscal: anoFiscal,
          doc_type: docType,
        });
      }

      await loadConversations(userId);
      await loadConversationDetails(conversation.id);
      handleClear();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua solicitação.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!activeConversation || !userId) return;

    const normalizedCnpj = normalizeCnpj(cnpj);

    if (!normalizedCnpj) {
      setErrorMessage("Informe o CNPJ antes de gerar o relatório.");
      return;
    }

    if (!regimeTributario) {
      setErrorMessage(
        "Informe o regime tributário antes de gerar o relatório.",
      );
      return;
    }

    if (!anoFiscal.trim()) {
      setErrorMessage("Informe o ano fiscal antes de gerar o relatório.");
      return;
    }

    if (conversationFiles.length === 0) {
      setErrorMessage(
        "Envie ao menos um documento antes de gerar o relatório.",
      );
      return;
    }

    setIsGeneratingReport(true);
    setErrorMessage("");

    try {
      const payload = {
        cnpj: normalizedCnpj,
        regime_tributario: regimeTributario,
        ano_fiscal: anoFiscal || "2025",
        conversation_id: activeConversation.id,
        conversation_hash: activeConversation.conversationHash,
        user_id: userId,
        files: conversationFiles.map((item) => ({
          id: item.id,
          file_name: item.originalFileName,
          storage_path: item.storagePath,
          mime_type: item.mimeType,
        })),
        message_count: messages.length,
      };

      const response = await fetch(reportEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await readResponseSafely(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessageFromResponse(
            responseData,
            "Falha ao gerar relatório.",
          ),
        );
      }

      const reportHash = String(getReportHashFromResponse(responseData));
      const reportStatus = String(getReportStatusFromResponse(responseData));
      const reportMarkdown = getReportMarkdownFromResponse(responseData);

      const reportLink = String(getReportLinkFromResponse(responseData) || "");

      console.log("RESPONSE GERAR RELATORIO:", responseData);
      console.log("REPORT LINK EXTRAIDO:", reportLink);

      const { error: reportInsertError } = await supabase
        .from("audit_reports")
        .insert({
          conversation_id: activeConversation.id,
          requested_by: userId,
          generator_endpoint: reportEndpoint,
          report_hash: reportHash,
          status: reportStatus,
          markdown_content: reportMarkdown,
          result_link: reportLink || null,
          response_payload: responseData,
          generated_at: new Date().toISOString(),
        });

      if (reportInsertError) throw reportInsertError;

      await insertAssistantMessage(
        activeConversation.id,
        reportLink
          ? `Relatório gerado com sucesso. O hash desta execução é ${reportHash} e o arquivo final já está disponível para visualização e download.`
          : `A solicitação de relatório foi concluída com status "${reportStatus}", mas o backend não retornou um link público do PDF. Verifique se o campo "link", "result_link", "publicUrl" ou "download_url" está sendo retornado pela rota de geração.`,
        {
          reportHash,
          reportLink,
          reportStatus,
          cnpj: normalizedCnpj,
          regime_tributario: regimeTributario,
          ano_fiscal: anoFiscal,
        },
      );

      await supabase
        .from("audit_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeConversation.id);

      await loadConversationDetails(activeConversation.id);
      await loadConversations(userId);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o relatório agora.",
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isBootstrapping) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-zinc-200 backdrop-blur-xl">
          <Loader2 className="size-5 animate-spin text-[#d4af37]" />
          Carregando ambiente de auditoria...
        </div>
      </section>
    );
  }

  if (!hasStartedChat || !activeConversation || messages.length === 0) {
    return (
      <ChatLandingView
        message={message}
        setMessage={setMessage}
        files={files}
        cnpj={cnpj}
        setCnpj={setCnpj}
        regimeTributario={regimeTributario}
        setRegimeTributario={setRegimeTributario}
        anoFiscal={anoFiscal}
        setAnoFiscal={setAnoFiscal}
        docType={docType}
        setDocType={setDocType}
        isLoading={isLoading}
        isGeneratingReport={isGeneratingReport}
        hasMessage={hasMessage}
        activeConversation={activeConversation}
        latestReport={latestReport}
        errorMessage={errorMessage}
        textareaRef={textareaRef}
        adjustHeight={adjustHeight}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleClear={handleClear}
        handleSubmit={handleSubmit}
        handleGenerateReport={handleGenerateReport}
        companyQuery={companyQuery}
        setCompanyQuery={setCompanyQuery}
        companySuggestions={companySuggestions}
        setCompanySuggestions={setCompanySuggestions}
        isSearchingCompanies={isSearchingCompanies}
        showCompanySuggestions={showCompanySuggestions}
        setShowCompanySuggestions={setShowCompanySuggestions}
      />
    );
  }

  return (
    <ChatConversationView
      conversations={conversations}
      activeConversationId={activeConversationId}
      activeConversation={activeConversation}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
      createConversation={startDraftConversation}
      deleteConversation={deleteConversation}
      setActiveConversationId={setActiveConversationId}
      message={message}
      setMessage={setMessage}
      files={files}
      cnpj={cnpj}
      setCnpj={setCnpj}
      regimeTributario={regimeTributario}
      setRegimeTributario={setRegimeTributario}
      anoFiscal={anoFiscal}
      setAnoFiscal={setAnoFiscal}
      docType={docType}
      setDocType={setDocType}
      messages={messages}
      latestReport={latestReport}
      conversationFiles={conversationFiles}
      isLoading={isLoading}
      isGeneratingReport={isGeneratingReport}
      hasMessage={hasMessage}
      errorMessage={errorMessage}
      textareaRef={textareaRef}
      adjustHeight={adjustHeight}
      fileInputRef={fileInputRef}
      handleFileChange={handleFileChange}
      handleClear={handleClear}
      handleSubmit={handleSubmit}
      handleGenerateReport={handleGenerateReport}
      messagesEndRef={messagesEndRef}
      companyQuery={companyQuery}
      setCompanyQuery={setCompanyQuery}
      companySuggestions={companySuggestions}
      setCompanySuggestions={setCompanySuggestions}
      isSearchingCompanies={isSearchingCompanies}
      showCompanySuggestions={showCompanySuggestions}
      setShowCompanySuggestions={setShowCompanySuggestions}
    />
  );
}
