import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">
          把<span className="text-brand"> 爆款 </span>拆成可复用的公式
        </h1>
        <p className="max-w-2xl text-neutral-600">
          粘贴一篇抖音爆款脚本，AI 自动反推出「爆款结构公式」沉淀到你的公式库；
          下一次选一个公式 + 填一个故事骨架，直接产出完整的分镜脚本（口播 / 字幕 / 节奏 / BGM）。
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/extract" className="card transition hover:border-brand hover:shadow">
          <div className="mb-1 text-sm text-brand">① 沉淀</div>
          <h3 className="text-lg font-semibold">反推公式</h3>
          <p className="mt-1 text-sm text-neutral-600">
            粘贴爆款原文，AI 提炼 3~7 步结构，你可以编辑后保存到公式库。
          </p>
        </Link>
        <Link href="/generate" className="card transition hover:border-brand hover:shadow">
          <div className="mb-1 text-sm text-brand">② 生产</div>
          <h3 className="text-lg font-semibold">生成脚本</h3>
          <p className="mt-1 text-sm text-neutral-600">
            选一个公式 + 填写故事框架，一键产出可拍摄的分镜脚本。
          </p>
        </Link>
        <Link href="/formulas" className="card transition hover:border-brand hover:shadow">
          <div className="mb-1 text-sm text-brand">③ 复用</div>
          <h3 className="text-lg font-semibold">公式库</h3>
          <p className="mt-1 text-sm text-neutral-600">
            管理你沉淀的爆款公式：编辑、增减步骤、打标签、删除。
          </p>
        </Link>
      </section>

      <section className="card">
        <h2 className="mb-2 text-base font-semibold">推荐流程</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-neutral-700">
          <li>去 <Link href="/extract" className="text-brand underline">反推公式</Link> 页，粘贴 3~5 篇同类型爆款，AI 各提炼一版。</li>
          <li>在 <Link href="/formulas" className="text-brand underline">公式库</Link> 里合并相似公式、修订细节，形成自己的"公式资产"。</li>
          <li>去 <Link href="/generate" className="text-brand underline">生成脚本</Link>，选公式 + 填你的故事，一键输出分镜。</li>
        </ol>
      </section>
    </div>
  );
}
