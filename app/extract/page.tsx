"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormulaEditor, type FormulaEditorValue } from "@/components/FormulaEditor";

export default function ExtractPage() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<FormulaEditorValue | null>(null);
  const [sourceRefId, setSourceRefId] = useState<string | null>(null);

  const handleExtract = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText, title: title || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "提取失败");
      setDraft({
        name: data.draft.name,
        description: data.draft.description,
        tags: data.draft.tags,
        steps: data.draft.steps,
      });
      setSourceRefId(data.source_ref_id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/formulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          structure: draft.steps,
          tags: draft.tags,
          source_ref_id: sourceRefId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "保存失败");
      router.push("/formulas");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">反推公式</h1>
          <p className="text-sm text-neutral-600">
            把抖音爆款原文粘贴进来，AI 会反推出结构公式草案，你可以在右侧编辑后保存。
          </p>
        </div>

        <div>
          <label className="label">来源标题（可选）</label>
          <input
            className="input"
            placeholder="如：某博主 2025 年 4 月爆款"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="label">爆款脚本原文</label>
          <textarea
            className="input min-h-[320px] font-mono text-[13px] leading-relaxed"
            placeholder="粘贴完整的短视频文案 / 转录稿"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button
          className="btn-primary"
          disabled={loading || rawText.trim().length < 20}
          onClick={handleExtract}
        >
          {loading ? "AI 反推中..." : "AI 反推公式"}
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">公式草案</h2>
          {draft && (
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "保存中..." : "保存到公式库"}
            </button>
          )}
        </div>

        {!draft && (
          <div className="card flex min-h-[300px] items-center justify-center text-sm text-neutral-400">
            这里会显示 AI 反推出的公式草案
          </div>
        )}

        {draft && <FormulaEditor value={draft} onChange={setDraft} />}
      </section>
    </div>
  );
}
