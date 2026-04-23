"use client";

import { useState } from "react";
import type { Script, StoryFrame } from "@/lib/schemas";

function toMarkdown(script: Script, frame?: StoryFrame, formulaName?: string): string {
  const lines: string[] = [];
  lines.push(`# ${script.title}`);
  lines.push("");
  if (formulaName) lines.push(`**公式：** ${formulaName}`);
  lines.push(`**总时长：** ${script.total_duration_seconds} 秒`);
  lines.push("");
  if (frame) {
    lines.push("## 故事框架");
    lines.push(`- 主题：${frame.theme}`);
    lines.push(`- 主角：${frame.protagonist}`);
    lines.push(`- 场景：${frame.scene}`);
    lines.push(`- 核心事件：${frame.core_event}`);
    lines.push(`- 传达的点：${frame.message}`);
    lines.push("");
  }
  lines.push("## 分镜脚本");
  script.shots.forEach((s, i) => {
    lines.push("");
    lines.push(`### 镜头 ${i + 1}｜${s.step_name}（${s.duration_seconds}s）`);
    lines.push(`- **画面：** ${s.scene}`);
    lines.push(`- **口播：** ${s.voiceover}`);
    lines.push(`- **字幕：** ${s.subtitle}`);
    lines.push(`- **节奏：** ${s.pace_note}`);
    lines.push(`- **BGM：** ${s.bgm_hint}`);
  });
  return lines.join("\n");
}

export function ScriptViewer({
  script,
  frame,
  formulaName,
}: {
  script: Script;
  frame?: StoryFrame;
  formulaName?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyMd = async () => {
    const md = toMarkdown(script, frame, formulaName);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadMd = () => {
    const md = toMarkdown(script, frame, formulaName);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${script.title || "script"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{script.title}</h2>
          <p className="text-sm text-neutral-500">
            总时长 {script.total_duration_seconds}s · {script.shots.length} 个分镜
            {formulaName ? ` · 基于公式「${formulaName}」` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={copyMd}>
            {copied ? "已复制" : "复制 Markdown"}
          </button>
          <button className="btn-secondary" onClick={downloadMd}>
            下载 .md
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {script.shots.map((s, i) => (
          <div key={i} className="card">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-brand">
                镜头 {i + 1} · {s.step_name}
              </span>
              <span className="badge">{s.duration_seconds}s</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="text-neutral-500">画面：</span>
                {s.scene}
              </p>
              <p>
                <span className="text-neutral-500">口播：</span>
                {s.voiceover}
              </p>
              <p>
                <span className="text-neutral-500">字幕：</span>
                <span className="font-medium">{s.subtitle}</span>
              </p>
              <p className="text-xs text-neutral-500">
                节奏：{s.pace_note} ｜ BGM：{s.bgm_hint}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
