import { z } from "zod";

export const FormulaStepSchema = z.object({
  name: z.string().describe("步骤名称，如「黄金3秒钩子」"),
  purpose: z.string().describe("该步骤在整个爆款结构中的作用"),
  psychological_trigger: z.string().describe("触发的心理机制，如好奇心/代入感/反差感"),
  duration_hint: z.string().describe("建议时长，如「3秒内」「5-8秒」"),
  tips: z.array(z.string()).describe("写作要点，2-4 条具体可执行的建议"),
});
export type FormulaStep = z.infer<typeof FormulaStepSchema>;

export const FormulaStructureSchema = z.object({
  name: z.string().describe("公式名称，如「反转揭秘型」"),
  description: z.string().describe("一句话说明这类公式的核心特征和适用场景"),
  tags: z.array(z.string()).describe("标签，如 [剧情, 反转, 情感]，2-5 个"),
  steps: z.array(FormulaStepSchema).min(3).max(7),
});
export type FormulaStructure = z.infer<typeof FormulaStructureSchema>;

export const StoryFrameSchema = z.object({
  theme: z.string().min(1, "请填写主题"),
  protagonist: z.string().min(1, "请填写主角"),
  scene: z.string().min(1, "请填写场景"),
  core_event: z.string().min(1, "请填写核心事件"),
  message: z.string().min(1, "请填写想传达的点"),
  duration_seconds: z.number().int().positive().max(300).default(60),
  extra_notes: z.string().optional(),
});
export type StoryFrame = z.infer<typeof StoryFrameSchema>;

export const ShotSchema = z.object({
  step_name: z.string().describe("对应公式里的步骤名"),
  scene: z.string().describe("镜头描述：画面内容/取景/动作"),
  voiceover: z.string().describe("口播台词，抖音风格，短句、口语化"),
  subtitle: z.string().describe("屏幕字幕，精炼金句，突出关键词"),
  duration_seconds: z.number().describe("本镜头时长（秒）"),
  pace_note: z.string().describe("节奏提示，如「快切」「留白1s」「加重音」"),
  bgm_hint: z.string().describe("BGM 提示，如「悬疑低频」「情绪高潮」"),
});
export type Shot = z.infer<typeof ShotSchema>;

export const ScriptSchema = z.object({
  title: z.string().describe("视频标题，带钩子"),
  total_duration_seconds: z.number(),
  shots: z.array(ShotSchema).min(3),
});
export type Script = z.infer<typeof ScriptSchema>;

export const FormulaRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  structure: z.array(FormulaStepSchema),
  tags: z.array(z.string()),
  source_ref_id: z.string().nullable(),
  created_at: z.number(),
  updated_at: z.number(),
});
export type FormulaRecord = z.infer<typeof FormulaRecordSchema>;

export const GenerationRecordSchema = z.object({
  id: z.string(),
  formula_id: z.string(),
  formula_name: z.string().nullable(),
  story_frame: StoryFrameSchema,
  script: ScriptSchema,
  created_at: z.number(),
});
export type GenerationRecord = z.infer<typeof GenerationRecordSchema>;
