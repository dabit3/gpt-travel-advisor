'use client'
import React, { useEffect, useRef, useState } from "react";

import styles from './page.module.css'
import Choice from "../components/steps/choice";
import Hackathon from "../components/steps/hackathon";
import Loading from "../components/steps/loading";
import Bounty from "../components/steps/bounty";

export default function Home() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [choice, setChoice] = useState();
  const messageRef = useRef(null);
  
  const [hackatonData, setHackatonData] = useState({
    theme: "",
    startDate: "",
    endDate: "",
    additionalInformation: ""
  });

  const [bountyData, setBountyData] = useState({
    task: "",
    description: ""
  });

  function resetTimer() {
    setTyping(true);

    if (messageRef.current) {
      (messageRef.current as any).style.animationName = "none";

      requestAnimationFrame(() => {
        setTimeout(() => {
          (messageRef.current as any).style.animationName = "";
        }, 0);
      });
    }

    setTimer(setTimeout(() => {
      setTyping(false);
      clearTimeout(timer);
    }, 2000));
  }

  function nextStep() {
    setStep(step => step + 1);
    resetTimer();
  }

  function previousStep() {
    setStep(step => step -1);
  }

  function handleChoiceChanges(choice) {
    setChoice(choice);
    nextStep();
  }

  const choiceColor = choice === "hackathon" ? "var(--hackathonColor)" : "var(--bountyColor)";
  const steps = [
    {
      message: "Hello there! My name is Maya and I'm here to help you. What do you wish to create?",
      component: <Choice setChoice={handleChoiceChanges} />
    },
    {
      hackathon: {
        message: "Great! Please tell me more about your hackathon.",
        component: <Hackathon choiceColor={choiceColor} setHackatonData={setHackatonData} hackatonData={hackatonData} />
      },
      bounty: {
        message: "Great! Please tell me more about your bounty.",
        component: <Bounty choiceColor={choiceColor} setBountyData={setBountyData} bountyData={bountyData} />
      }
    },
    {
      hackathon: {
        message: `I'm creating the best hackathon for you, it can take a few seconds.`,
        component: <Loading />
      }
    }
  ];

  function getStep() {
    if (step === 0) return steps[step];
    else if (choice) return steps[step][choice];

    return undefined;
  }

  function validateHackatonData() {
    const { theme, startDate, endDate, additionalInformation } = hackatonData;

    return theme !== "" && startDate !== "" && endDate !== "" && additionalInformation !== "";
  }

  function validateBountyData() {
    const { task, description } = bountyData;

    return task !== "" && description !== "";
  }

  function isSubmitDisabled() {
    if (choice === "hackathon")
      return !validateHackatonData();

    return !validateBountyData();
  }

  function handleSubmit() {
    nextStep();

    console.log({
      hackatonData,
      bountyData
    });
  }

  useEffect(() => {
    resetTimer();
  }, []);

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img src="/maya-avatar.png" alt="Maya avatar" />
          <span ref={messageRef}>
            {getStep()?.message}
          </span>
        </div>

        { !typing && 
          <div className={styles.subContainer}>
            <div className={styles.componentContainer}>
              {getStep()?.component}
            </div>

            { step === 1 &&
              <div className={styles.btnsContainer}>
                <button className="button" onClick={previousStep}>
                  Back
                </button>

                <button 
                  className="button" 
                  style={{ backgroundColor: choiceColor }}
                  disabled={isSubmitDisabled()}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            }
          </div>
        }
      </div>
    </main>
  )
}