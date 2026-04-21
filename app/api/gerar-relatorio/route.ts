import { NextResponse } from "next/server";

type ReportRequestBody = {
  cnpj?: string;
  regime_tributario?: string;
  ano_fiscal?: string;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReportRequestBody;

    const cnpj = String(body.cnpj ?? "").trim();
    const regime_tributario = String(body.regime_tributario ?? "").trim();
    const ano_fiscal = String(body.ano_fiscal ?? "2025").trim();

    if (!cnpj || !regime_tributario) {
      return NextResponse.json(
        {
          error: "Campos obrigatórios não informados.",
          details: {
            cnpj: !cnpj ? "CNPJ é obrigatório." : null,
            regime_tributario: !regime_tributario
              ? "Regime tributário é obrigatório."
              : null,
          },
        },
        { status: 400 },
      );
    }

    const upstreamUrl =
      process.env.CHRONOS_REPORT_API_URL ||
      "https://cr6fqv-5000.csb.app/api/gerar-relatorio";

    const payload = {
      cnpj,
      regime_tributario,
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
      console.error("Upstream report error:", {
        status: response.status,
        body: parsed,
      });

      return NextResponse.json(
        {
          error: "Falha ao gerar relatório no serviço externo.",
          upstream_status: response.status,
          details: parsed,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("Route /api/gerar-relatorio error:", error);

    return NextResponse.json(
      {
        error: "Não foi possível conectar ao serviço de relatório.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}