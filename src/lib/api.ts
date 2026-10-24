import type { Candidate, Stage } from "./candidates";

export async function fetchCandidates(signal?: AbortSignal) {
  const response = await fetch("/api/candidates", {
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error("Unable to load candidates.");
  const data: { candidates: Candidate[] } = await response.json();
  return data.candidates;
}

export async function saveStage(id: number, stage: Stage) {
  const response = await fetch(`/api/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Please try again.");
  return data.candidate as Candidate;
}
