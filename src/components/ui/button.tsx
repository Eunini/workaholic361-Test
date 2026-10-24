import styles from "./button.module.css";

type Props = React.ComponentProps<"button"> & {
  variant?: "secondary" | "ghost";
};

export function Button({ variant = "secondary", ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={`${styles.button} ${styles[variant]}`}
    />
  );
}
