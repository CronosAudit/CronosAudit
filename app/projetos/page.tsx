"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import {
  ArrowLeft,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderPlus,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Navbar, dashboardMenuItems } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type ProjectFolder = {
  name: string;
  path: string;
  fileCount: number;
  updatedAt: string;
};

type ProjectFile = {
  id: string;
  name: string;
  path: string;
  size: number | null;
  updatedAt: string;
};

type StorageEntry = {
  id?: string | null;
  name: string;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: { size?: number; [key: string]: unknown } | null;
};

const BUCKET = "evidences";
const PROJECTS_ROOT = "projetos";
const PLACEHOLDER_FILE = ".keep";

export default function ProjetosPage() {
  const router = useRouter();

  const [userId, setUserId] = React.useState<string | null>(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

  const [projects, setProjects] = React.useState<ProjectFolder[]>([]);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isBusy, setIsBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [info, setInfo] = React.useState("");

  const [selectedProject, setSelectedProject] =
    React.useState<ProjectFolder | null>(null);
  const [projectFiles, setProjectFiles] = React.useState<ProjectFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = React.useState(false);

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");

  const [renameTarget, setRenameTarget] =
    React.useState<ProjectFolder | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  const [deleteTarget, setDeleteTarget] =
    React.useState<ProjectFolder | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    void bootstrap();
  }, []);

  async function bootstrap() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setUserId(user.id);

    const displayName =
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.display_name ||
      "";

    setUserName(displayName);
    setUserEmail(user.email ?? "");

    await loadProjects(user.id);
  }

  function projectsBasePath(uid: string) {
    return `${uid}/${PROJECTS_ROOT}`;
  }

  async function loadProjects(uid: string) {
    try {
      setIsLoading(true);
      setError("");

      const { data, error: listError } = await supabase.storage
        .from(BUCKET)
        .list(projectsBasePath(uid), {
          limit: 500,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) throw listError;

      const folders = (data ?? []).filter(
        (entry) => isFolderEntry(entry as StorageEntry),
      );

      const projectsResolved = await Promise.all(
        folders.map(async (folder) => {
          const folderPath = `${projectsBasePath(uid)}/${folder.name}`;
          const { data: contents } = await supabase.storage
            .from(BUCKET)
            .list(folderPath, {
              limit: 1000,
              offset: 0,
              sortBy: { column: "updated_at", order: "desc" },
            });

          const realFiles = (contents ?? []).filter(
            (item) =>
              !!item.name &&
              item.name !== PLACEHOLDER_FILE &&
              !item.name.startsWith(".") &&
              !isFolderEntry(item as StorageEntry),
          );

          const latest = realFiles[0] as StorageEntry | undefined;

          return {
            name: folder.name,
            path: folderPath,
            fileCount: realFiles.length,
            updatedAt:
              latest?.updated_at ||
              latest?.created_at ||
              (folder as StorageEntry).updated_at ||
              (folder as StorageEntry).created_at ||
              new Date().toISOString(),
          } as ProjectFolder;
        }),
      );

      setProjects(projectsResolved);
    } catch (err) {
      console.error("Erro ao listar projetos:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os projetos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadProjectFiles(project: ProjectFolder) {
    try {
      setIsLoadingFiles(true);

      const { data, error: listError } = await supabase.storage
        .from(BUCKET)
        .list(project.path, {
          limit: 1000,
          offset: 0,
          sortBy: { column: "updated_at", order: "desc" },
        });

      if (listError) throw listError;

      const files = (data ?? [])
        .filter(
          (item) =>
            !!item.name &&
            item.name !== PLACEHOLDER_FILE &&
            !item.name.startsWith(".") &&
            !isFolderEntry(item as StorageEntry),
        )
        .map((item, idx) => ({
          id: String((item as StorageEntry).id || `${project.path}-${item.name}-${idx}`),
          name: item.name,
          path: `${project.path}/${item.name}`,
          size: (item as StorageEntry).metadata?.size ?? null,
          updatedAt:
            (item as StorageEntry).updated_at ||
            (item as StorageEntry).created_at ||
            new Date().toISOString(),
        }));

      setProjectFiles(files);
    } catch (err) {
      console.error("Erro ao listar arquivos do projeto:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os arquivos do projeto.",
      );
    } finally {
      setIsLoadingFiles(false);
    }
  }

  async function handleOpenProject(project: ProjectFolder) {
    setSelectedProject(project);
    setProjectFiles([]);
    setError("");
    setInfo("");
    await loadProjectFiles(project);
  }

  function handleCloseProject() {
    setSelectedProject(null);
    setProjectFiles([]);
  }

  async function handleCreateProject(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;

    const name = sanitizeFolderName(newProjectName);
    if (!name) {
      setError("Informe um nome válido para o projeto.");
      return;
    }

    if (projects.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError("Já existe um projeto com esse nome.");
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setInfo("");

      const placeholderPath = `${projectsBasePath(userId)}/${name}/${PLACEHOLDER_FILE}`;

      const placeholderBlob = new Blob([""], { type: "text/plain" });

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(placeholderPath, placeholderBlob, {
          cacheControl: "0",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      setShowCreateModal(false);
      setNewProjectName("");
      setInfo(`Projeto "${name}" criado.`);
      await loadProjects(userId);
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar o projeto.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRenameProject(event: React.FormEvent) {
    event.preventDefault();
    if (!userId || !renameTarget) return;

    const newName = sanitizeFolderName(renameValue);

    if (!newName) {
      setError("Informe um nome válido para o projeto.");
      return;
    }

    if (newName === renameTarget.name) {
      setRenameTarget(null);
      setRenameValue("");
      return;
    }

    if (projects.some((p) => p.name.toLowerCase() === newName.toLowerCase())) {
      setError("Já existe um projeto com esse nome.");
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setInfo("");

      const oldBase = renameTarget.path;
      const newBase = `${projectsBasePath(userId)}/${newName}`;

      const entries = await listAllFiles(oldBase);

      if (entries.length === 0) {
        const placeholderPath = `${newBase}/${PLACEHOLDER_FILE}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(placeholderPath, new Blob([""], { type: "text/plain" }), {
            cacheControl: "0",
            upsert: true,
          });
        if (uploadError) throw uploadError;
      } else {
        for (const entry of entries) {
          const relative = entry.slice(oldBase.length + 1);
          const target = `${newBase}/${relative}`;

          const { error: moveError } = await supabase.storage
            .from(BUCKET)
            .move(entry, target);

          if (moveError) throw moveError;
        }
      }

      setRenameTarget(null);
      setRenameValue("");
      setInfo(`Projeto renomeado para "${newName}".`);
      await loadProjects(userId);
    } catch (err) {
      console.error("Erro ao renomear projeto:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível renomear o projeto.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDeleteProject(project: ProjectFolder) {
    if (!userId) return;

    try {
      setIsBusy(true);
      setError("");
      setInfo("");

      const allPaths = await listAllFiles(project.path);

      if (allPaths.length > 0) {
        const { error: removeError } = await supabase.storage
          .from(BUCKET)
          .remove(allPaths);

        if (removeError) throw removeError;
      }

      setDeleteTarget(null);
      setInfo(`Projeto "${project.name}" removido.`);

      if (selectedProject?.path === project.path) {
        handleCloseProject();
      }

      await loadProjects(userId);
    } catch (err) {
      console.error("Erro ao remover projeto:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível remover o projeto.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDownloadProject(project: ProjectFolder) {
    try {
      setIsBusy(true);
      setError("");
      setInfo("");

      const paths = await listAllFiles(project.path);
      const realPaths = paths.filter((p) => !p.endsWith(`/${PLACEHOLDER_FILE}`));

      if (realPaths.length === 0) {
        setInfo("Este projeto não possui arquivos para baixar.");
        return;
      }

      const zip = new JSZip();
      const projectFolder = zip.folder(project.name) ?? zip;
      const baseLength = project.path.length + 1;

      let failed = 0;

      for (const path of realPaths) {
        const { data, error: downloadError } = await supabase.storage
          .from(BUCKET)
          .download(path);

        if (downloadError || !data) {
          console.error("Erro ao baixar arquivo do projeto:", downloadError);
          failed += 1;
          continue;
        }

        const relativePath = path.slice(baseLength);
        const arrayBuffer = await data.arrayBuffer();
        projectFolder.file(relativePath, arrayBuffer);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const zipName = `${sanitizeFileName(project.name) || "projeto"}.zip`;
      const blobUrl = URL.createObjectURL(zipBlob);

      try {
        await triggerBrowserDownload(blobUrl, zipName);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }

      const successCount = realPaths.length - failed;

      setInfo(
        failed === 0
          ? `Projeto "${project.name}" compactado com ${successCount} arquivo(s) e baixado como ${zipName}.`
          : `Projeto baixado parcialmente: ${successCount} arquivo(s) incluído(s), ${failed} falha(s).`,
      );
    } catch (err) {
      console.error("Erro ao baixar projeto:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível baixar o projeto.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handleViewFile(file: ProjectFile) {
    try {
      const { data, error: signError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(file.path, 60 * 10);

      if (signError) throw signError;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Erro ao visualizar arquivo:", err);
      setError("Não foi possível visualizar este arquivo.");
    }
  }

  async function handleDownloadFile(file: ProjectFile) {
    try {
      const { data, error: signError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(file.path, 60 * 10, { download: file.name });

      if (signError) throw signError;

      if (data?.signedUrl) {
        await triggerBrowserDownload(data.signedUrl);
      }
    } catch (err) {
      console.error("Erro ao baixar arquivo:", err);
      setError("Não foi possível baixar este arquivo.");
    }
  }

  async function handleDeleteFile(file: ProjectFile) {
    if (!selectedProject) return;

    const confirmed = window.confirm(
      `Deseja remover o arquivo "${file.name}"?`,
    );
    if (!confirmed) return;

    try {
      setIsBusy(true);
      setError("");

      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove([file.path]);

      if (removeError) throw removeError;

      setInfo(`Arquivo "${file.name}" removido.`);
      await loadProjectFiles(selectedProject);
      if (userId) await loadProjects(userId);
    } catch (err) {
      console.error("Erro ao remover arquivo:", err);
      setError("Não foi possível remover este arquivo.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleUploadFiles(filesList: FileList | null) {
    if (!filesList || !selectedProject) return;

    try {
      setIsBusy(true);
      setError("");
      setInfo("");

      const files = Array.from(filesList);

      for (const file of files) {
        const safeName = sanitizeFileName(file.name);
        const path = `${selectedProject.path}/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;
      }

      setInfo(`${files.length} arquivo(s) enviado(s) para o projeto.`);
      await loadProjectFiles(selectedProject);
      if (userId) await loadProjects(userId);
    } catch (err) {
      console.error("Erro ao enviar arquivos:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar os arquivos.",
      );
    } finally {
      setIsBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function listAllFiles(basePath: string): Promise<string[]> {
    const results: string[] = [];

    async function walk(path: string) {
      const { data, error: listError } = await supabase.storage
        .from(BUCKET)
        .list(path, {
          limit: 1000,
          offset: 0,
        });

      if (listError) throw listError;

      for (const entry of data ?? []) {
        if (!entry.name) continue;
        const fullPath = `${path}/${entry.name}`;
        if (isFolderEntry(entry as StorageEntry)) {
          await walk(fullPath);
        } else {
          results.push(fullPath);
        }
      }
    }

    await walk(basePath);
    return results;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const filteredProjects = React.useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(term));
  }, [projects, search]);

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
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <span>{error}</span>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setError("")}
                  className="text-red-200/70 hover:text-red-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            {info && (
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <span>{info}</span>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setInfo("")}
                  className="text-emerald-200/70 hover:text-emerald-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            {!selectedProject ? (
              <>
                <section className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/5 px-4 py-2 text-sm text-[#f4e7b2] backdrop-blur-md">
                        <Sparkles className="size-4" />
                        Organização de projetos
                      </div>

                      <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                        Seus
                        <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                          {" "}
                          Projetos
                        </span>
                      </h1>

                      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                        Crie pastas para organizar os arquivos, evidências e
                        relatórios gerados pela IA para cada projeto de
                        auditoria.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        onClick={() => {
                          setShowCreateModal(true);
                          setNewProjectName("");
                          setError("");
                        }}
                        className="h-11 rounded-2xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633]"
                      >
                        <FolderPlus className="mr-2 size-4" />
                        Novo projeto
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <SummaryStat
                      title="Total de projetos"
                      value={isLoading ? "..." : String(projects.length)}
                      helper="Pastas criadas para esta conta"
                    />
                    <SummaryStat
                      title="Arquivos armazenados"
                      value={
                        isLoading
                          ? "..."
                          : String(
                              projects.reduce(
                                (acc, p) => acc + p.fileCount,
                                0,
                              ),
                            )
                      }
                      helper="Somando todos os projetos"
                    />
                    <SummaryStat
                      title="Filtrados"
                      value={
                        isLoading ? "..." : String(filteredProjects.length)
                      }
                      helper="Com base na busca atual"
                    />
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-5 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#f4e7b2]">
                        Biblioteca
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Pastas de projetos
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative min-w-[260px]">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Buscar projeto"
                          className="h-11 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                        />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                        {isLoading
                          ? "Carregando..."
                          : `${filteredProjects.length} projeto(s)`}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {isLoading ? (
                      <div className="col-span-full">
                        <LoadingState text="Carregando projetos..." />
                      </div>
                    ) : filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <ProjectCard
                          key={project.path}
                          project={project}
                          disabled={isBusy}
                          onOpen={() => handleOpenProject(project)}
                          onRename={() => {
                            setRenameTarget(project);
                            setRenameValue(project.name);
                            setError("");
                          }}
                          onDelete={() => {
                            setDeleteTarget(project);
                            setError("");
                          }}
                          onDownload={() => handleDownloadProject(project)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                        <Folder className="mx-auto size-10 text-zinc-600" />
                        <p className="mt-4 text-sm font-medium text-white">
                          Nenhum projeto encontrado
                        </p>
                        <p className="mt-2 text-sm text-zinc-400">
                          Crie seu primeiro projeto para começar a organizar
                          seus arquivos e relatórios.
                        </p>
                        <Button
                          onClick={() => {
                            setShowCreateModal(true);
                            setNewProjectName("");
                          }}
                          className="mt-5 h-10 rounded-xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633]"
                        >
                          <Plus className="mr-2 size-4" />
                          Criar projeto
                        </Button>
                      </div>
                    )}
                  </div>
                </section>
              </>
            ) : (
              <ProjectDetailView
                project={selectedProject}
                files={projectFiles}
                isLoading={isLoadingFiles}
                isBusy={isBusy}
                onBack={handleCloseProject}
                onUpload={(list) => handleUploadFiles(list)}
                onView={handleViewFile}
                onDownload={handleDownloadFile}
                onDeleteFile={handleDeleteFile}
                onDownloadAll={() => handleDownloadProject(selectedProject)}
                onRename={() => {
                  setRenameTarget(selectedProject);
                  setRenameValue(selectedProject.name);
                }}
                onDelete={() => setDeleteTarget(selectedProject)}
                fileInputRef={fileInputRef}
              />
            )}
          </div>
        </section>
      </main>

      {showCreateModal && (
        <Modal
          title="Novo projeto"
          subtitle="Crie uma nova pasta para organizar arquivos e relatórios."
          onClose={() => {
            setShowCreateModal(false);
            setNewProjectName("");
          }}
        >
          <form onSubmit={handleCreateProject} className="space-y-5">
            <div>
              <label
                htmlFor="new-project-name"
                className="block text-sm font-medium text-zinc-300"
              >
                Nome do projeto
              </label>
              <input
                id="new-project-name"
                autoFocus
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Ex: Auditoria Empresa X - 2026"
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Caracteres permitidos: letras, números, espaços, traços e
                underscores.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewProjectName("");
                }}
                className="h-11 rounded-2xl border border-white/10 px-5 text-sm text-white hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isBusy}
                className="h-11 rounded-2xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <FolderPlus className="mr-2 size-4" />
                )}
                Criar projeto
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {renameTarget && (
        <Modal
          title={`Renomear "${renameTarget.name}"`}
          subtitle="Defina um novo nome para a pasta do projeto."
          onClose={() => {
            setRenameTarget(null);
            setRenameValue("");
          }}
        >
          <form onSubmit={handleRenameProject} className="space-y-5">
            <div>
              <label
                htmlFor="rename-project"
                className="block text-sm font-medium text-zinc-300"
              >
                Novo nome
              </label>
              <input
                id="rename-project"
                autoFocus
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setRenameTarget(null);
                  setRenameValue("");
                }}
                className="h-11 rounded-2xl border border-white/10 px-5 text-sm text-white hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isBusy}
                className="h-11 rounded-2xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Pencil className="mr-2 size-4" />
                )}
                Renomear
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal
          title="Remover projeto"
          subtitle="Esta ação não pode ser desfeita."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="space-y-5">
            <p className="text-sm leading-6 text-zinc-300">
              Tem certeza de que deseja remover o projeto{" "}
              <span className="font-semibold text-white">
                {deleteTarget.name}
              </span>
              ? Todos os arquivos e relatórios armazenados nessa pasta serão
              apagados permanentemente.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
                className="h-11 rounded-2xl border border-white/10 px-5 text-sm text-white hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={() => handleDeleteProject(deleteTarget)}
                disabled={isBusy}
                className="h-11 rounded-2xl bg-red-500 px-5 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4" />
                )}
                Remover projeto
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function ProjectCard({
  project,
  disabled,
  onOpen,
  onRename,
  onDelete,
  onDownload,
}: {
  project: ProjectFolder;
  disabled: boolean;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
  onDownload: () => void;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group relative rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#d4af37]/20 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="flex flex-1 items-start gap-4 text-left"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10">
            <Folder className="size-6 text-[#d4af37]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold text-white">
              {project.name}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {project.fileCount} arquivo(s)
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Atualizado em {formatDateLabel(project.updatedAt)}
            </p>
          </div>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Mais ações"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-52 rounded-2xl border border-white/10 bg-[#121214] p-2 shadow-2xl shadow-black/30">
              <ActionMenuItem
                icon={<Eye className="size-4" />}
                label="Abrir"
                onClick={() => {
                  setMenuOpen(false);
                  onOpen();
                }}
                disabled={disabled}
              />
              <ActionMenuItem
                icon={<Download className="size-4" />}
                label="Baixar pasta"
                onClick={() => {
                  setMenuOpen(false);
                  onDownload();
                }}
                disabled={disabled}
              />
              <ActionMenuItem
                icon={<Pencil className="size-4" />}
                label="Renomear"
                onClick={() => {
                  setMenuOpen(false);
                  onRename();
                }}
                disabled={disabled}
              />
              <ActionMenuItem
                icon={<Trash2 className="size-4" />}
                label="Remover"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                disabled={disabled}
                tone="danger"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onOpen}
          disabled={disabled}
          className="h-10 flex-1 rounded-xl border border-white/10 px-4 text-sm text-white hover:bg-white/10 hover:text-white"
        >
          <Eye className="mr-2 size-4" />
          Abrir
        </Button>

        <Button
          type="button"
          onClick={onDownload}
          disabled={disabled}
          className="h-10 flex-1 rounded-xl bg-[#d4af37] px-4 text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="mr-2 size-4" />
          Baixar
        </Button>
      </div>
    </div>
  );
}

function ProjectDetailView({
  project,
  files,
  isLoading,
  isBusy,
  onBack,
  onUpload,
  onView,
  onDownload,
  onDeleteFile,
  onDownloadAll,
  onRename,
  onDelete,
  fileInputRef,
}: {
  project: ProjectFolder;
  files: ProjectFile[];
  isLoading: boolean;
  isBusy: boolean;
  onBack: () => void;
  onUpload: (files: FileList | null) => void;
  onView: (file: ProjectFile) => void;
  onDownload: (file: ProjectFile) => void;
  onDeleteFile: (file: ProjectFile) => void;
  onDownloadAll: () => void;
  onRename: () => void;
  onDelete: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <>
      <section className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Voltar para projetos
            </button>

            <h1 className="mt-5 break-words text-3xl font-semibold leading-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                {project.name}
              </span>
            </h1>

            <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">
              Gerencie os arquivos enviados, evidências e relatórios deste
              projeto.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="h-11 rounded-2xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="mr-2 size-4" />
              Enviar arquivos
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => onUpload(e.target.files)}
            />

            <Button
              type="button"
              variant="ghost"
              onClick={onDownloadAll}
              disabled={isBusy || files.length === 0}
              className="h-11 rounded-2xl border border-white/10 px-5 text-sm text-white hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="mr-2 size-4" />
              Baixar tudo
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onRename}
              disabled={isBusy}
              className="h-11 rounded-2xl border border-white/10 px-5 text-sm text-white hover:bg-white/10 hover:text-white"
            >
              <Pencil className="mr-2 size-4" />
              Renomear
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              disabled={isBusy}
              className="h-11 rounded-2xl border border-red-500/30 px-5 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200"
            >
              <Trash2 className="mr-2 size-4" />
              Remover
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#111214]/85 p-5 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[#f4e7b2]">Conteúdo</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Arquivos do projeto
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
            {isLoading
              ? "Carregando..."
              : `${files.length} arquivo(s) armazenado(s)`}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[1.6fr_0.8fr_0.8fr_140px] bg-white/[0.04] px-5 py-4 text-sm font-medium text-zinc-300 md:grid">
            <div>Arquivo</div>
            <div>Tamanho</div>
            <div>Atualizado em</div>
            <div className="text-right">Ações</div>
          </div>

          <div className="divide-y divide-white/10">
            {isLoading ? (
              <div className="px-5 py-8">
                <LoadingState text="Carregando arquivos..." />
              </div>
            ) : files.length > 0 ? (
              files.map((file) => (
                <article
                  key={file.id}
                  className="grid gap-3 bg-black/10 px-5 py-4 transition hover:bg-white/[0.03] md:grid-cols-[1.6fr_0.8fr_0.8fr_140px] md:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                      <DocumentIcon type={getFileExtension(file.name)} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {beautifyFileName(file.name)}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {file.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-zinc-300">
                    <span className="mb-1 block text-xs text-zinc-500 md:hidden">
                      Tamanho
                    </span>
                    {typeof file.size === "number"
                      ? formatBytes(file.size)
                      : "—"}
                  </div>

                  <div className="text-sm text-zinc-300">
                    <span className="mb-1 block text-xs text-zinc-500 md:hidden">
                      Atualizado em
                    </span>
                    {formatDateLabel(file.updatedAt)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => onView(file)}
                      aria-label={`Visualizar ${file.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-200 transition hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownload(file)}
                      aria-label={`Baixar ${file.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-200 transition hover:bg-white/10 hover:text-white"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFile(file)}
                      aria-label={`Remover ${file.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="px-5 py-10 text-center">
                <Folder className="mx-auto size-10 text-zinc-600" />
                <p className="mt-4 text-sm font-medium text-white">
                  Pasta vazia
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Envie arquivos para começar a organizar este projeto.
                </p>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 h-10 rounded-xl bg-[#d4af37] px-5 text-sm font-semibold text-black hover:bg-[#c9a633]"
                >
                  <Upload className="mr-2 size-4" />
                  Enviar arquivos
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Modal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-[24px] border border-white/10 bg-[#121214] p-6 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function SummaryStat({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
          <Folder className="size-5 text-[#d4af37]" />
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-400">{title}</p>
      <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </div>
  );
}

function ActionMenuItem({
  icon,
  label,
  onClick,
  disabled,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50",
        tone === "danger"
          ? "text-red-300 hover:bg-red-500/10"
          : "text-zinc-200 hover:bg-white/5 hover:text-[#f4e7b2]",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function DocumentIcon({ type }: { type: string }) {
  const normalized = type.toLowerCase();
  if (["xlsx", "xls", "csv"].includes(normalized)) {
    return <FileSpreadsheet className="size-5 text-[#d4af37]" />;
  }
  if (normalized === "pdf") {
    return <FileCheck2 className="size-5 text-[#d4af37]" />;
  }
  return <FileText className="size-5 text-[#d4af37]" />;
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
      <Loader2 className="size-4 animate-spin text-[#d4af37]" />
      {text}
    </div>
  );
}

function isFolderEntry(item: StorageEntry) {
  return !item.updated_at && !item.created_at && !item.metadata;
}

function sanitizeFolderName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

function beautifyFileName(fileName: string) {
  return fileName
    .replace(/^\d+-/, "")
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function formatDateLabel(value: string) {
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

async function triggerBrowserDownload(url: string, fileName?: string) {
  return new Promise<void>((resolve) => {
    const link = document.createElement("a");
    link.href = url;
    if (fileName) {
      link.download = fileName;
    } else {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(resolve, 300);
  });
}