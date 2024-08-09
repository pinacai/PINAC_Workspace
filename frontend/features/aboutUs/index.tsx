import React, { useEffect } from "react";
import { SubPageHeader } from "../header/index";
import styles from "./styles/index.module.css";

const AboutUs: React.FC = () => {

  // ---------------------------------------------------- //
  return (
    <>
      <div className={styles.aboutContainer}>
        <SubPageHeader title="About Us" />
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
                  window.ipcRenderer.send("request-to-backend", {
                    requestType: "open-url-in-browser",
                    url: "https://github.com/pinacai/PINAC_Workspace",
                  })
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
