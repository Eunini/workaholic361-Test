import styles from "./avatar.module.css";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function Avatar({ name, seed }: { name: string; seed: number }) {
  return (
    <span className={styles.avatar} data-tone={seed % 5} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}
