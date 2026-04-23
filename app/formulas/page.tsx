import Link from "next/link";
import { listFormulas } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function FormulasPage() {
  const items = listFormulas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">公式库</h1>
          <p className="text-sm text-neutral-600">
            已沉淀 {items.length} 个公式
          </p>
        </div>
        <Link href="/extract" className="btn-primary">
          + 新增（从爆款反推）
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card flex min-h-[200px] items-center justify-center text-sm text-neutral-400">
          公式库为空。去「反推公式」粘贴一篇爆款，生成你的第一个公式吧。
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((f) => (
            <Link key={f.id} href={`/formulas/${f.id}`} className="card transition hover:border-brand hover:shadow">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{f.name}</h3>
                <span className="badge">{f.structure.length} 步</span>
              </div>
              {f.description && (
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{f.description}</p>
              )}
              {f.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {f.tags.map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-neutral-400">
                更新于 {formatDate(f.updated_at)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
