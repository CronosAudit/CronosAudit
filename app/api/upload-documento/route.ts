import { NextResponse } from "next/server";

type UploadRequestBody = {
  cnpj?: string;
  arquivos?: string[];
  doc_type?: string;
  ano_fiscal?: string;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UploadRequestBody;

    const cnpj = String(body.cnpj ?? "").trim();
    const arquivos = Array.isArray(body.arquivos) ? body.arquivos : [];
    const doc_type = String(body.doc_type ?? "documento_contabil").trim();
    const ano_fiscal = String(body.ano_fiscal ?? "2025").trim();

    if (!cnpj) {
      return NextResponse.json(
        {
          error: "CNPJ é obrigatório.",
        },
        { status: 400 },
      );
    }

    if (!arquivos.length) {
      return NextResponse.json(
        {
          error: "É necessário informar ao menos um arquivo.",
        },
        { status: 400 },
      );
    }

    const upstreamUrl =
    process.env.CHRONOS_UPLOAD_API_URL ||
    "https://cr6fqv-5000.csb.app/api/ingerir-documentos";

    const payload = {
      cnpj,
      arquivos,
      doc_type,
      ano_fiscal,
    };

    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rawText = await response.text();

    let parsed: unknown = null;
    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsed = { raw: rawText };
    }

    if (!response.ok) {
      console.error("Upstream upload error:", {
        status: response.status,
        body: parsed,
      });

      return NextResponse.json(
        {
          error: "Falha ao enviar documento para o serviço externo.",
          upstream_status: response.status,
          details: parsed,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("Route /api/upload-documento error:", error);

    return NextResponse.json(
      {
        error: "Não foi possível conectar ao serviço de upload.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}