import React from "react";
import styles from "../styles/LiveSearchBtn.module.css";

// Icons
import { CiGlobe } from "react-icons/ci";

interface NewChatBtnProps {
    isActive : boolean,
    setActive: (arg0 : boolean) => void;
}
export const LiveSearchButton: React.FC<NewChatBtnProps> = ({isActive,setActive}) => {
  return (
    <>
      <button className={isActive ? styles.LiveSearchActive : styles.LiveSearch} onClick={() => {setActive(!isActive)}} 
        >
        <CiGlobe
          size={30}
          color="var(--text-color-light)"
          style={{ zIndex: 2 }}
        />
        <span>Live Search</span>
      </button>
    </>
  );
};
