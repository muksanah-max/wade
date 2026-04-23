"use client";

import { useState } from "react";
import type { FormulaStep } from "@/lib/schemas";

export type FormulaEditorValue = {
  name: string;
  description: string;
  tags: string[];
  steps: FormulaStep[];
};

function emptyStep(): FormulaStep {
  return {
    name: "",
    purpose: "",
    psychological_trigger: "",
    duration_hint: "",
    tips: [""],
  };
}

export function FormulaEditor({
  value,
  onChange,
}: {
  value: FormulaEditorValue;
  onChange: (next: FormulaEditorValue) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const updateStep = (i: number, patch: Partial<FormulaStep>) => {
    const steps = value.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange({ ...value, steps });
  };

  const addStep = () => onChange({ ...value, steps: [...value.steps, emptyStep()] });

  const removeStep = (i: number) =>
    onChange({ ...value, steps: value.steps.filter((_, idx) => idx !== i) });

  const moveStep = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.steps.length) return;
    const steps = [...value.steps];
    [steps[i], steps[j]] = [steps[j], steps[i]];
    onChange({ ...value, steps });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (value.tags.includes(t)) return;
    onChange({ ...value, tags: [...value.tags, t] });
    setTagInput("");
  };

  const removeTag = (t: string) =>
    onChange({ ...value, tags: value.tags.filter((x) => x !== t) });

  return (
    <div className="space-y-4">
      <div>
        <label className="label">公式名称</label>
        <input
          className="input"
          value={value.name}
          placeholder="如：反转揭秘型"
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>

      <div>
        <label className="label">一句话描述</label>
        <textarea
          className="input min-h-[60px]"
          value={value.description}
          placeholder="这类公式的核心特征和适用场景"
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>

      <div>
        <label className="label">标签</label>
        <div className="flex flex-wrap items-center gap-2">
          {value.tags.map((t) => (
            <span key={t} className="badge gap-1">
              {t}
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-700"
                onClick={() => removeTag(t)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="input w-40"
            value={tagInput}
            placeholder="输入回车添加"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label m-0">步骤（{value.steps.length}）</label>
          <button type="button" className="btn-secondary" onClick={addStep}>
            + 添加步骤
          </button>
        </div>
        <div className="space-y-3">
          {value.steps.map((s, i) => (
            <div key={i} className="card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand">第 {i + 1} 步</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="btn-ghost px-2 py-1"
                    disabled={i === 0}
                    onClick={() => moveStep(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn-ghost px-2 py-1"
                    disabled={i === value.steps.length - 1}
                    onClick={() => moveStep(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn-ghost px-2 py-1 text-red-500"
                    onClick={() => removeStep(i)}
                  >
                    删除
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <label className="label">步骤名</label>
                  <input
                    className="input"
                    value={s.name}
                    onChange={(e) => updateStep(i, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">建议时长</label>
                  <input
                    className="input"
                    value={s.duration_hint}
                    onChange={(e) => updateStep(i, { duration_hint: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">作用</label>
                <textarea
                  className="input min-h-[48px]"
                  value={s.purpose}
                  onChange={(e) => updateStep(i, { purpose: e.target.value })}
                />
              </div>
              <div>
                <label className="label">心理机制</label>
                <input
                  className="input"
                  value={s.psychological_trigger}
                  onChange={(e) =>
                    updateStep(i, { psychological_trigger: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">写作要点（每行一条）</label>
                <textarea
                  className="input min-h-[80px]"
                  value={s.tips.join("\n")}
                  onChange={(e) =>
                    updateStep(i, {
                      tips: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
