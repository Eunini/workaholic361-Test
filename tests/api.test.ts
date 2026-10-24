import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import type { DatabaseSync } from "node:sqlite";
import { GET } from "../src/app/api/candidates/route";
import { PATCH } from "../src/app/api/candidates/[id]/route";
import { SAMPLE_CANDIDATES } from "../src/lib/candidates";

const temporaryDirectory = mkdtempSync(join(tmpdir(), "talent-api-"));
const originalDatabasePath = process.env.DATABASE_PATH;
before(() => {
  process.env.DATABASE_PATH = join(temporaryDirectory, "test.sqlite");
});
after(() => {
  const state = globalThis as typeof globalThis & { talentDb?: DatabaseSync };
  state.talentDb?.close();
  delete state.talentDb;
  if (originalDatabasePath === undefined) delete process.env.DATABASE_PATH;
  else process.env.DATABASE_PATH = originalDatabasePath;
  rmSync(temporaryDirectory, { recursive: true, force: true });
});

function patch(id: string, body: unknown) {
  return PATCH(
    new Request(`http://localhost/api/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id }) },
  );
}

test("GET seeds ten candidates and disables caching", async () => {
  const response = await GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual((await response.json()).candidates, SAMPLE_CANDIDATES);
});

test("PATCH saves a stage and GET returns the saved value", async () => {
  const response = await patch("1", { stage: "Hired" });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).candidate, {
    ...SAMPLE_CANDIDATES[0],
    stage: "Hired",
  });
  assert.equal((await (await GET()).json()).candidates[0].stage, "Hired");
});

test("the stage is persisted on disk and visible to a separate process", () => {
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import { DatabaseSync } from "node:sqlite"; const db = new DatabaseSync(process.env.DATABASE_PATH); console.log(db.prepare("SELECT stage FROM candidates WHERE id = 1").get().stage); db.close();',
    ],
    { env: process.env, encoding: "utf8" },
  );
  assert.equal(output.trim(), "Hired");
});

test("each supported stage can be saved", async () => {
  for (const stage of ["Sourced", "Screening", "Interview", "Hired"]) {
    const response = await patch("2", { stage });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).candidate.stage, stage);
  }
});

test("invalid and missing stages return 400 and leave the record unchanged", async () => {
  for (const body of [
    { stage: "Rejected" },
    { stage: "hired" },
    { stage: 42 },
    {},
    null,
    [],
    { stage: "' OR 1=1 --" },
  ]) {
    const response = await patch("1", body);
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /Stage must be/);
  }
  assert.equal((await (await GET()).json()).candidates[0].stage, "Hired");
});

test("malformed JSON returns a useful 400 response", async () => {
  const response = await PATCH(
    new Request("http://localhost/api/candidates/1", {
      method: "PATCH",
      body: "{",
    }),
    { params: Promise.resolve({ id: "1" }) },
  );
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /valid JSON/);
});

test("invalid candidate IDs return 400", async () => {
  for (const id of [
    "0",
    "-1",
    "1.5",
    "abc",
    "01",
    "9007199254740992",
    "1 OR 1=1",
  ]) {
    assert.equal((await patch(id, { stage: "Sourced" })).status, 400);
  }
});

test("a missing candidate returns 404", async () => {
  const response = await patch("9999", { stage: "Hired" });
  assert.equal(response.status, 404);
  assert.equal((await response.json()).error, "Candidate not found.");
});

test("repeated reads do not reseed or reset saved stages", async () => {
  const candidates = (await (await GET()).json()).candidates;
  assert.equal(candidates.length, 10);
  assert.equal(candidates[0].stage, "Hired");
  assert.equal(candidates[1].stage, "Hired");
});
