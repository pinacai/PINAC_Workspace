import { useEffect, useState } from "react";
import styles from "./styles/index.module.css";

export const WelcomeText = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  const getGreeting = () => {
    setGreeting(`Hey there, ${firstName}!`);
  };

  useEffect(() => {
    const fetchUserInfo = () => {
      window.ipcRenderer.send("give-user-info");
      window.ipcRenderer.once("backend-response", (_, response) => {
        setFirstName(response.displayName.split(" ")[0]);
      });
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    getGreeting();
  });

  // ----------------------------------- //
  return (
      <div className={styles.welcomeText}>
        {greeting}
      </div>
  );
};
