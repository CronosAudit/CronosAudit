import { NextResponse } from "next/server";
import { CnpjaOpen } from "@cnpja/sdk";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taxId = onlyDigits(searchParams.get("taxId") || "");

    if (taxId.length !== 14) {
      return NextResponse.json(
        { error: "CNPJ inválido." },
        { status: 400 },
      );
    }

    const cnpja = new CnpjaOpen();
    const office = await cnpja.office.read({ taxId });

    return NextResponse.json(office, { status: 200 });
  } catch (error) {
    console.error("Route /api/cnpj/read error:", error);

    return NextResponse.json(
      {
        error: "Não foi possível consultar o CNPJ informado.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}