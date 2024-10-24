import React from "react";
import styles from "../styles/DeepThinkBtn.module.css";

// Icons
import { HiSparkles } from "react-icons/hi2";

interface DeepThinkBtnProps {
  isActive: boolean;
  setActive: (arg0: boolean) => void;
}
export const DeepThinkBtn: React.FC<DeepThinkBtnProps> = ({
  isActive,
  setActive,
}) => {
  return (
    <>
      <button
        className={isActive ? styles.deepThinkActive : styles.deepThink}
        onClick={() => {
          setActive(!isActive);
        }}
      >
        <HiSparkles size={30} color="violet" style={{ zIndex: 2 }} />
        <span>Deep Think</span>
      </button>
    </>
  );
};
