"use client";

import type { StoryFrame } from "@/lib/schemas";

export function StoryFrameForm({
  value,
  onChange,
}: {
  value: StoryFrame;
  onChange: (v: StoryFrame) => void;
}) {
  const set = <K extends keyof StoryFrame>(k: K, v: StoryFrame[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div>
        <label className="label">主题</label>
        <input
          className="input"
          value={value.theme}
          placeholder="如：职场真相 / 自我成长 / 消费主义"
          onChange={(e) => set("theme", e.target.value)}
        />
      </div>
      <div>
        <label className="label">主角</label>
        <input
          className="input"
          value={value.protagonist}
          placeholder="如：25岁互联网打工人小李"
          onChange={(e) => set("protagonist", e.target.value)}
        />
      </div>
      <div>
        <label className="label">场景</label>
        <input
          className="input"
          value={value.scene}
          placeholder="如：深夜加班后走向地铁站"
          onChange={(e) => set("scene", e.target.value)}
        />
      </div>
      <div>
        <label className="label">目标时长（秒）</label>
        <input
          type="number"
          className="input"
          value={value.duration_seconds}
          min={15}
          max={300}
          onChange={(e) => set("duration_seconds", Number(e.target.value) || 60)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="label">核心事件</label>
        <textarea
          className="input min-h-[64px]"
          value={value.core_event}
          placeholder="故事里发生了什么关键事件，推动情节"
          onChange={(e) => set("core_event", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="label">想传达的点</label>
        <textarea
          className="input min-h-[64px]"
          value={value.message}
          placeholder="观众看完应该记住什么 / 触发什么情绪"
          onChange={(e) => set("message", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="label">额外说明（可选）</label>
        <textarea
          className="input min-h-[48px]"
          value={value.extra_notes ?? ""}
          placeholder="风格偏好 / 特定要求 / 金句灵感"
          onChange={(e) => set("extra_notes", e.target.value)}
        />
      </div>
    </div>
  );
}

export function emptyStoryFrame(): StoryFrame {
  return {
    theme: "",
    protagonist: "",
    scene: "",
    core_event: "",
    message: "",
    duration_seconds: 60,
    extra_notes: "",
  };
}
