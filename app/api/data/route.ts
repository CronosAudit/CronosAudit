/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("Teste")
      .select("*");

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}