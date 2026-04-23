import Anthropic from "@anthropic-ai/sdk";
import {
  FormulaStructureSchema,
  ScriptSchema,
  type FormulaStructure,
  type FormulaStep,
  type Script,
  type StoryFrame,
} from "./schemas";
import { EXTRACT_SYSTEM_PROMPT, EXTRACT_TOOL } from "./prompts/extract";
import { GENERATE_SYSTEM_PROMPT, GENERATE_TOOL } from "./prompts/generate";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

let clientInstance: Anthropic | null = null;

function getClient(): Anthropic {
  if (!clientInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set. Please configure .env.local");
    }
    clientInstance = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return clientInstance;
}

function logCacheUsage(label: string, usage: any) {
  const read = usage?.cache_read_input_tokens ?? 0;
  const created = usage?.cache_creation_input_tokens ?? 0;
  const input = usage?.input_tokens ?? 0;
  const output = usage?.output_tokens ?? 0;
  console.log(
    `[claude:${label}] input=${input} output=${output} cache_read=${read} cache_created=${created}`,
  );
}

export async function extractFormula(rawText: string): Promise<FormulaStructure> {
  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: EXTRACT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [EXTRACT_TOOL],
    tool_choice: { type: "tool", name: EXTRACT_TOOL.name },
    messages: [
      {
        role: "user",
        content: `这是一篇抖音爆款脚本原文，请反推出它的爆款结构公式：\n\n<script>\n${rawText}\n</script>`,
      },
    ],
  });

  logCacheUsage("extract", res.usage);

  const toolUse = res.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use block");
  }
  return FormulaStructureSchema.parse(toolUse.input);
}

export async function generateScript(
  formula: { name: string; structure: FormulaStep[] },
  frame: StoryFrame,
): Promise<Script> {
  const formulaBlock = `【公式名称】${formula.name}\n【公式结构】\n${formula.structure
    .map(
      (s, i) =>
        `${i + 1}. ${s.name}｜作用：${s.purpose}｜心理机制：${s.psychological_trigger}｜建议时长：${s.duration_hint}\n   要点：${s.tips.join("；")}`,
    )
    .join("\n")}`;

  const frameBlock = `【故事框架】
- 主题：${frame.theme}
- 主角：${frame.protagonist}
- 场景：${frame.scene}
- 核心事件：${frame.core_event}
- 想传达的点：${frame.message}
- 目标时长：${frame.duration_seconds} 秒${frame.extra_notes ? `\n- 额外说明：${frame.extra_notes}` : ""}`;

  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: GENERATE_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [GENERATE_TOOL],
    tool_choice: { type: "tool", name: GENERATE_TOOL.name },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: formulaBlock, cache_control: { type: "ephemeral" } },
          { type: "text", text: frameBlock },
        ],
      },
    ],
  });

  logCacheUsage("generate", res.usage);

  const toolUse = res.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use block");
  }
  return ScriptSchema.parse(toolUse.input);
}
