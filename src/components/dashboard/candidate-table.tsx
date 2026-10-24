import { LoaderCircle } from "lucide-react";
import { STAGES, type Candidate, type Stage } from "@/lib/candidates";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import styles from "./candidate-table.module.css";

type Props = {
  candidates: Candidate[];
  savingIds: number[];
  onStageChange: (candidate: Candidate, stage: Stage) => void;
};

export function CandidateTable({
  candidates,
  savingIds,
  onStageChange,
}: Props) {
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <caption className="sr-only">
          Candidates and their current stage. Changes save automatically.
        </caption>
        <thead>
          <tr>
            <th scope="col">Candidate</th>
            <th scope="col">Role</th>
            <th scope="col">Stage</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              saving={savingIds.includes(candidate.id)}
              onStageChange={(stage) => onStageChange(candidate, stage)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type RowProps = {
  candidate: Candidate;
  saving: boolean;
  onStageChange: (stage: Stage) => void;
};

function CandidateRow({ candidate, saving, onStageChange }: RowProps) {
  return (
    <tr aria-busy={saving}>
      <td>
        <div className={styles.person}>
          <Avatar name={candidate.name} seed={candidate.id} />
          <div className={styles.personText}>
            <span className={styles.name}>{candidate.name}</span>
            <span className={styles.email}>{candidate.email}</span>
          </div>
        </div>
      </td>
      <td className={styles.role}>{candidate.role}</td>
      <td data-stage={candidate.stage}>
        <div className={styles.stage}>
          <Select
            variant="pill"
            aria-label={`Stage for ${candidate.name}`}
            value={candidate.stage}
            disabled={saving}
            onChange={(event) => onStageChange(event.target.value as Stage)}
          >
            {STAGES.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </Select>
          {saving && (
            <LoaderCircle size={16} className="spin" aria-label="Saving" />
          )}
        </div>
      </td>
    </tr>
  );
}

export function TableSkeleton() {
  return (
    <div
      className={styles.skeleton}
      role="status"
      aria-label="Loading candidates"
    >
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className={styles.skeletonRow}>
          <span className={styles.skeletonAvatar} />
          <span className={styles.skeletonLine} />
        </div>
      ))}
    </div>
  );
}
