import { useEffect, useState } from "react";
import styles from "../style/WelcomeText.module.css"

const GEOLOCATION_API_URL = "http://ip-api.com/json/";
const TIME_API_URL = "http://worldtimeapi.org/api/timezone/";

interface GeolocationData {
  timezone: string;
}

interface TimeData {
  datetime: string;
}

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

    const fetchGeolocationAndLocalTime = async () => {
      try {
        const geoData = await fetchGeolocation();
        const { timezone } = geoData;
        const timeData = await fetchLocalTime(timezone);
        const localTime = new Date(timeData.datetime);
        const currentHour = localTime.getHours();
        setCurrentHour(currentHour);
      } catch (err) {
        console.log("Failed to load greeting message.");
        console.error(err);
      }
    };

    const fetchGeolocation = async (): Promise<GeolocationData> => {
      const response = await fetch(GEOLOCATION_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch geolocation data");
      }
      return response.json();
    };

    const fetchLocalTime = async (timezone: string): Promise<TimeData> => {
      const response = await fetch(`${TIME_API_URL}${timezone}`);
      if (!response.ok) {
        throw new Error("Failed to fetch local time");
      }
      return response.json();
    };

    fetchUserInfo();
    fetchGeolocationAndLocalTime();
  }, []);

  //
  //
  useEffect(() => {
    getGreeting(currentHour, firstName);
  }, [currentHour, firstName]);

  // ----------------------------------- //
  return (
    <div className={styles.welcome_text_row}>
      <div className={styles.welcome_text}>
        <>{greeting}</>
        <br />
      </div>
    </div>
  );
};
