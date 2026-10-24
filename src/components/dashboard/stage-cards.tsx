import { STAGES, type Candidate, type Stage } from "@/lib/candidates";
import { STAGE_INFO } from "./stage-info";
import styles from "./stage-cards.module.css";

type Props = {
  candidates: Candidate[];
  selected: Stage | "All";
  disabled: boolean;
  onSelect: (stage: Stage | "All") => void;
};

export function StageCards({
  candidates,
  selected,
  disabled,
  onSelect,
}: Props) {
  return (
    <section className={styles.grid} aria-label="Filter by stage">
      {STAGES.map((stage) => {
        const { icon: Icon, hint } = STAGE_INFO[stage];
        const count = candidates.filter((c) => c.stage === stage).length;
        const share = candidates.length ? (count / candidates.length) * 100 : 0;
        const isSelected = selected === stage;

        return (
          <button
            key={stage}
            type="button"
            className={styles.card}
            data-stage={stage}
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => onSelect(isSelected ? "All" : stage)}
          >
            <span className={styles.top}>
              {stage}
              <span className={styles.icon}>
                <Icon size={18} />
              </span>
            </span>
            <span className={styles.count}>{disabled ? "–" : count}</span>
            <span className={styles.bar}>
              <span className={styles.fill} style={{ width: `${share}%` }} />
            </span>
            <span className={styles.hint}>{hint}</span>
          </button>
        );
      })}
    </section>
  );
}
