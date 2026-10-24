import { Search, X } from "lucide-react";
import { STAGES, type Stage } from "@/lib/candidates";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import styles from "./filter-bar.module.css";

type Props = {
  query: string;
  stage: Stage | "All";
  disabled: boolean;
  onQueryChange: (query: string) => void;
  onStageChange: (stage: Stage | "All") => void;
  onReset: () => void;
};

export function FilterBar({
  query,
  stage,
  disabled,
  onQueryChange,
  onStageChange,
  onReset,
}: Props) {
  const isFiltered = query !== "" || stage !== "All";

  return (
    <div className={styles.bar}>
      <div className={styles.search}>
        <Search size={16} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={styles.input}
          placeholder="Search name or role"
          aria-label="Search candidates by name or role"
          value={query}
          disabled={disabled}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onClick={() => onQueryChange("")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <Select
        aria-label="Filter by stage"
        value={stage}
        disabled={disabled}
        onChange={(event) => onStageChange(event.target.value as Stage | "All")}
      >
        <option value="All">All stages</option>
        {STAGES.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </Select>

      {isFiltered && (
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  );
}
