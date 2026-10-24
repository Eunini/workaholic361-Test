"use client";

import { useState } from "react";
import { CircleAlert, CloudCheck, SearchX, Users } from "lucide-react";
import type { Candidate, Stage } from "@/lib/candidates";
import { useCandidates } from "@/hooks/use-candidates";
import { useToast } from "@/components/toast/toast-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StageCards } from "./stage-cards";
import { FilterBar } from "./filter-bar";
import { CandidateTable, TableSkeleton } from "./candidate-table";
import styles from "./talent-dashboard.module.css";

function filterCandidates(
  candidates: Candidate[],
  query: string,
  stage: Stage | "All",
) {
  const search = query.trim().toLowerCase();
  return candidates.filter(
    (candidate) =>
      (stage === "All" || candidate.stage === stage) &&
      `${candidate.name} ${candidate.role}`.toLowerCase().includes(search),
  );
}

export function TalentDashboard() {
  const { candidates, status, savingIds, retry, updateStage } = useCandidates();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");

  const visible = filterCandidates(candidates, query, stageFilter);
  const ready = status === "ready";

  function resetFilters() {
    setQuery("");
    setStageFilter("All");
  }

  async function changeStage(candidate: Candidate, stage: Stage) {
    try {
      await updateStage(candidate.id, stage);
      toast.success("Stage updated", `${candidate.name} moved to ${stage}.`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "";
      toast.error(
        "Couldn’t update stage",
        `${candidate.name} is still in ${candidate.stage}. ${reason}`,
      );
    }
  }

  function renderContent() {
    if (status === "loading") return <TableSkeleton />;

    if (status === "error")
      return (
        <EmptyState
          icon={CircleAlert}
          title="Couldn’t load candidates"
          description="Check your connection and try again."
          action={<Button onClick={retry}>Try again</Button>}
        />
      );

    if (candidates.length === 0)
      return (
        <EmptyState
          icon={Users}
          title="No candidates yet"
          description="Candidates will appear here when they’re added."
        />
      );

    if (visible.length === 0)
      return (
        <EmptyState
          icon={SearchX}
          title="No matching candidates"
          description="Try another name, role or stage."
          action={<Button onClick={resetFilters}>Clear filters</Button>}
        />
      );

    return (
      <CandidateTable
        candidates={visible}
        savingIds={savingIds}
        onStageChange={changeStage}
      />
    );
  }

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Talent pipeline</h1>
          <p className={styles.subtitle}>
            Track candidates and move them through each hiring stage.
          </p>
        </div>
        <p className={styles.autosave}>
          <CloudCheck size={16} aria-hidden="true" />
          Changes save automatically
        </p>
      </header>

      <StageCards
        candidates={candidates}
        selected={stageFilter}
        disabled={!ready}
        onSelect={setStageFilter}
      />

      <section className={styles.panel} aria-labelledby="candidates-heading">
        <div className={styles.panelHeader}>
          <h2 id="candidates-heading" className={styles.panelTitle}>
            Candidates
            <span className={styles.badge}>
              {ready ? candidates.length : "–"}
            </span>
          </h2>
          <FilterBar
            query={query}
            stage={stageFilter}
            disabled={!ready}
            onQueryChange={setQuery}
            onStageChange={setStageFilter}
            onReset={resetFilters}
          />
        </div>

        {renderContent()}

        {ready && (
          <p className={styles.footer} aria-live="polite">
            Showing {visible.length} of {candidates.length} candidates
          </p>
        )}
      </section>
    </>
  );
}
