import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { nanoid } from "nanoid";
import type { FormulaRecord, FormulaStep, GenerationRecord, Script, StoryFrame } from "./schemas";

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "app.db");

let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS formulas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      structure_json TEXT NOT NULL,
      tags_json TEXT NOT NULL DEFAULT '[]',
      source_ref_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reference_examples (
      id TEXT PRIMARY KEY,
      raw_text TEXT NOT NULL,
      title TEXT,
      source_url TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      formula_id TEXT NOT NULL,
      story_frame_json TEXT NOT NULL,
      script_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_formulas_created ON formulas(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_generations_created ON generations(created_at DESC);
  `);

  dbInstance = db;
  return db;
}

function rowToFormula(row: any): FormulaRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    structure: JSON.parse(row.structure_json),
    tags: JSON.parse(row.tags_json || "[]"),
    source_ref_id: row.source_ref_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function listFormulas(): FormulaRecord[] {
  const rows = getDb().prepare("SELECT * FROM formulas ORDER BY updated_at DESC").all();
  return rows.map(rowToFormula);
}

export function getFormula(id: string): FormulaRecord | null {
  const row = getDb().prepare("SELECT * FROM formulas WHERE id = ?").get(id);
  return row ? rowToFormula(row) : null;
}

export function createFormula(input: {
  name: string;
  description?: string | null;
  structure: FormulaStep[];
  tags?: string[];
  source_ref_id?: string | null;
}): FormulaRecord {
  const id = nanoid(12);
  const now = Date.now();
  getDb()
    .prepare(
      `INSERT INTO formulas (id, name, description, structure_json, tags_json, source_ref_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.name,
      input.description ?? null,
      JSON.stringify(input.structure),
      JSON.stringify(input.tags ?? []),
      input.source_ref_id ?? null,
      now,
      now,
    );
  return getFormula(id)!;
}

export function updateFormula(
  id: string,
  input: { name: string; description?: string | null; structure: FormulaStep[]; tags?: string[] },
): FormulaRecord | null {
  const now = Date.now();
  const res = getDb()
    .prepare(
      `UPDATE formulas SET name = ?, description = ?, structure_json = ?, tags_json = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(
      input.name,
      input.description ?? null,
      JSON.stringify(input.structure),
      JSON.stringify(input.tags ?? []),
      now,
      id,
    );
  if (res.changes === 0) return null;
  return getFormula(id);
}

export function deleteFormula(id: string): boolean {
  const res = getDb().prepare("DELETE FROM formulas WHERE id = ?").run(id);
  return res.changes > 0;
}

export function saveReferenceExample(raw_text: string, title?: string): string {
  const id = nanoid(12);
  getDb()
    .prepare("INSERT INTO reference_examples (id, raw_text, title, created_at) VALUES (?, ?, ?, ?)")
    .run(id, raw_text, title ?? null, Date.now());
  return id;
}

export function saveGeneration(input: {
  formula_id: string;
  story_frame: StoryFrame;
  script: Script;
}): GenerationRecord {
  const id = nanoid(12);
  const now = Date.now();
  getDb()
    .prepare(
      `INSERT INTO generations (id, formula_id, story_frame_json, script_json, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.formula_id,
      JSON.stringify(input.story_frame),
      JSON.stringify(input.script),
      now,
    );
  return {
    id,
    formula_id: input.formula_id,
    formula_name: getFormula(input.formula_id)?.name ?? null,
    story_frame: input.story_frame,
    script: input.script,
    created_at: now,
  };
}

export function listGenerations(): GenerationRecord[] {
  const rows = getDb()
    .prepare(
      `SELECT g.*, f.name AS formula_name
       FROM generations g LEFT JOIN formulas f ON f.id = g.formula_id
       ORDER BY g.created_at DESC`,
    )
    .all() as any[];
  return rows.map((r) => ({
    id: r.id,
    formula_id: r.formula_id,
    formula_name: r.formula_name,
    story_frame: JSON.parse(r.story_frame_json),
    script: JSON.parse(r.script_json),
    created_at: r.created_at,
  }));
}

export function getGeneration(id: string): GenerationRecord | null {
  const row = getDb()
    .prepare(
      `SELECT g.*, f.name AS formula_name
       FROM generations g LEFT JOIN formulas f ON f.id = g.formula_id
       WHERE g.id = ?`,
    )
    .get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    formula_id: row.formula_id,
    formula_name: row.formula_name,
    story_frame: JSON.parse(row.story_frame_json),
    script: JSON.parse(row.script_json),
    created_at: row.created_at,
  };
}
