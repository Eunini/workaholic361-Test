import { Sidebar } from "./sidebar";
import styles from "./app-shell.module.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sidebar />
      <main id="main" tabIndex={-1} className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
    </>
  );
}
