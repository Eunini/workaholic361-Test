"use client";

import { useEffect, useState } from "react";
import { fetchCandidates, saveStage } from "@/lib/api";
import type { Candidate, Stage } from "@/lib/candidates";

type Status = "loading" | "error" | "ready";

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchCandidates(controller.signal)
      .then((list) => {
        setCandidates(list);
        setStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setStatus("loading");
    setAttempt((count) => count + 1);
  }

  async function updateStage(id: number, stage: Stage) {
    setSavingIds((ids) => [...ids, id]);
    try {
      const updated = await saveStage(id, stage);
      setCandidates((list) =>
        list.map((candidate) => (candidate.id === id ? updated : candidate)),
      );
    } finally {
      setSavingIds((ids) => ids.filter((savingId) => savingId !== id));
    }
  }

  return { candidates, status, savingIds, retry, updateStage };
}
