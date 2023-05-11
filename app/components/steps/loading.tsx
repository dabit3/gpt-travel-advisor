import styles from "./steps.module.css";

export default function Loading() {
  return(
    <div className={styles.containerColumn}>
      <div className={styles.loaderContainer}>
        <span className={styles.loader}></span>
      </div>
    </div>
  );
}