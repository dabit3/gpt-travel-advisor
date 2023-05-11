import styles from "./steps.module.css";

export default function Hackathon({
  choiceColor,
  hackatonData,
  setHackatonData
}) {
  const inputStyle= { color: choiceColor };

  function handleChange(field) {
    return (e) => setHackatonData(old => ({
      ...old,
      [field]: e.target.value
    }));
  }

  return(
    <div className={styles.containerColumn}>
      <div className={styles.formGroup}>
        <label htmlFor="theme">What is the hackathon theme?</label>
        <input type="text" name="theme" id="theme" style={inputStyle} value={hackatonData.theme} onChange={handleChange("theme")} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="startDate">What is the intendend start date?</label>
        <input type="date" name="startDate" id="startDate" style={inputStyle} value={hackatonData.startDate} onChange={handleChange("startDate")} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="endDate">What is the intendend end date?</label>
        <input type="date" name="endDate" id="endDate" style={inputStyle} value={hackatonData.endDate} onChange={handleChange("endDate")} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="additionalInformation">Additional information</label>
        <textarea 
          name="additionalInformation"
          id="additionalInformation"
          rows={4}
          cols={34}
          style={inputStyle}
          value={hackatonData.additionalInformation}
          onChange={handleChange("additionalInformation")}
        />
      </div>
    </div>
  );
}