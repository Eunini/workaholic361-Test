import type { LucideIcon } from "lucide-react";
import styles from "./empty-state.module.css";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon}>
        <Icon size={22} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action}
    </div>
  );
}
