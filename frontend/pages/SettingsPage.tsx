import "./style/SettingsPage.css";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { DropdownMenu } from "../components/DropdownMenu";

// Icons
import Cyber_Tech_o1_darkPreview from "../assets/img/Cyber_Tech_01_darkPreview.png";
import Dawn_n_Dusk_darkPreview from "../assets/img/Dawn_n_Dusk_darkPreview.png";

export const SettingsPage: React.FC = () => {
  const [Dawn_n_Dusk, setDawn_n_Dusk] = useState<boolean>(false);
  const [Cyber_Tech_01, setCyber_Tech_01] = useState<boolean>(false);

  const card = (
    title: string,
    cardImage: string,
    checkedFunc: boolean,
    onChangeFunc: () => void
  ) => {
    return (
      <div className="themeCard">
        <img src={cardImage} alt="Cyber Tech 01 Preview" />
        <div className="themeCard-desc">
          <label className="check-wrapper">
            <input
              type="checkbox"
              checked={checkedFunc}
              onChange={onChangeFunc}
            />
            <div className="checkmark"></div>
          </label>
          <span>{title}</span>
        </div>
      </div>
    );
  };

  // Function to select the Dawn_n_Dusk theme
  const changeToDawn_n_Dusk = () => {
    setDawn_n_Dusk(!Dawn_n_Dusk);
    if (!Dawn_n_Dusk) {
      setCyber_Tech_01(false);
      localStorage.setItem("preferred-theme-pair", "Dawn_n_Dusk");
    }
  };

  // Function to select the Cyber_Tech_01 theme
  const changeToCyber_Tech_01 = () => {
    setCyber_Tech_01(!Cyber_Tech_01);
    if (!Cyber_Tech_01) {
      setDawn_n_Dusk(false);
      localStorage.setItem("preferred-theme-pair", "Cyber_Tech_01");
    }
  };

  // Set the theme selection based on the value stored in local storage
  useEffect(() => {
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    setDawn_n_Dusk(preferredThemePair === "Dawn_n_Dusk");
    setCyber_Tech_01(preferredThemePair === "Cyber_Tech_01");
  }, []);

  //
  // Updates the body's classList with the selected
  // theme pair and the user's preferred light/dark mode
  useEffect(() => {
    const body = document.body;
    const preferredTheme = localStorage.getItem("preferred-theme");
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    // Remove all theme classes first
    body.classList.remove(
      "Dawn_n_Dusk-light",
      "Dawn_n_Dusk-dark",
      "Cyber_Tech_01-light",
      "Cyber_Tech_01-dark"
    );
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`);
  });

  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="Settings" />
        <div className="setting-container">
          {/* ------------------- */}
          {/* Section 1 ( Theme ) */}
          <div className="section">
            <div className="section-title">
              <span>AI Model</span>
            </div>
            <DropdownMenu
              optionList={[
                "ChatGPT-3.5 turbo",
                "Gemini 1.5 Pro",
                "Gemini 1.0 Pro",
                "Gemini Flash 1.5",
                // "Gemma 2B"
              ]}
              defaultOption="Gemini Flash 1.5"
            />
          </div>

          {/* Section 2 ( Theme ) */}
          <div className="section">
            <div className="section-title">
              <span>Theme</span>
            </div>
            <div className="themeCard-container">
              {/* Theme 1 */}
              {card(
                "Dawn & Dusk",
                Dawn_n_Dusk_darkPreview,
                Dawn_n_Dusk,
                changeToDawn_n_Dusk
              )}

              {/* Theme 2 */}
              {card(
                "Cyber Tech 01",
                Cyber_Tech_o1_darkPreview,
                Cyber_Tech_01,
                changeToCyber_Tech_01
              )}

              {/* Theme 3 */}
              <div className="themeCard">
                {/* Adding temporary style for this card */}
                <div
                  className="themeCard-desc"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>Coming soon...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
