import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SAMPLE_CANDIDATES, type Candidate, type Stage } from "./candidates";

const databaseState = globalThis as typeof globalThis & {
  talentDb?: DatabaseSync;
};

function getDatabase() {
  if (databaseState.talentDb) return databaseState.talentDb;

  const path = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH ||
      "data/talent.sqlite",
  );
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);

  try {
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT NOT NULL,
        stage TEXT NOT NULL CHECK (stage IN ('Sourced', 'Screening', 'Interview', 'Hired'))
      );
      BEGIN IMMEDIATE;
    `);

    const { count } = db
      .prepare("SELECT COUNT(*) AS count FROM candidates")
      .get() as { count: number };
    if (count === 0) {
      const insert = db.prepare(
        "INSERT INTO candidates (id, name, role, email, stage) VALUES (?, ?, ?, ?, ?)",
      );
      for (const candidate of SAMPLE_CANDIDATES) {
        insert.run(
          candidate.id,
          candidate.name,
          candidate.role,
          candidate.email,
          candidate.stage,
        );
      }
    }
    db.exec("COMMIT");
    databaseState.talentDb = db;
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

export function listCandidates(): Candidate[] {
  return getDatabase()
    .prepare("SELECT id, name, role, email, stage FROM candidates ORDER BY id")
    .all() as Candidate[];
}

export function updateCandidateStage(
  id: number,
  stage: Stage,
): Candidate | undefined {
  return getDatabase()
    .prepare(
      "UPDATE candidates SET stage = ? WHERE id = ? RETURNING id, name, role, email, stage",
    )
    .get(stage, id) as Candidate | undefined;
}
