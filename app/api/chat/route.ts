/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const message = formData.get("message") as string;
    const file = formData.get("file") as File | null;

    let filePath = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from("arquivos_relatorio")
        .upload(file.name, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage error:", error);
        return NextResponse.json(
          {
            status: "error",
            message: `Erro no servidor ao enviar arquivo. Detalhes: ${error.message}`,
          },
          { status: 400 }
        );
      }

      filePath = file.name;
    }

    return NextResponse.json({
      status: "success",
      message_received: message || "",
      file_uploaded: filePath,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: `Internal server error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
