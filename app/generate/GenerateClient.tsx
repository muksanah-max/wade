"use client";

import Link from "next/link";
import { useState } from "react";
import { StoryFrameForm, emptyStoryFrame } from "@/components/StoryFrameForm";
import { ScriptViewer } from "@/components/ScriptViewer";
import type { Script, StoryFrame } from "@/lib/schemas";

type FormulaOption = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  step_count: number;
};

export function GenerateClient({ formulas }: { formulas: FormulaOption[] }) {
  const [formulaId, setFormulaId] = useState<string>(formulas[0]?.id ?? "");
  const [frame, setFrame] = useState<StoryFrame>(emptyStoryFrame());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [submittedFrame, setSubmittedFrame] = useState<StoryFrame | null>(null);

  const activeFormula = formulas.find((f) => f.id === formulaId);

  const submit = async () => {
    setError(null);
    setLoading(true);
    setScript(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formula_id: formulaId, story_frame: frame }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setScript(data.generation.script);
      setSubmittedFrame(frame);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (formulas.length === 0) {
    return (
      <div className="card">
        <h1 className="text-xl font-bold">先去沉淀一个公式</h1>
        <p className="mt-2 text-sm text-neutral-600">
          你的公式库为空。先去{" "}
          <Link className="text-brand underline" href="/extract">
            反推公式
          </Link>
          ，粘贴一篇爆款脚本生成你的第一个公式。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <section className="space-y-4 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold">生成脚本</h1>
          <p className="text-sm text-neutral-600">选择公式 + 填写故事框架，一键产出分镜脚本。</p>
        </div>

        <div>
          <label className="label">选择公式</label>
          <select
            className="input"
            value={formulaId}
            onChange={(e) => setFormulaId(e.target.value)}
          >
            {formulas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}（{f.step_count} 步）
              </option>
            ))}
          </select>
          {activeFormula?.description && (
            <p className="mt-1 text-xs text-neutral-500">{activeFormula.description}</p>
          )}
        </div>

        <StoryFrameForm value={frame} onChange={setFrame} />

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button className="btn-primary" disabled={loading} onClick={submit}>
          {loading ? "生成中... (可能需要 15-30 秒)" : "生成脚本"}
        </button>
      </section>

      <section className="lg:col-span-3">
        {!script && (
          <div className="card flex min-h-[400px] items-center justify-center text-sm text-neutral-400">
            {loading ? "Claude 正在按公式生成分镜..." : "脚本会显示在这里"}
          </div>
        )}
        {script && submittedFrame && (
          <ScriptViewer
            script={script}
            frame={submittedFrame}
            formulaName={activeFormula?.name}
          />
        )}
      </section>
    </div>
  );
}
