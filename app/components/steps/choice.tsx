import styles from "./steps.module.css";

export default function Choice({
  setChoice
}) {
  function handleClick(choice) {
    return () => setChoice(choice);
  }

  return(
    <div className={styles.choiceContainer}>
      <div onClick={handleClick("hackathon")} role="button">
        <img src="/hackathon.png" alt="Hackathon" />
      </div>
      
      <div onClick={handleClick("bounty")} role="button">
        <img src="/bounty.png" alt="Bounty" />
      </div>
    </div>
  );
}