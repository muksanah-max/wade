import { NextResponse } from "next/server";
import { z } from "zod";
import { generateScript } from "@/lib/anthropic";
import { getFormula, saveGeneration } from "@/lib/db";
import { StoryFrameSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const BodySchema = z.object({
  formula_id: z.string().min(1),
  story_frame: StoryFrameSchema,
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);

    const formula = getFormula(body.formula_id);
    if (!formula) {
      return NextResponse.json({ error: "公式不存在" }, { status: 404 });
    }

    const script = await generateScript(
      { name: formula.name, structure: formula.structure },
      body.story_frame,
    );

    const record = saveGeneration({
      formula_id: body.formula_id,
      story_frame: body.story_frame,
      script,
    });

    return NextResponse.json({ generation: record });
  } catch (err: any) {
    console.error("[api/generate] error", err);
    return NextResponse.json(
      { error: err?.message ?? "生成失败" },
      { status: 500 },
    );
  }
}
