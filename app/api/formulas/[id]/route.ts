import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteFormula, getFormula, updateFormula } from "@/lib/db";
import { FormulaStepSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UpdateBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  structure: z.array(FormulaStepSchema).min(1),
  tags: z.array(z.string()).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const record = getFormula(params.id);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ formula: record });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const body = UpdateBodySchema.parse(json);
    const record = updateFormula(params.id, {
      name: body.name,
      description: body.description ?? null,
      structure: body.structure,
      tags: body.tags ?? [],
    });
    if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ formula: record });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = deleteFormula(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
