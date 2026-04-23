import type { FormulaStep } from "./schemas";

export type SeedFormula = {
  name: string;
  description: string;
  tags: string[];
  structure: FormulaStep[];
};

export const SEED_FORMULAS: SeedFormula[] = [
  {
    name: "反转揭秘型",
    description:
      "先用反常识/悬念制造强钩子，再层层揭露背后的真相，最后用金句收尾。适合剧情号、揭秘号、职场吐槽。",
    tags: ["剧情", "反转", "揭秘", "情绪"],
    structure: [
      {
        name: "黄金3秒钩子",
        purpose: "用反常识陈述 / 禁忌话题 / 强承诺，拦住划动的手",
        psychological_trigger: "好奇心 + 认知冲突",
        duration_hint: "0-3 秒",
        tips: [
          "用「没想到…」「千万别…」「大多数人都不知道…」类开场",
          "抛出结论，不要铺垫背景",
          "口播+字幕同屏，字幕放大加粗最扎眼那句",
        ],
      },
      {
        name: "身份锚定",
        purpose: "让观众快速判断「说话的人是谁、为什么我要听」",
        psychological_trigger: "权威感 + 信任感",
        duration_hint: "3-6 秒",
        tips: [
          "一句话讲清经历、身份或数据（如「做了 10 年 HR」）",
          "不要自我介绍名字，直接说立场",
          "避免长铺垫，1 句带过",
        ],
      },
      {
        name: "场景代入",
        purpose: "还原一个观众熟悉的具体场景，触发「这说的就是我」",
        psychological_trigger: "共情 + 代入",
        duration_hint: "6-15 秒",
        tips: [
          "用 3 个以上的具体细节（时间/地点/动作）",
          "避免形容词堆砌，用动词和画面",
          "可以用第二人称「你」直接把观众拉进来",
        ],
      },
      {
        name: "反转揭示",
        purpose: "打破观众刚建立的预期，抛出关键真相或隐藏逻辑",
        psychological_trigger: "意外感 + 顿悟",
        duration_hint: "15-35 秒",
        tips: [
          "前半句承接场景，后半句来一个「但是/其实/真相是」",
          "反转点要具体，最好有数据或案例支撑",
          "配合镜头切换或字幕变色强化冲击感",
        ],
      },
      {
        name: "价值输出",
        purpose: "给出 2-3 条可执行建议，让观众带走「有用的东西」",
        psychological_trigger: "获得感 + 收藏欲",
        duration_hint: "35-55 秒",
        tips: [
          "最多 3 条，每条一句话讲完",
          "用序号「第一…第二…第三…」结构化呈现",
          "字幕用关键词卡片形式，方便截图保存",
        ],
      },
      {
        name: "金句收尾 + 引导互动",
        purpose: "用一句有态度的话收束情绪，同时引导评论/关注",
        psychological_trigger: "表达欲 + 归属感",
        duration_hint: "最后 5-8 秒",
        tips: [
          "金句要有态度有立场，不要中立",
          "引导话术具体化，如「评论区扣 1 告诉我你遇到没」",
          "结尾画面定格人物正脸或字幕特写",
        ],
      },
    ],
  },
  {
    name: "痛点代入型",
    description:
      "上来就戳中目标用户最痛的点，共鸣后给出解决方案。适合知识干货号、情感号、母婴/健康科普。",
    tags: ["痛点", "干货", "共鸣", "解决方案"],
    structure: [
      {
        name: "痛点直击",
        purpose: "第一句话就戳中目标用户最难受的那个场景",
        psychological_trigger: "痛点共鸣",
        duration_hint: "0-3 秒",
        tips: [
          "用「你是不是也…」「明明…却…」开场",
          "痛点要具体，避免宽泛（不说「焦虑」说「凌晨 3 点还睡不着」）",
          "同时展示对应画面，画面和口播同频加重",
        ],
      },
      {
        name: "场景细节铺陈",
        purpose: "补充 2-3 个相关痛点细节，让共鸣升级",
        psychological_trigger: "归属感 + 被看见",
        duration_hint: "3-10 秒",
        tips: [
          "用排比句式连续抛出场景",
          "每个细节都是一个小「对号入座」",
          "语速要快，节奏紧凑",
        ],
      },
      {
        name: "原因剖析",
        purpose: "揭示这些痛点背后的真实原因，建立信任",
        psychological_trigger: "顿悟感 + 专业信任",
        duration_hint: "10-25 秒",
        tips: [
          "给一个反直觉但成立的原因",
          "可以引用数据、研究或名人观点",
          "不要说教，用「其实是因为…」自然带出",
        ],
      },
      {
        name: "分步解决方案",
        purpose: "给出 2-3 步具体可执行方法，让观众觉得能搞定",
        psychological_trigger: "掌控感 + 收藏欲",
        duration_hint: "25-50 秒",
        tips: [
          "每步都要「动词+对象」的格式",
          "先说最容易做的那一步，降低启动门槛",
          "字幕做步骤卡片，编号清晰",
        ],
      },
      {
        name: "结果承诺",
        purpose: "描绘照做之后会有的积极结果，强化行动意愿",
        psychological_trigger: "未来期待",
        duration_hint: "50-58 秒",
        tips: [
          "结果要具体可感知（不说「变好」说「3 天内明显改善」）",
          "可以用对比：现在 vs 做完之后",
        ],
      },
      {
        name: "CTA 引导",
        purpose: "引导点赞/收藏/评论，沉淀私域或完播",
        psychological_trigger: "互惠感",
        duration_hint: "最后 2-5 秒",
        tips: [
          "「点赞收藏慢慢看」是安全选项",
          "评论引导要具体，如「评论区告诉我你卡在第几步」",
        ],
      },
    ],
  },
  {
    name: "观点输出型",
    description:
      "用一个有争议的观点开场，论证 → 举例 → 立住 → 升华。适合个人 IP、知识博主、职场/商业类账号。",
    tags: ["观点", "个人IP", "知识", "论证"],
    structure: [
      {
        name: "反共识观点",
        purpose: "抛出一个有态度、能引发讨论的核心观点",
        psychological_trigger: "立场冲击 + 好奇",
        duration_hint: "0-4 秒",
        tips: [
          "观点必须有明确立场，反对或颠覆一个大众认知",
          "用短句，10 字以内最佳",
          "字幕加粗，必要时配一个挑战表情或动作",
        ],
      },
      {
        name: "立住前提",
        purpose: "解释观点成立的前提条件和背景，避免被杠",
        psychological_trigger: "专业感 + 严谨",
        duration_hint: "4-12 秒",
        tips: [
          "用「我说的是在…情况下」做边界限定",
          "不要展开太多，1-2 句即可",
        ],
      },
      {
        name: "核心论证",
        purpose: "用逻辑链条证明观点为什么成立",
        psychological_trigger: "理性说服",
        duration_hint: "12-35 秒",
        tips: [
          "「因为 A，所以 B，而 B 意味着 C」这样的链条",
          "关键节点配字幕关键词",
          "语速略慢，重点处留白 0.5 秒",
        ],
      },
      {
        name: "举例佐证",
        purpose: "用一个真实或典型案例把论证具象化",
        psychological_trigger: "可感知 + 真实感",
        duration_hint: "35-50 秒",
        tips: [
          "案例要具体到人/时间/结果",
          "可以用「我自己之前…」或「我有个朋友…」开头",
          "结尾点明「这就是我说的 XX」回到观点",
        ],
      },
      {
        name: "升华 + 钩子收尾",
        purpose: "把观点拔高到价值观层面，并为下一条视频埋钩子",
        psychological_trigger: "认同感 + 期待",
        duration_hint: "最后 5-10 秒",
        tips: [
          "把具体观点抽象成一句方法论或人生哲学",
          "结尾加「下一条讲 XX」或「关注我看下一期」",
        ],
      },
    ],
  },
];
