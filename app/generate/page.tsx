import { listFormulas } from "@/lib/db";
import { GenerateClient } from "./GenerateClient";

export const dynamic = "force-dynamic";

export default function GeneratePage() {
  const formulas = listFormulas().map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description ?? "",
    tags: f.tags,
    step_count: f.structure.length,
  }));

  return <GenerateClient formulas={formulas} />;
}
