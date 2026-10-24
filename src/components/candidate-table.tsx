import { Check, ChevronDown, LoaderCircle, SearchX, Users } from "lucide-react";
import { STAGES, type Candidate, type Stage } from "@/lib/candidates";

type Props = {
  candidates: Candidate[];
  loading: boolean;
  filtered: boolean;
  pendingIds: Set<number>;
  savedId: number | null;
  onStageChange: (candidate: Candidate, stage: Stage) => void;
  onClearFilters: () => void;
};

export function CandidateTable({
  candidates,
  loading,
  filtered,
  pendingIds,
  savedId,
  onStageChange,
  onClearFilters,
}: Props) {
  if (loading)
    return (
      <div className="table-loading" role="status">
        <LoaderCircle className="spin" size={22} />
        <span>Loading your candidates…</span>
      </div>
    );

  if (candidates.length === 0)
    return (
      <div className="empty-state">
        <span className="empty-icon">
          {filtered ? <SearchX size={25} /> : <Users size={25} />}
        </span>
        <h3>{filtered ? "No candidates found" : "No candidates yet"}</h3>
        <p>
          {filtered
            ? "Try another name, role, or pipeline stage."
            : "Candidates will appear here when they’re added."}
        </p>
        {filtered && (
          <button className="secondary-button" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
      </div>
    );

  return (
    <div className="table-scroll">
      <table>
        <caption className="sr-only">
          Candidates and their current hiring stage. Change a stage using its
          dropdown; changes save automatically.
        </caption>
        <thead>
          <tr>
            <th scope="col">Candidate</th>
            <th scope="col">Role</th>
            <th scope="col">Current stage</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => {
            const pending = pendingIds.has(candidate.id);
            const initials = candidate.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("");
            return (
              <tr key={candidate.id} aria-busy={pending}>
                <td>
                  <div className="candidate-identity">
                    <span
                      className={`avatar avatar-${candidate.id % 5}`}
                      aria-hidden="true"
                    >
                      {initials}
                    </span>
                    <div>
                      <span className="candidate-name">{candidate.name}</span>
                      <span className="candidate-email">{candidate.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="candidate-role">{candidate.role}</span>
                </td>
                <td>
                  <div className="stage-cell">
                    <div
                      className={`stage-select ${candidate.stage.toLowerCase()}`}
                    >
                      <span className="stage-dot" aria-hidden="true" />
                      <select
                        aria-label={`Stage for ${candidate.name}`}
                        value={candidate.stage}
                        disabled={pending}
                        onChange={(event) =>
                          onStageChange(candidate, event.target.value as Stage)
                        }
                      >
                        {STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="select-chevron"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="save-indicator">
                      {pending ? (
                        <LoaderCircle
                          size={16}
                          className="spin"
                          aria-label="Saving"
                        />
                      ) : savedId === candidate.id ? (
                        <Check size={16} aria-label="Saved" />
                      ) : null}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
