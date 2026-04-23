import { NextResponse } from "next/server";
import { z } from "zod";
import { extractFormula } from "@/lib/anthropic";
import { saveReferenceExample } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const BodySchema = z.object({
  raw_text: z.string().min(20, "脚本文本过短"),
  title: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);
    const ref_id = saveReferenceExample(body.raw_text, body.title);
    const draft = await extractFormula(body.raw_text);
    return NextResponse.json({ draft, source_ref_id: ref_id });
  } catch (err: any) {
    console.error("[api/extract] error", err);
    return NextResponse.json(
      { error: err?.message ?? "提取失败" },
      { status: 500 },
    );
  }
}
