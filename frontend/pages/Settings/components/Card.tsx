import React from "react";
import "../style/Card.css";

interface CardProps {
  title: string;
  cardImage: string;
  checkedFunc: boolean;
  onChangeFunc: () => void;
}

export const Card: React.FC<CardProps> = (props) => {
  return (
    <div className="themeCard">
      <img src={props.cardImage} alt="Cyber Tech 01 Preview" />
      <div className="themeCard-desc">
        <label className="check-wrapper">
          <input
            type="checkbox"
            checked={props.checkedFunc}
            onChange={props.onChangeFunc}
          />
          <div className="checkmark"></div>
        </label>
        <span>{props.title}</span>
      </div>
    </div>
  );
};
