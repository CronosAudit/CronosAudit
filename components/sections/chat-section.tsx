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
  ProjectFile,
  ProjectSummary,
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

const EVIDENCES_BUCKET = "evidences";
const PROJECTS_ROOT = "projetos";
const LINKED_PROJECT_STORAGE_PREFIX = "chronos_audit_linked_project::";

function getLinkedProjectStorageKey(conversationId: string) {
  return `${LINKED_PROJECT_STORAGE_PREFIX}${conversationId}`;
}

function readLinkedProjectFromStorage(conversationId: string) {
  if (!conversationId || typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(getLinkedProjectStorageKey(conversationId)) || "";
  } catch {
    return "";
  }
}

function writeLinkedProjectToStorage(conversationId: string, value: string) {
  if (!conversationId || typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(getLinkedProjectStorageKey(conversationId), value);
    } else {
      window.localStorage.removeItem(getLinkedProjectStorageKey(conversationId));
    }
  } catch {
    // ignore storage errors
  }
}

const REPORT_SUPABASE_PROJECT_URL = "https://wtclrcxcsnsoqhwsnkss.supabase.co";

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function buildReportPublicUrlCandidates(params: {
  bucket: string;
  storagePath: string;
  reportLink: string;
  reportHash: string;
}) {
  const { bucket, storagePath, reportLink, reportHash } = params;
  const candidates: string[] = [];
  const safeBucket = bucket || "relatorios";

  const buildFromPath = (path: string) => {
    const cleaned = path
      .trim()
      .replace(
        `${REPORT_SUPABASE_PROJECT_URL}/storage/v1/object/public/${safeBucket}/`,
        "",
      )
      .replace(
        `${REPORT_SUPABASE_PROJECT_URL}/storage/v1/object/public/`,
        "",
      )
      .replace(/^\/+/, "")
      .replace(/^storage\/v1\/object\/public\//, "")
      .replace(new RegExp(`^${safeBucket}/`), "");

    const encoded = cleaned
      .split("/")
      .filter(Boolean)
      .map((part) => encodeURIComponent(part))
      .join("/");

    return `${REPORT_SUPABASE_PROJECT_URL}/storage/v1/object/public/${safeBucket}/${encoded}`;
  };

  if (storagePath) candidates.push(buildFromPath(storagePath));

  if (reportLink) {
    if (isAbsoluteUrl(reportLink)) {
      candidates.push(reportLink);
    }
    candidates.push(buildFromPath(reportLink));
  }

  if (reportHash && !reportHash.startsWith("conv_")) {
    candidates.push(buildFromPath(reportHash));
    candidates.push(buildFromPath(`${reportHash}.pdf`));
    candidates.push(buildFromPath(`auditoria_${reportHash}.pdf`));
  }

  return [...new Set(candidates)];
}

async function fetchReportBlob(params: {
  bucket: string;
  storagePath: string;
  reportLink: string;
  reportHash: string;
}): Promise<{ blob: Blob; sourceName: string } | null> {
  const { bucket, storagePath } = params;

  if (storagePath) {
    const cleanPath = storagePath
      .replace(/^\/+/, "")
      .replace(new RegExp(`^${bucket || "relatorios"}/`), "");
    const { data, error } = await supabase.storage
      .from(bucket || "relatorios")
      .download(cleanPath);
    if (!error && data) {
      const sourceName = cleanPath.split("/").pop() || "relatorio.pdf";
      return { blob: data, sourceName };
    }
  }

  const candidates = buildReportPublicUrlCandidates(params);
  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        const blob = await response.blob();
        const fromUrl = url.split("/").pop() || "";
        const sourceName = fromUrl
          ? decodeURIComponent(fromUrl).split("?")[0] || "relatorio.pdf"
          : "relatorio.pdf";
        return { blob, sourceName };
      }
    } catch {
      // try next candidate
    }
  }

  return null;
}

async function copyReportToLinkedProject(params: {
  userId: string;
  projectName: string;
  reportHash: string;
  reportLink: string;
  reportStoragePath: string;
  reportStorageBucket: string;
}): Promise<{ ok: boolean; fileName?: string }> {
  const {
    userId,
    projectName,
    reportHash,
    reportLink,
    reportStoragePath,
    reportStorageBucket,
  } = params;

  try {
    const fetched = await fetchReportBlob({
      bucket: reportStorageBucket,
      storagePath: reportStoragePath,
      reportLink,
      reportHash,
    });

    if (!fetched) return { ok: false };

    const baseName = (fetched.sourceName || "relatorio.pdf").replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );
    const ensurePdf = baseName.toLowerCase().endsWith(".pdf")
      ? baseName
      : `${baseName}.pdf`;
    const fileName = `relatorio_${reportHash || Date.now()}_${ensurePdf}`;
    const destinationPath = `${userId}/projetos/${projectName}/${fileName}`;

    const { error } = await supabase.storage
      .from(EVIDENCES_BUCKET)
      .upload(destinationPath, fetched.blob, {
        cacheControl: "3600",
        upsert: true,
        contentType: fetched.blob.type || "application/pdf",
      });

    if (error) {
      console.error("Erro ao copiar relatório para o projeto:", error);
      return { ok: false };
    }

    return { ok: true, fileName };
  } catch (error) {
    console.error("Falha ao copiar relatório para o projeto:", error);
    return { ok: false };
  }
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
  const [file, setFile] = useState<File | null>(null);

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

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [linkedProject, setLinkedProjectState] = useState<string>("");
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [isLoadingProjectFiles, setIsLoadingProjectFiles] = useState(false);

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

  const setLinkedProject = useCallback(
    (value: string) => {
      setLinkedProjectState(value);
      if (activeConversationId) {
        writeLinkedProjectToStorage(activeConversationId, value);
      }
    },
    [activeConversationId],
  );

  const loadProjects = useCallback(async (uid: string) => {
    if (!uid) return [];

    try {
      setIsLoadingProjects(true);

      const basePath = `${uid}/${PROJECTS_ROOT}`;
      const { data, error } = await supabase.storage
        .from(EVIDENCES_BUCKET)
        .list(basePath, {
          limit: 500,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("Erro ao listar projetos:", error);
        return [];
      }

      const folders = (data ?? []).filter(
        (entry) => !entry.updated_at && !entry.created_at && !entry.metadata,
      );

      const mapped = folders.map((entry) => ({
        name: entry.name,
        path: `${basePath}/${entry.name}`,
      }));

      setProjects(mapped);
      return mapped;
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const selectProjectFile = useCallback(
    async (projectFile: ProjectFile): Promise<boolean> => {
      try {
        setErrorMessage("");

        const { data, error } = await supabase.storage
          .from(EVIDENCES_BUCKET)
          .download(projectFile.path);

        if (error || !data) {
          console.error("Erro ao baixar arquivo do projeto:", error);
          setErrorMessage(
            "Não foi possível carregar o arquivo do projeto selecionado.",
          );
          return false;
        }

        const downloaded = new File([data], projectFile.name, {
          type: data.type || "application/octet-stream",
        });

        setFile(downloaded);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return true;
      } catch (error) {
        console.error("Erro ao carregar arquivo do projeto:", error);
        setErrorMessage(
          "Não foi possível carregar o arquivo do projeto selecionado.",
        );
        return false;
      }
    },
    [],
  );

  const loadProjectFiles = useCallback(
    async (uid: string, projectName: string) => {
      if (!uid || !projectName) {
        setProjectFiles([]);
        return [];
      }

      try {
        setIsLoadingProjectFiles(true);

        const basePath = `${uid}/${PROJECTS_ROOT}/${projectName}`;
        const { data, error } = await supabase.storage
          .from(EVIDENCES_BUCKET)
          .list(basePath, {
            limit: 1000,
            offset: 0,
            sortBy: { column: "updated_at", order: "desc" },
          });

        if (error) {
          console.error("Erro ao listar arquivos do projeto:", error);
          setProjectFiles([]);
          return [];
        }

        const files = (data ?? [])
          .filter(
            (item) =>
              !!item.name &&
              item.name !== ".keep" &&
              !item.name.startsWith(".") &&
              (item.updated_at || item.created_at || item.metadata),
          )
          .map((item, idx) => ({
            id: String(item.id || `${basePath}-${item.name}-${idx}`),
            name: item.name,
            path: `${basePath}/${item.name}`,
            size: item.metadata?.size ?? null,
            updatedAt:
              item.updated_at || item.created_at || new Date().toISOString(),
          }));

        setProjectFiles(files);
        return files;
      } finally {
        setIsLoadingProjectFiles(false);
      }
    },
    [],
  );

  const hasStartedChat = messages.length > 0;
  const hasMessage = message.trim().length > 0 || file !== null;

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
    setFile(null);
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

        if (linkedProject) {
          writeLinkedProjectToStorage(newConversation.id, linkedProject);
        }

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
    [userId, insertAssistantMessage, loadConversationDetails, linkedProject],
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

        void loadProjects(user.id);

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
  }, [loadConversations, loadProjects]);

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
    if (!activeConversationId) {
      setLinkedProjectState("");
      return;
    }
    setLinkedProjectState(readLinkedProjectFromStorage(activeConversationId));
  }, [activeConversationId]);

  useEffect(() => {
    if (!userId || !linkedProject) {
      setProjectFiles([]);
      return;
    }
    void loadProjectFiles(userId, linkedProject);
  }, [userId, linkedProject, loadProjectFiles]);

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
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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

    if (file && !normalizedCnpj) {
      setErrorMessage("Informe o CNPJ antes de enviar um documento.");
      return;
    }

    if (file && !anoFiscal.trim()) {
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
    const selectedFile = file;

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

      if (selectedFile) {
        const safeFileName = sanitizeFileName(selectedFile.name);
        const storagePath = `${userId}/${conversation.conversationHash}/${Date.now()}-${safeFileName}`;

        const uploadResult = await supabase.storage
          .from("evidences")
          .upload(storagePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadResult.error) throw uploadResult.error;

        uploadedFileName = selectedFile.name;
        uploadedStoragePath = storagePath;

        const { error: fileInsertError } = await supabase
          .from("conversation_files")
          .insert({
            conversation_id: conversation.id,
            uploaded_by: userId,
            original_file_name: selectedFile.name,
            storage_bucket: "evidences",
            storage_path: storagePath,
            mime_type: selectedFile.type || null,
            file_size_bytes: selectedFile.size,
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
          `Arquivo "${selectedFile.name}" enviado com sucesso. O documento foi armazenado no Supabase e encaminhado para o fluxo externo com CNPJ ${normalizedCnpj}, tipo "${docType}" e ano fiscal ${anoFiscal}.`,
          {
            fileName: selectedFile.name,
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

      if ((trimmedMessage || selectedFile) && analysisEndpoint) {
        try {
          const formData = new FormData();

          if (trimmedMessage) formData.append("message", trimmedMessage);
          if (selectedFile) formData.append("file", selectedFile);
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

      if (trimmedMessage || selectedFile) {
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
      const reportStoragePath = String(
        getReportStoragePathFromResponse(responseData) || "",
      );
      const reportStorageBucket = String(
        getReportStorageBucketFromResponse(responseData) || REPORTS_BUCKET,
      );

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

      let projectCopyResult: { ok: boolean; fileName?: string } = { ok: false };
      if (linkedProject) {
        projectCopyResult = await copyReportToLinkedProject({
          userId,
          projectName: linkedProject,
          reportHash,
          reportLink,
          reportStoragePath,
          reportStorageBucket,
        });
      }

      const assistantContent = reportLink
        ? linkedProject
          ? projectCopyResult.ok
            ? `Relatório gerado com sucesso. O hash desta execução é ${reportHash} e o arquivo final foi salvo na pasta do projeto "${linkedProject}" (${projectCopyResult.fileName}).`
            : `Relatório gerado com sucesso (hash ${reportHash}), mas não foi possível copiá-lo automaticamente para a pasta do projeto "${linkedProject}". Use o link disponível para baixar manualmente.`
          : `Relatório gerado com sucesso. O hash desta execução é ${reportHash} e o arquivo final já está disponível para visualização e download.`
        : `A solicitação de relatório foi concluída com status "${reportStatus}", mas o backend não retornou um link público do PDF. Verifique se o campo "link", "result_link", "publicUrl" ou "download_url" está sendo retornado pela rota de geração.`;

      await insertAssistantMessage(
        activeConversation.id,
        assistantContent,
        {
          reportHash,
          reportLink,
          reportStatus,
          cnpj: normalizedCnpj,
          regime_tributario: regimeTributario,
          ano_fiscal: anoFiscal,
          linked_project: linkedProject || null,
          project_copy_status: linkedProject
            ? projectCopyResult.ok
              ? "saved"
              : "failed"
            : "skipped",
          project_copy_file: projectCopyResult.fileName || null,
        },
      );

      await supabase
        .from("audit_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeConversation.id);

      await loadConversationDetails(activeConversation.id);
      await loadConversations(userId);

      if (linkedProject && projectCopyResult.ok) {
        await loadProjectFiles(userId, linkedProject);
      }
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
        file={file}
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
        linkedProject={linkedProject}
        setLinkedProject={setLinkedProject}
        projects={projects}
        projectFiles={projectFiles}
        isLoadingProjects={isLoadingProjects}
        isLoadingProjectFiles={isLoadingProjectFiles}
        selectProjectFile={selectProjectFile}
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
      file={file}
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
      linkedProject={linkedProject}
      setLinkedProject={setLinkedProject}
      projects={projects}
      projectFiles={projectFiles}
      isLoadingProjects={isLoadingProjects}
      isLoadingProjectFiles={isLoadingProjectFiles}
    />
  );
}
