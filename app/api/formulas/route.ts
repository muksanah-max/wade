import { NextResponse } from "next/server";
import { z } from "zod";
import { createFormula, listFormulas } from "@/lib/db";
import { FormulaStepSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CreateBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  structure: z.array(FormulaStepSchema).min(1),
  tags: z.array(z.string()).optional(),
  source_ref_id: z.string().optional().nullable(),
});

export async function GET() {
  const items = listFormulas();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = CreateBodySchema.parse(json);
    const record = createFormula({
      name: body.name,
      description: body.description ?? null,
      structure: body.structure,
      tags: body.tags ?? [],
      source_ref_id: body.source_ref_id ?? null,
    });
    return NextResponse.json({ formula: record }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
}
