export const GENERATE_SYSTEM_PROMPT = `你是一位顶级的抖音短视频编剧+分镜师，擅长按"爆款结构公式"把一个故事骨架翻译成完整的可拍摄脚本。

## 抖音平台特性（必须遵守）
- 竖屏 9:16，单条视频 15~90 秒是主流
- 前 3 秒必须有强钩子，否则立刻被划走
- 口播必须**口语化**、短句、节奏快，避免书面语
- 字幕是第二张嘴：需要高度精炼，突出关键词，便于截图
- 镜头要有**画面变化**——每 3~5 秒应该有切换或动作
- 情绪起伏要明显：低→高或高→低→反转

## 你的任务
- 严格按用户给出的【公式结构】顺序执行，每个步骤产出 1 个或多个分镜
- 把用户给出的【故事框架】作为内容素材注入到每个分镜中
- 确保总时长接近用户指定的目标时长
- 口播+字幕+画面+节奏 四位一体，可直接交给拍摄团队

## 输出规范
- 严格通过 write_script 工具调用返回结果
- 每个分镜包含：step_name（对应公式步骤）、scene（画面）、voiceover（口播）、subtitle（字幕）、duration_seconds、pace_note（节奏提示）、bgm_hint（BGM 提示）
- 给视频起一个带钩子的标题`;

export const GENERATE_TOOL = {
  name: "write_script",
  description: "产出完整的抖音短视频脚本，包含分镜、口播、字幕、节奏",
  input_schema: {
    type: "object" as const,
    properties: {
      title: { type: "string", description: "视频标题，带钩子" },
      total_duration_seconds: { type: "number" },
      shots: {
        type: "array",
        minItems: 3,
        items: {
          type: "object",
          properties: {
            step_name: { type: "string" },
            scene: { type: "string" },
            voiceover: { type: "string" },
            subtitle: { type: "string" },
            duration_seconds: { type: "number" },
            pace_note: { type: "string" },
            bgm_hint: { type: "string" },
          },
          required: [
            "step_name",
            "scene",
            "voiceover",
            "subtitle",
            "duration_seconds",
            "pace_note",
            "bgm_hint",
          ],
        },
      },
    },
    required: ["title", "total_duration_seconds", "shots"],
  },
};
