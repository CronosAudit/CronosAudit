"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Navbar, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type ExampleDocumentCategory =
  | "Relatório"
  | "Planilha"
  | "Checklist"
  | "Política"
  | "Contrato"
  | "Outro";

type ExampleDocument = {
  id: string;
  name: string;
  path: string;
  folder: string;
  title: string;
  description: string;
  category: ExampleDocumentCategory;
  fileType: string;
  updatedAt: string;
  featured?: boolean;
  size?: number | null;
};

type StorageListItem = {
  id?: string | null;
  name: string;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: {
    size?: number;
    [key: string]: unknown;
  } | null;
};

const BUCKET_NAME = "evidences";
const BUCKET_FOLDERS = [
  "documentos-exemplo/documentos_principais",
  "documentos-exemplo/justificativas",
] as const;

export default function DocumentosExemploPage() {
  const router = useRouter();

  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<
    ExampleDocumentCategory | "Todos"
  >("Todos");
  const [documents, setDocuments] = React.useState<ExampleDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    void bootstrap();
  }, []);

  async function bootstrap() {
    await Promise.all([loadUser(), loadDocuments()]);
  }

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const displayName =
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.display_name ||
      "usuário";

    setUserName(displayName);
    setUserEmail(user.email ?? "");
  }

  async function loadDocuments() {
    try {
      setIsLoading(true);
      setError("");

      const folderResults = await Promise.all(
        BUCKET_FOLDERS.map(async (folder) => {
          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(folder, {
              limit: 200,
              offset: 0,
              sortBy: { column: "updated_at", order: "desc" },
            });

          if (error) {
            throw new Error(`Erro ao listar ${folder}: ${error.message}`);
          }

          return {
            folder,
            items: (data ?? []) as StorageListItem[],
          };
        }),
      );

      const mergedDocuments = folderResults.flatMap(({ folder, items }) =>
        items
          .filter((item) => !!item.name)
          .filter((item) => !item.name.startsWith("."))
          .filter((item) => !isFolderEntry(item))
          .map((item, index) =>
            mapStorageItemToDocument(item, index, folder),
          ),
      );

      mergedDocuments.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });

      setDocuments(mergedDocuments);
    } catch (err) {
      console.error("Erro ao listar bucket:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os documentos do bucket.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function handleViewDocument(doc: ExampleDocument) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(doc.path, 60 * 10);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Erro ao visualizar arquivo:", err);
      alert("Não foi possível visualizar este documento.");
    }
  }

  async function handleDownloadDocument(doc: ExampleDocument) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(doc.path, 60 * 10, {
          download: doc.name,
        });

      if (error) throw error;

      if (data?.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.click();
      }
    } catch (err) {
      console.error("Erro ao baixar arquivo:", err);
      alert("Não foi possível baixar este documento.");
    }
  }

  const categories: Array<ExampleDocumentCategory | "Todos"> = [
    "Todos",
    "Relatório",
    "Planilha",
    "Checklist",
    "Política",
    "Contrato",
    "Outro",
  ];

  const filteredDocuments = React.useMemo(() => {
    const term = search.toLowerCase().trim();

    return documents.filter((doc) => {
      const matchesSearch =
        !term ||
        doc.title.toLowerCase().includes(term) ||
        doc.name.toLowerCase().includes(term) ||
        doc.description.toLowerCase().includes(term) ||
        doc.category.toLowerCase().includes(term) ||
        doc.fileType.toLowerCase().includes(term) ||
        doc.folder.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "Todos" || doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, selectedCategory]);

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

          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pt-36">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <section className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                    Documentos
                    <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                      {" "}
                      Exemplos
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                    Visualize os arquivos das pastas principais e justificativas
                    do bucket.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                        <FolderKanban className="size-5 text-[#d4af37]" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Total de arquivos</p>
                        <p className="text-xl font-semibold text-white">
                          {isLoading ? "..." : documents.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                        <ShieldCheck className="size-5 text-emerald-300" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Filtrados</p>
                        <p className="text-xl font-semibold text-white">
                          {isLoading ? "..." : filteredDocuments.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-5 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#f4e7b2]">
                    Biblioteca
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Todos os documentos disponíveis
                  </h2>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative min-w-[260px]">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por nome, categoria ou pasta"
                      className="h-11 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                    {isLoading
                      ? "Carregando..."
                      : `${filteredDocuments.length} documento(s) encontrado(s)`}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-full">
                    <LoadingState text="Carregando documentos..." />
                  </div>
                ) : filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="group rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#d4af37]/20 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                          <DocumentIcon type={doc.fileType} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryBadge label={doc.category} />
                          <FileTypeBadge label={doc.fileType} />
                          <FolderBadge folder={doc.folder} />
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-white">
                          {doc.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
                          {doc.description}
                        </p>

                        <p className="mt-4 text-xs text-zinc-500">
                          Atualizado em {formatDateLabel(doc.updatedAt)}
                        </p>

                        {typeof doc.size === "number" && (
                          <p className="mt-1 text-xs text-zinc-500">
                            Tamanho: {formatBytes(doc.size)}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Button
                          variant="ghost"
                          onClick={() => handleViewDocument(doc)}
                          className="h-10 flex-1 rounded-xl border border-white/10 px-4 text-sm text-white hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          <Eye className="mr-2 size-4" />
                          Visualizar
                        </Button>

                        <Button
                          onClick={() => handleDownloadDocument(doc)}
                          className="h-10 flex-1 rounded-xl bg-[#d4af37] px-4 text-sm font-semibold text-black hover:bg-[#c9a633] cursor-pointer"
                        >
                          <Download className="mr-2 size-4" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
                    Nenhum documento encontrado com os filtros aplicados.
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

function isFolderEntry(item: StorageListItem) {
  return !item.updated_at && !item.created_at && !item.metadata;
}

function mapStorageItemToDocument(
  item: StorageListItem,
  index: number,
  folder: string,
): ExampleDocument {
  const fileName = String(item.name || "arquivo");
  const fileType = getFileExtension(fileName).toUpperCase() || "ARQUIVO";
  const category = inferCategoryFromFileName(fileName, fileType);
  const title = beautifyFileName(fileName);
  const fullPath = `${folder}/${fileName}`;

  return {
    id: String(item.id || `${folder}-${fileName}-${index}`),
    name: fileName,
    path: fullPath,
    folder,
    title,
    description: buildDescription(folder, category, fileType),
    category,
    fileType,
    updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
    featured: index < 2,
    size: item.metadata?.size ?? null,
  };
}

function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function beautifyFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferCategoryFromFileName(
  fileName: string,
  fileType: string,
): ExampleDocumentCategory {
  const normalized = `${fileName} ${fileType}`.toLowerCase();

  if (normalized.includes("checklist")) return "Checklist";
  if (normalized.includes("politica") || normalized.includes("política")) {
    return "Política";
  }
  if (normalized.includes("contrato")) return "Contrato";
  if (["XLSX", "XLS", "CSV"].includes(fileType)) return "Planilha";
  if (
    normalized.includes("relatorio") ||
    normalized.includes("relatório") ||
    normalized.includes("parecer") ||
    normalized.includes("balancete")
  ) {
    return "Relatório";
  }

  return "Outro";
}

function buildDescription(
  folder: string,
  category: ExampleDocumentCategory,
  fileType: string,
) {
  const folderLabel = folder.includes("justificativas")
    ? "Justificativas"
    : "Documentos principais";

  return `Arquivo da pasta ${folderLabel}, classificado como ${category.toLowerCase()} (${fileType}).`;
}

function DocumentIcon({ type }: { type: string }) {
  const normalized = type.toLowerCase();

  if (["xlsx", "xls", "csv"].includes(normalized)) {
    return <FileSpreadsheet className="size-6 text-[#d4af37]" />;
  }

  if (normalized === "pdf") {
    return <FileCheck2 className="size-6 text-[#d4af37]" />;
  }

  return <FileText className="size-6 text-[#d4af37]" />;
}

function CategoryBadge({ label }: { label: ExampleDocumentCategory }) {
  const styles: Record<ExampleDocumentCategory, string> = {
    Relatório: "border-blue-500/20 bg-blue-500/10 text-blue-200",
    Planilha: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    Checklist: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    Política: "border-violet-500/20 bg-violet-500/10 text-violet-200",
    Contrato: "border-rose-500/20 bg-rose-500/10 text-rose-200",
    Outro: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
  };

  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", styles[label])}>
      {label}
    </span>
  );
}

function FileTypeBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
      {label}
    </span>
  );
}

function FolderBadge({ folder }: { folder: string }) {
  const isJustificativa = folder.includes("justificativas");

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        isJustificativa
          ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
      )}
    >
      {isJustificativa ? "Justificativas" : "Documentos principais"}
    </span>
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

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}