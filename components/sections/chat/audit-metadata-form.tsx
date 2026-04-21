"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  BadgeDollarSign,
  Building2,
  CalendarRange,
  FileText,
  FolderUp,
  Loader2,
  MapPin,
  X,
  Info,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AuditMetadataFormProps,
  TaxRegime,
  DocumentType,
} from "./types";
import { formatCnpj } from "./utils";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "chronos_audit_processing_metadata";

type CompanyData = {
  cnpj: string;
  label?: string;
  nome_fantasia?: string;
  razao_social?: string;
  municipio?: string;
  uf?: string;
  situacao?: string;
  natureza_juridica?: string;
  porte?: string;
  capital_social?: string | number;
  email?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  abertura?: string;
  atividade_principal?: string;
  atividades_secundarias?: string[] | string;
  [key: string]: unknown;
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-6 text-white">
        {String(value)}
      </p>
    </div>
  );
}

export function AuditMetadataForm({
  cnpj,
  setCnpj,
  regimeTributario,
  setRegimeTributario,
  anoFiscal,
  setAnoFiscal,
  docType,
  setDocType,
  companyQuery,
  setCompanyQuery,
  companySuggestions,
  setCompanySuggestions,
  isSearchingCompanies,
  showCompanySuggestions,
  setShowCompanySuggestions,
  compact = false,
}: AuditMetadataFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as {
        companyQuery?: string;
        cnpj?: string;
        regimeTributario?: TaxRegime;
        anoFiscal?: string;
        docType?: DocumentType;
        selectedCompany?: CompanyData | null;
      };

      if (parsed.companyQuery) setCompanyQuery(parsed.companyQuery);
      if (parsed.cnpj) setCnpj(formatCnpj(parsed.cnpj));
      if (parsed.regimeTributario) setRegimeTributario(parsed.regimeTributario);
      if (parsed.anoFiscal) setAnoFiscal(parsed.anoFiscal);
      if (parsed.docType) setDocType(parsed.docType);
      if (parsed.selectedCompany) setSelectedCompany(parsed.selectedCompany);
    } catch (error) {
      console.error("Erro ao restaurar dados do processamento:", error);
    }
  }, [
    setAnoFiscal,
    setCnpj,
    setCompanyQuery,
    setDocType,
    setRegimeTributario,
  ]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          companyQuery,
          cnpj,
          regimeTributario,
          anoFiscal,
          docType,
          selectedCompany,
        }),
      );
    } catch (error) {
      console.error("Erro ao salvar dados do processamento:", error);
    }
  }, [companyQuery, cnpj, regimeTributario, anoFiscal, docType, selectedCompany]);

  useEffect(() => {
    if (!companyModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCompanyModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [companyModalOpen]);

  const inputClassName =
    "h-11 w-full min-w-0 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:bg-black/40";

  const companyDisplayName = useMemo(() => {
    return (
      selectedCompany?.label ||
      selectedCompany?.razao_social ||
      selectedCompany?.nome_fantasia ||
      companyQuery
    );
  }, [selectedCompany, companyQuery]);

  const formattedAddress = useMemo(() => {
    if (!selectedCompany) return "";

    const parts = [
      selectedCompany.logradouro,
      selectedCompany.numero,
      selectedCompany.complemento,
      selectedCompany.bairro,
      selectedCompany.municipio,
      selectedCompany.uf,
      selectedCompany.cep,
    ].filter(Boolean);

    return parts.join(", ");
  }, [selectedCompany]);

  const modalContent =
    companyModalOpen && selectedCompany ? (
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6"
        onClick={() => setCompanyModalOpen(false)}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#0b0d10] shadow-[0_30px_120px_rgba(0,0,0,0.78)] ring-1 ring-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#d4af37]/10 via-transparent to-transparent" />

          <div className="relative flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#f4e7b2]">
                <Building2 className="size-3.5" />
                Empresa selecionada
              </div>

              <p className="mt-3 text-lg font-semibold text-white sm:text-2xl">
                Informações da empresa
              </p>
              <p className="mt-1 break-words text-sm text-zinc-400 sm:text-base">
                {companyDisplayName}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCompanyModalOpen(false)}
              className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="chat-scroll-y relative flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-white sm:text-lg">
                    {companyDisplayName}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-400">
                    <span>{formatCnpj(selectedCompany.cnpj)}</span>
                    {selectedCompany.situacao && (
                      <span>• {selectedCompany.situacao}</span>
                    )}
                    {(selectedCompany.municipio || selectedCompany.uf) && (
                      <span>
                        • {selectedCompany.municipio ?? ""}
                        {selectedCompany.municipio && selectedCompany.uf ? "/" : ""}
                        {selectedCompany.uf ?? ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <InfoRow label="Razão social" value={selectedCompany.razao_social} />
              <InfoRow label="Nome fantasia" value={selectedCompany.nome_fantasia} />
              <InfoRow label="CNPJ" value={formatCnpj(selectedCompany.cnpj)} />
              <InfoRow
                label="Situação cadastral"
                value={selectedCompany.situacao}
              />
              <InfoRow label="Município" value={selectedCompany.municipio} />
              <InfoRow label="UF" value={selectedCompany.uf} />
              <InfoRow
                label="Natureza jurídica"
                value={selectedCompany.natureza_juridica}
              />
              <InfoRow label="Porte" value={selectedCompany.porte} />
              <InfoRow
                label="Capital social"
                value={selectedCompany.capital_social}
              />
              <InfoRow label="Abertura" value={selectedCompany.abertura} />
              <InfoRow label="E-mail" value={selectedCompany.email} />
              <InfoRow label="Telefone" value={selectedCompany.telefone} />
              <InfoRow label="CEP" value={selectedCompany.cep} />
            </div>

            {(formattedAddress || selectedCompany.logradouro) && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#f4e7b2]">
                  <MapPin className="size-4 shrink-0" />
                  Endereço
                </div>
                <p className="break-words text-sm leading-6 text-zinc-200">
                  {formattedAddress || "Endereço não informado"}
                </p>
              </div>
            )}

            {selectedCompany.atividade_principal && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#f4e7b2]">
                  <FileSearch className="size-4 shrink-0" />
                  Atividade principal
                </div>
                <p className="break-words text-sm leading-6 text-zinc-200">
                  {selectedCompany.atividade_principal}
                </p>
              </div>
            )}

            {selectedCompany.atividades_secundarias && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#f4e7b2]">
                  <FileSearch className="size-4 shrink-0" />
                  Atividades secundárias
                </div>

                {Array.isArray(selectedCompany.atividades_secundarias) ? (
                  <ul className="space-y-2 text-sm leading-6 text-zinc-200">
                    {selectedCompany.atividades_secundarias.map((item, index) => (
                      <li key={`${item}-${index}`} className="break-words">
                        • {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="break-words text-sm leading-6 text-zinc-200">
                    {selectedCompany.atividades_secundarias}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-black/20 px-4 py-4 sm:px-6">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setCompanyModalOpen(false)}
                className="rounded-xl bg-[var(--accent-amber)] px-5 text-black hover:brightness-105"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5",
          compact ? "mb-0" : "mb-5 sm:mb-6",
        )}
      >
        <div className="mb-4 flex items-center gap-2 text-sm text-[#f4e7b2]">
          <FolderUp className="size-4 shrink-0" />
          <span className="truncate">Dados do processamento</span>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-3",
            compact ? "grid-cols-1" : "lg:grid-cols-12",
          )}
        >
          <div
            className={cn(
              "min-w-0",
              compact ? "col-span-1" : "lg:col-span-5",
            )}
          >
            <label className="grid gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300">
                <Building2 className="size-3.5 shrink-0" />
                Empresa
              </span>

              <div className="relative min-w-0">
                <input
                  type="text"
                  value={companyQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCompanyQuery(value);

                    if (value.trim().length < 3) {
                      setCompanySuggestions([]);
                      setShowCompanySuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (companySuggestions.length > 0) {
                      setShowCompanySuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setShowCompanySuggestions(false);
                    }, 150);
                  }}
                  placeholder="Digite o nome completo da empresa"
                  className={inputClassName}
                />

                {showCompanySuggestions &&
                  (companySuggestions.length > 0 || isSearchingCompanies) && (
                    <div className="chat-scroll-y absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1012] p-2 shadow-2xl">
                      {isSearchingCompanies ? (
                        <div className="flex items-center gap-2 px-3 py-3 text-sm text-zinc-300">
                          <Loader2 className="size-4 animate-spin text-[#d4af37]" />
                          Buscando empresas...
                        </div>
                      ) : (
                        companySuggestions.map((item) => {
                          const suggestion = item as CompanyData;

                          return (
                            <button
                              key={suggestion.cnpj}
                              type="button"
                              onClick={() => {
                                setCompanyQuery(
                                  suggestion.label ||
                                    suggestion.razao_social ||
                                    suggestion.nome_fantasia ||
                                    "",
                                );
                                setCnpj(formatCnpj(suggestion.cnpj));
                                setSelectedCompany(suggestion);
                                setShowCompanySuggestions(false);
                              }}
                              className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-white/10"
                            >
                              <div className="break-words text-sm font-medium text-white">
                                {suggestion.label ||
                                  suggestion.razao_social ||
                                  suggestion.nome_fantasia}
                              </div>
                              <div className="mt-1 break-words text-xs text-zinc-400">
                                {formatCnpj(suggestion.cnpj)}
                                {suggestion.municipio || suggestion.uf
                                  ? ` • ${suggestion.municipio ?? ""}${
                                      suggestion.municipio && suggestion.uf ? "/" : ""
                                    }${suggestion.uf ?? ""}`
                                  : ""}
                                {suggestion.situacao
                                  ? ` • ${suggestion.situacao}`
                                  : ""}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
              </div>
            </label>
          </div>

          <div
            className={cn(
              "min-w-0",
              compact ? "col-span-1" : "lg:col-span-3",
            )}
          >
            <label className="grid gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300">
                <Building2 className="size-3.5 shrink-0" />
                CNPJ
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
                className={inputClassName}
              />
            </label>
          </div>

          {!compact && (
            <>
              <div className="min-w-0 lg:col-span-4">
                <label className="grid gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <BadgeDollarSign className="size-3.5 shrink-0" />
                    Regime tributário
                  </span>
                  <select
                    value={regimeTributario}
                    onChange={(e) =>
                      setRegimeTributario(e.target.value as TaxRegime)
                    }
                    className={inputClassName}
                  >
                    <option value="simples_nacional">Simples Nacional</option>
                    <option value="lucro_presumido">Lucro Presumido</option>
                    <option value="lucro_real">Lucro Real</option>
                    <option value="mei">MEI</option>
                  </select>
                </label>
              </div>

              <div className="min-w-0 lg:col-span-4">
                <label className="grid gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <CalendarRange className="size-3.5 shrink-0" />
                    Ano fiscal
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={anoFiscal}
                    onChange={(e) =>
                      setAnoFiscal(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="2025"
                    className={inputClassName}
                  />
                </label>
              </div>

              <div className="min-w-0 lg:col-span-8">
                <label className="grid gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <FileText className="size-3.5 shrink-0" />
                    Tipo do documento
                  </span>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className={inputClassName}
                  >
                    <option value="documento_contabil">Documento contábil</option>
                    <option value="razao_contabil">Razão contábil</option>
                    <option value="balancete">Balancete</option>
                    <option value="dre">DRE</option>
                    <option value="livro_fiscal">Livro Fiscal</option>
                    <option value="outro">Outro</option>
                  </select>
                </label>
              </div>
            </>
          )}
        </div>

        {selectedCompany && (
          <div className="mt-4 rounded-2xl ">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCompanyModalOpen(true)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <Info className="mr-2 size-4" />
                Ver detalhes
              </Button>
          </div>
        )}
      </div>

      {mounted && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}