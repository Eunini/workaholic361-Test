"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ChevronRight,
  Layers2,
  ListFilter,
  Search,
  Users,
  X,
} from "lucide-react";
import { STAGES, type Candidate, type Stage } from "@/lib/candidates";
import { PipelineSummary } from "./pipeline-summary";
import { CandidateTable } from "./candidate-table";

export function TalentDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [pendingIds, setPendingIds] = useState(new Set<number>());
  const [savedId, setSavedId] = useState<number | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCandidates() {
      try {
        const response = await fetch("/api/candidates", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error("Unable to load candidates. Please try again.");
        const data: { candidates: Candidate[] } = await response.json();
        if (!controller.signal.aborted) setCandidates(data.candidates);
      } catch {
        if (!controller.signal.aborted)
          setLoadError(
            "We couldn’t load your candidates. Check your connection and try again.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadCandidates();
    return () => controller.abort();
  }, [reload]);

  async function changeStage(candidate: Candidate, stage: Stage) {
    if (stage === candidate.stage || pendingIds.has(candidate.id)) return;
    setPendingIds((ids) => new Set(ids).add(candidate.id));
    setSaveError(null);
    setNotice("");
    setSavedId(null);
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          typeof data.error === "string" ? data.error : "Please try again.",
        );
      const updated = data.candidate as Candidate;
      setCandidates((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSavedId(candidate.id);
      setNotice(`${candidate.name} moved to ${stage}. Change saved.`);
    } catch (error) {
      setSaveError(
        `Couldn’t update ${candidate.name}. ${error instanceof Error ? error.message : "Please try again."}`,
      );
    } finally {
      setPendingIds((ids) => {
        const next = new Set(ids);
        next.delete(candidate.id);
        return next;
      });
    }
  }

  const search = query.trim().toLocaleLowerCase();
  const visible = candidates.filter(
    (candidate) =>
      (stageFilter === "All" || candidate.stage === stageFilter) &&
      (!search ||
        `${candidate.name} ${candidate.role}`
          .toLocaleLowerCase()
          .includes(search)),
  );
  const filtered = Boolean(search) || stageFilter !== "All";
  function clearFilters() {
    setQuery("");
    setStageFilter("All");
  }

  return (
    <div className="workspace">
      <a className="skip-link" href="#main">
        Skip to candidates
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Workaholic360 home">
          <span className="brand-mark">
            <Layers2 size={24} strokeWidth={1.7} />
          </span>
          <span>
            workaholic<span className="brand-360">360</span>
          </span>
        </Link>
        <div className="workspace-label">
          <span className="workspace-initial">W</span>
          <span>
            Recruitment workspace<small>Candidate tracking</small>
          </span>
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          <a className="nav-active" href="#main" aria-current="page">
            <Users size={18} />
            <span>Talent pipeline</span>
            <ChevronRight size={15} />
          </a>
        </nav>
        {/* <div className="sidebar-bottom">
          <span className="workspace-icon">
            <Layers2 size={17} />
          </span>
          <div>
            Recruitment Workspace
          </div>
        </div> */}
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <span>Talent pipeline</span>
          </div>
          <span className="workspace-badge">Recruitment workspace</span>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <p className="eyebrow">RECRUITMENT</p>
              <h1>
                Talent pipeline<span className="heading-period">.</span>
              </h1>
              <p className="page-description">
                Track candidates and update their hiring stages.
              </p>
            </div>
            <div className="total-candidates">
              <Users size={16} />
              <span>
                {loading ? "–" : candidates.length} candidates in your pipeline
              </span>
            </div>
          </div>

          <PipelineSummary
            candidates={candidates}
            loading={loading || Boolean(loadError)}
            filter={stageFilter}
            onFilter={setStageFilter}
          />

          <section
            className="candidate-panel"
            aria-labelledby="candidates-heading"
          >
            <div className="panel-heading">
              <div>
                <h2 id="candidates-heading">
                  Your candidates{" "}
                  <span>{loading ? "–" : candidates.length}</span>
                </h2>
                <p>Search candidates or filter by stage.</p>
              </div>
              <span className="autosave-note">Changes save automatically</span>
            </div>
            <div className="filter-bar">
              <div className="search-field">
                <Search size={18} aria-hidden="true" />
                <input
                  type="search"
                  aria-label="Search candidates by name or role"
                  placeholder="Search by name or role…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  disabled={loading || Boolean(loadError)}
                />
                {query && (
                  <button
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <div className="filter-actions">
                <div className="stage-filter">
                  <ListFilter size={16} aria-hidden="true" />
                  <select
                    aria-label="Filter by stage"
                    value={stageFilter}
                    disabled={loading || Boolean(loadError)}
                    onChange={(event) =>
                      setStageFilter(event.target.value as Stage | "All")
                    }
                  >
                    <option value="All">All stages</option>
                    {STAGES.map((stage) => (
                      <option key={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                {filtered && (
                  <button className="text-button" onClick={clearFilters}>
                    Reset
                  </button>
                )}
              </div>
            </div>

            {saveError && (
              <div className="error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{saveError}</span>
                <button
                  aria-label="Dismiss error"
                  onClick={() => setSaveError(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {loadError ? (
              <div className="empty-state" role="alert">
                <span className="empty-icon">
                  <AlertCircle size={25} />
                </span>
                <h3>Something didn’t load</h3>
                <p>{loadError}</p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setLoading(true);
                    setLoadError(null);
                    setReload((value) => value + 1);
                  }}
                >
                  Try again
                </button>
              </div>
            ) : (
              <CandidateTable
                candidates={visible}
                loading={loading}
                filtered={filtered}
                pendingIds={pendingIds}
                savedId={savedId}
                onStageChange={changeStage}
                onClearFilters={clearFilters}
              />
            )}
            <div className="table-footer">
              <span aria-live="polite">
                {loading
                  ? "Loading candidates…"
                  : loadError
                    ? "Candidates unavailable"
                    : `Showing ${visible.length} of ${candidates.length} candidates`}
              </span>
            </div>
          </section>
          <p
            className={`save-status ${notice ? "has-notice" : ""}`}
            role="status"
            aria-live="polite"
          >
            {notice}
          </p>
          <footer className="page-footer">
            <span>Workaholic360 · Talent operations</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
