import { ChevronDown } from "lucide-react";
import styles from "./select.module.css";

type Props = React.ComponentProps<"select"> & {
  variant?: "default" | "pill";
};

export function Select({ variant = "default", children, ...props }: Props) {
  return (
    <span className={`${styles.wrapper} ${styles[variant]}`}>
      <select {...props} className={styles.select}>
        {children}
      </select>
      <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
    </span>
  );
}
