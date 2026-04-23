import { NextResponse } from "next/server";
import { listGenerations } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = listGenerations();
  return NextResponse.json({ items });
}
