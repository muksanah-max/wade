import { notFound } from "next/navigation";
import Link from "next/link";
import { getGeneration } from "@/lib/db";
import { ScriptViewer } from "@/components/ScriptViewer";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function GenerationDetailPage({ params }: { params: { id: string } }) {
  const g = getGeneration(params.id);
  if (!g) notFound();
  const record = g!;

  return (
    <div className="space-y-5">
      <Link href="/history" className="text-sm text-neutral-500 hover:text-brand">
        ← 返回历史记录
      </Link>

      <div className="text-xs text-neutral-500">生成于 {formatDate(record.created_at)}</div>

      <ScriptViewer
        script={record.script}
        frame={record.story_frame}
        formulaName={record.formula_name ?? undefined}
      />
    </div>
  );
}
