import Link from "next/link";
import { listGenerations } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const items = listGenerations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">历史记录</h1>
        <p className="text-sm text-neutral-600">共 {items.length} 条生成记录</p>
      </div>

      {items.length === 0 ? (
        <div className="card flex min-h-[200px] items-center justify-center text-sm text-neutral-400">
          还没有生成过脚本。
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((g) => (
            <Link
              key={g.id}
              href={`/history/${g.id}`}
              className="card block transition hover:border-brand hover:shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">{g.script.title}</h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    {g.formula_name ? `公式：${g.formula_name} · ` : ""}
                    主题：{g.story_frame.theme} · 时长 {g.script.total_duration_seconds}s ·{" "}
                    {formatDate(g.created_at)}
                  </p>
                </div>
                <span className="badge">{g.script.shots.length} 镜</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
