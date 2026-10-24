import {
  ArrowRight,
  CheckCheck,
  MessagesSquare,
  ScanLine,
  Sprout,
} from "lucide-react";
import { STAGES, type Candidate, type Stage } from "@/lib/candidates";

const STAGE_DETAILS = {
  Sourced: { icon: Sprout, description: "Not yet reviewed" },
  Screening: { icon: ScanLine, description: "Initial review" },
  Interview: { icon: MessagesSquare, description: "Interview in progress" },
  Hired: { icon: CheckCheck, description: "Hiring complete" },
};

type Props = {
  candidates: Candidate[];
  loading: boolean;
  filter: Stage | "All";
  onFilter: (stage: Stage | "All") => void;
};

export function PipelineSummary({
  candidates,
  loading,
  filter,
  onFilter,
}: Props) {
  return (
    <section className="pipeline-summary" aria-label="Filter by pipeline stage">
      {STAGES.map((stage) => {
        const { icon: Icon, description } = STAGE_DETAILS[stage];
        const count = candidates.filter(
          (candidate) => candidate.stage === stage,
        ).length;
        return (
          <button
            key={stage}
            className={`stage-card ${stage.toLowerCase()}`}
            aria-pressed={filter === stage}
            disabled={loading}
            onClick={() => onFilter(filter === stage ? "All" : stage)}
          >
            <span className="stage-card-top">
              <span className="stage-icon">
                <Icon size={18} />
              </span>
              <span>{stage}</span>
              <ArrowRight size={16} className="stage-arrow" />
            </span>
            <span className="stage-count">{loading ? "–" : count}</span>
            <span className="stage-description">{description}</span>
          </button>
        );
      })}
    </section>
  );
}
