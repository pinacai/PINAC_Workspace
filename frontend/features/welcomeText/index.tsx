import { useEffect, useState } from "react";
import styles from "./styles/index.module.css"

export const WelcomeText = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [currentHour, setCurrentHour] = useState<number>(0);

  //
  const getGreeting = (currentHourTime: number, firstName: string) => {
    let greetingMessage = "Good Morning";
    if (currentHourTime >= 12 && currentHourTime < 17) {
      greetingMessage = "Good Afternoon";
    } else if (currentHourTime >= 17) {
      greetingMessage = "Good Evening";
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
      window.ipcRenderer.send("request-to-backend", {
        request_type: "give-user-info",
      });
      window.ipcRenderer.once("backend-response", (_, response) => {
        setFirstName(response.first_name);
      });
    };

    const getLocalHour = () => {
      const currTime = new Date();
      const localHour = currTime.getHours();
      setCurrentHour(localHour);
    }

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
