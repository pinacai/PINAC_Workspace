import React from "react";
import { Header } from "../header/index";
import styles from "./styles/index.module.css";

const AboutUs: React.FC = () => {
  return (
    <>
      <div className={styles.aboutContainer}>
        <Header title="About Us" page="about" />
        <div className={styles.down}>
          <div className={styles.aboutCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <span>About Us</span>
              </div>
              <span>
                We are a GitHub organization dedicated to developing AI-powered
                applications that solve practical problems and make people's
                lives easier. Our mission is to increase productivity and save
                time for our users through the innovative use of AI and other
                latest technologies.
              </span>
            </div>
            <div className={styles.aboutBtn}>
              <button
                id={styles.aboutBtn}
                onClick={() =>
                  window.ipcRenderer.send(
                    "open-external-link",
                    "https://github.com/pinacai/PINAC_Workspace"
                  )
                }
              >
                <strong>Visit Our GitHub Repo</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
