"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormulaEditor, type FormulaEditorValue } from "@/components/FormulaEditor";
import type { FormulaRecord } from "@/lib/schemas";

export function FormulaDetail({ record }: { record: FormulaRecord }) {
  const router = useRouter();
  const [value, setValue] = useState<FormulaEditorValue>({
    name: record.name,
    description: record.description ?? "",
    tags: record.tags,
    steps: record.structure,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/formulas/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value.name,
          description: value.description,
          structure: value.steps,
          tags: value.tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "保存失败");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("确认删除这个公式？")) return;
    const res = await fetch(`/api/formulas/${record.id}`, { method: "DELETE" });
    if (res.ok) router.push("/formulas");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/formulas" className="text-sm text-neutral-500 hover:text-brand">
          ← 返回公式库
        </Link>
        <div className="flex gap-2">
          <button className="btn-secondary text-red-600" onClick={remove}>
            删除
          </button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? "保存中..." : "保存修改"}
          </button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <FormulaEditor value={value} onChange={setValue} />
    </div>
  );
}
