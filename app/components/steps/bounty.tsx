import styles from "./steps.module.css";

export default function Bounty({
  choiceColor,
  bountyData,
  setBountyData
}) {
  const inputStyle= { color: choiceColor };

  function handleChange(field) {
    return (e) => setBountyData(old => ({
      ...old,
      [field]: e.target.value
    }));
  }

  return(
    <div className={styles.containerColumn}>
      <div className={styles.formGroup}>
        <label htmlFor="task">What task do you want to solve?</label>
        <input type="text" name="task" id="task" style={inputStyle} value={bountyData.task} onChange={handleChange("task")} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Describe the task in more detail</label>
        <textarea 
          name="description"
          id="description"
          rows={4}
          cols={34}
          style={inputStyle}
          value={bountyData.description}
          onChange={handleChange("description")}
        />
      </div>
    </div>
  );
}