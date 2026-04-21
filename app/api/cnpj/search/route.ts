import { NextResponse } from "next/server";
import { Cnpja } from "@cnpja/sdk";

type CnpjaOfficeSearchItem = {
  taxId?: string;
  alias?: string | null;
  founded?: string | null;
  company?: {
    name?: string | null;
  } | null;
  address?: {
    municipality?: unknown;
    state?: unknown;
  } | null;
  status?: {
    text?: string | null;
  } | null;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function asCleanString(value: unknown): string | null {
  if (typeof value === "string") {
    const cleaned = value.trim();
    return cleaned || null;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const candidateKeys = ["name", "text", "code", "shortName", "short"];
    for (const key of candidateKeys) {
      const candidate = (value as Record<string, unknown>)[key];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const apiKey = process.env.CNPJA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "CNPJA_API_KEY não configurada no servidor." },
        { status: 500 },
      );
    }

    const cnpja = new Cnpja({ apiKey });

    const results: Array<{
      cnpj: string;
      razao_social: string;
      nome_fantasia: string | null;
      municipio: string | null;
      uf: string | null;
      situacao: string | null;
      abertura: string | null;
      label: string;
    }> = [];

    for await (const page of cnpja.office.search({
      limit: 10,
      "names.in": [q],
    })) {
      const items = Array.isArray(page) ? page : [];

      for (const office of items as CnpjaOfficeSearchItem[]) {
        const cnpj = onlyDigits(office.taxId || "");
        if (!cnpj) continue;

        const razaoSocial =
          typeof office.company?.name === "string" && office.company.name.trim()
            ? office.company.name.trim()
            : "Empresa sem razão social";

        const nomeFantasia =
          typeof office.alias === "string" && office.alias.trim()
            ? office.alias.trim()
            : null;

        const municipio = asCleanString(office.address?.municipality);
        const uf = asCleanString(office.address?.state);
        const situacao =
          typeof office.status?.text === "string" && office.status.text.trim()
            ? office.status.text.trim()
            : null;

        const abertura =
          typeof office.founded === "string" && office.founded.trim()
            ? office.founded
            : null;

        results.push({
          cnpj,
          razao_social: razaoSocial,
          nome_fantasia: nomeFantasia,
          municipio,
          uf,
          situacao,
          abertura,
          label: nomeFantasia
            ? `${razaoSocial} (${nomeFantasia})`
            : razaoSocial,
        });
      }

      break;
    }

    return NextResponse.json({ items: results }, { status: 200 });
  } catch (error) {
    console.error("Route /api/cnpj/search error:", error);

    return NextResponse.json(
      {
        error: "Não foi possível consultar empresas no CNPJá.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}