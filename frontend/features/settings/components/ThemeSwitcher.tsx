import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import styles from "../styles/ThemeSwitcher.module.css";

// Icons
import Cyber_Tech_o1_darkPreview from "/img/Cyber_Tech_01_darkPreview.png";
import Dawn_n_Dusk_darkPreview from "/img/Dawn_n_Dusk_darkPreview.png";
import Aesthetics_Unbound_darkPreview from "/img/Aesthetic_Unbound_darkPreview.png";

export const ThemeSwitcher: React.FC = () => {
  const [Dawn_n_Dusk, setDawn_n_Dusk] = useState<boolean>(false);
  const [Cyber_Tech_01, setCyber_Tech_01] = useState<boolean>(false);
  const [Aesthetics_Unbound, setAesthetics_Unbound] = useState<boolean>(false);

  const changeToDawn_n_Dusk = () => {
    setDawn_n_Dusk(!Dawn_n_Dusk);
    if (!Dawn_n_Dusk) {
      setCyber_Tech_01(false);
      setAesthetics_Unbound(false);
      localStorage.setItem("preferred-theme-pair", "Dawn_n_Dusk");
    }
  };

  const changeToCyber_Tech_01 = () => {
    setCyber_Tech_01(!Cyber_Tech_01);
    if (!Cyber_Tech_01) {
      setDawn_n_Dusk(false);
      setAesthetics_Unbound(false);
      localStorage.setItem("preferred-theme-pair", "Cyber_Tech_01");
    }
  };

  const changeToAesthetics_Unbound = () => {
    setAesthetics_Unbound(!Aesthetics_Unbound);
    if (!Aesthetics_Unbound) {
      setDawn_n_Dusk(false);
      setCyber_Tech_01(false);
      localStorage.setItem("preferred-theme-pair", "Aesthetics_Unbound");
    }
  };

  //
  useEffect(() => {
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    setDawn_n_Dusk(preferredThemePair === "Dawn_n_Dusk");
    setCyber_Tech_01(preferredThemePair === "Cyber_Tech_01");
    setAesthetics_Unbound(preferredThemePair === "Aesthetics_Unbound");
  }, []);

  //
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
    body.classList.add(`${preferredThemePair}-${preferredTheme}`);
  });

  // ----------------------------------------------------------- //
  return (
    <div className={styles.themeCardContainer}>
      {/* Theme 1 */}
      <Card
        title="Dawn & Dusk"
        cardImage={Dawn_n_Dusk_darkPreview}
        checkedFunc={Dawn_n_Dusk}
        onChangeFunc={changeToDawn_n_Dusk}
      />

      {/* Theme 2 */}
      <Card
        title="Cyber Tech 01"
        cardImage={Cyber_Tech_o1_darkPreview}
        checkedFunc={Cyber_Tech_01}
        onChangeFunc={changeToCyber_Tech_01}
      />

      {/* Theme 3 */}
      <Card
        title="Aesthetics Unbound"
        cardImage={Aesthetics_Unbound_darkPreview}
        checkedFunc={Aesthetics_Unbound}
        onChangeFunc={changeToAesthetics_Unbound}
      />
    </div>
  );
};
