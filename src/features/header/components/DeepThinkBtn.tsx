import React, { useContext } from "react";
import { ModelSettingsContext } from "../../../context/ModelSettings";
import styles from "../styles/DeepThinkBtn.module.css";

// Icons
import { HiSparkles } from "react-icons/hi2";

export const DeepThinkBtn: React.FC = () => {
  const modelContext = useContext(ModelSettingsContext);

  const handleClick = () => {
    modelContext?.setDeepthink(!modelContext.deepthink);
  };

  return (
    <>
      <button
        className={modelContext?.deepthink ? styles.deepThinkActive : styles.deepThink}
        onClick={handleClick}
      >
        <HiSparkles size={30} color="violet" style={{ zIndex: 2 }} />
        <span>Deep Think</span>
      </button>
    </>
  );
};
