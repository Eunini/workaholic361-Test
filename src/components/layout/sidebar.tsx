import Link from "next/link";
import { Users } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import styles from "./sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Logo />
        Workaholic360
      </Link>

      <nav aria-label="Main navigation">
        <p className={styles.label}>Recruitment</p>
        <a href="#main" className={styles.link} aria-current="page">
          <Users size={18} />
          Talent pipeline
        </a>
      </nav>

      <div className={styles.workspace}>
        <span className={styles.initial}>W</span>
        <div>
          <strong>Recruitment</strong>
          <span>Workspace</span>
        </div>
      </div>
    </aside>
  );
}
