import { useEffect, useState } from "react";
import styles from "./styles/index.module.css";

export const WelcomeText = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [currentHour, setCurrentHour] = useState<number>(0);

  //
  const getGreeting = (currentHourTime: number, firstName: string) => {
    let greetingMessage = "";

    if (currentHourTime >= 3 && currentHourTime < 5) {
      greetingMessage = "Happy Early Morning";
    } else if (currentHourTime >= 5 && currentHourTime < 11) {
      greetingMessage = "Good Morning";
    } else if (currentHourTime >= 11 && currentHourTime < 17) {
      greetingMessage = "Good Afternoon";
    } else if (currentHourTime >= 17 && currentHourTime < 20) {
      greetingMessage = "Good Evening";
    } else if (currentHourTime >= 20 && currentHourTime < 24) {
      greetingMessage = "Happy Night";
    } else {
      // currentHourTime >= 0 && currentHourTime < 3
      greetingMessage = "Happy Late Night";
    }

    greetingMessage += firstName
      ? ` ${firstName}, \n how can I help you?`
      : ", how can I assist you?";
    setGreeting(greetingMessage);
  };

  //
  //
  useEffect(() => {
    const fetchUserInfo = () => {
      window.ipcRenderer.send("give-user-info");
      window.ipcRenderer.once("backend-response", (_, response) => {
        setFirstName(response.displayName);
      });
    };

    const getLocalHour = () => {
      const currTime = new Date();
      const localHour = currTime.getHours();
      setCurrentHour(localHour);
    };

    fetchUserInfo();
    getLocalHour();
  }, []);

  //
  //
  useEffect(() => {
    getGreeting(currentHour, firstName);
  }, [currentHour, firstName]);

  // ----------------------------------- //
  return (
    <div className={styles.welcomeTextRow}>
      <div className={styles.welcomeText}>
        <>{greeting}</>
        <br />
      </div>
    </div>
  );
};
