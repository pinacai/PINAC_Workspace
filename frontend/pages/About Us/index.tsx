import React, { useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import "./style/index.css";

export const AboutPage: React.FC = () => {
  // For smooth applying of current theme
  useEffect(() => {
    const body = document.body;
    const preferredTheme = localStorage.getItem("preferred-theme");
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    // Remove all theme classes first
    body.classList.remove(
      "Dawn_n_Dusk-light",
      "Dawn_n_Dusk-dark",
      "Cyber_Tech_01-light",
      "Cyber_Tech_01-dark",
      "Aesthetics_Unbound-light",
      "Aesthetics_Unbound-dark"
    );
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`);
  });

  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="About Us" />
        <div className="about-container">
          <div className="about-card">
            <div className="content">
              <div className="header">
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
            <div className="aboutBtn">
              <button
                id="aboutBtn"
                onClick={() =>
                  window.ipcRenderer.send("request-to-backend", {
                    request_type: "open-url-in-browser",
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
