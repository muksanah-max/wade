import { notFound } from "next/navigation";
import { getFormula } from "@/lib/db";
import { FormulaDetail } from "./FormulaDetail";

export const dynamic = "force-dynamic";

export default function FormulaDetailPage({ params }: { params: { id: string } }) {
  const record = getFormula(params.id);
  if (!record) notFound();
  return <FormulaDetail record={record!} />;
}
