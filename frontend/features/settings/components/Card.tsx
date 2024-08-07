import React from "react";
import styles from "../styles/Card.module.css";

interface CardProps {
  title: string;
  cardImage: string;
  checkedFunc: boolean;
  onChangeFunc: () => void;
}

export const Card: React.FC<CardProps> = (props) => {
  return (
    <div className={styles.themeCard}>
      <img src={props.cardImage} alt="Cyber Tech 01 Preview" />
      <div className={styles.themeCard_desc}>
        <label className={styles.check_wrapper}>
          <input
            type="checkbox"
            checked={props.checkedFunc}
            onChange={props.onChangeFunc}
          />
          <div className={styles.checkmark}></div>
        </label>
        <span>{props.title}</span>
      </div>
    </div>
  );
};
