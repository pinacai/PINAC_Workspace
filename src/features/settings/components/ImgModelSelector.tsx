import React, { useState, useContext, useEffect } from "react";
import { Card } from "./Card";
import { ModelSettingsContext } from "../../../context/ModelSettings";
import styles from "../styles/ThemeSwitcher.module.css";

// Card Images
import Flux_1_dev_Preview from "/img/Flux.1 dev.webp";
import Stable_Diffusion_Preview from "/img/Stable Diffusion.webp";
import Midjourney_Preview from "/img/Midjourney.png";
import DreamShaper_Preview from "/img/DreamShaper.png";

export const ImgModelSelector: React.FC = () => {
  const modelContext = useContext(ModelSettingsContext);
  const [Flux_1_Dev, setFlux_1_Dev] = useState<boolean>(false);
  const [Stable_Diffusion, setStable_Diffusion] = useState<boolean>(false);
  const [Midjourney, setMidjourney] = useState<boolean>(false);
  const [DreamShaper, setDreamShaper] = useState<boolean>(false);

  const changeToFlux_1_Dev = () => {
    setFlux_1_Dev(!Flux_1_Dev);
    if (!Flux_1_Dev) {
      setStable_Diffusion(false);
      setMidjourney(false);
      setDreamShaper(false);
      modelContext?.setImgModelName("FLUX.1 Dev");
    }
  };

  const changeToStable_Diffusion = () => {
    setStable_Diffusion(!Stable_Diffusion);
    if (!Stable_Diffusion) {
      setFlux_1_Dev(false);
      setMidjourney(false);
      setDreamShaper(false);
      modelContext?.setImgModelName("Stable Diffusion");
    }
  };

  const changeToMidjourney = () => {
    setMidjourney(!Midjourney);
    if (!Midjourney) {
      setFlux_1_Dev(false);
      setStable_Diffusion(false);
      setDreamShaper(false);
      modelContext?.setImgModelName("Midjourney");
    }
  };

  const changeToDreamShaper = () => {
    setDreamShaper(!DreamShaper);
    if (!DreamShaper) {
      setFlux_1_Dev(false);
      setStable_Diffusion(false);
      setMidjourney(false);
      modelContext?.setImgModelName("DreamShaper");
    }
  };

  //
  useEffect(() => {
    setFlux_1_Dev(modelContext?.imgModelName === "FLUX.1 Dev");
    setStable_Diffusion(modelContext?.imgModelName === "Stable Diffusion");
    setMidjourney(modelContext?.imgModelName === "Midjourney");
    setDreamShaper(modelContext?.imgModelName === "DreamShaper");
  }, [modelContext?.imgModelName]);

  // ----------------------------------------------------------- //
  return (
    <div className={styles.themeCardContainer}>
      {/* Img Model 1 */}
      <Card
        title="FLUX.1 Dev"
        cardImage={Flux_1_dev_Preview}
        checkedFunc={Flux_1_Dev}
        onChangeFunc={changeToFlux_1_Dev}
      />

      {/* Img Model 2 */}
      <Card
        title="Stable Diffusion"
        cardImage={Stable_Diffusion_Preview}
        checkedFunc={Stable_Diffusion}
        onChangeFunc={changeToStable_Diffusion}
      />

      {/* Img Model 3 */}
      <Card
        title="Midjourney"
        cardImage={Midjourney_Preview}
        checkedFunc={Midjourney}
        onChangeFunc={changeToMidjourney}
      />

      {/* Img Model 4 */}
      <Card
        title="DreamShaper"
        cardImage={DreamShaper_Preview}
        checkedFunc={DreamShaper}
        onChangeFunc={changeToDreamShaper}
      />
    </div>
  );
};
