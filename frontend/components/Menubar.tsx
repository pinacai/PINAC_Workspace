import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./styles/Menubar.module.css";

interface MenubarProps {
  menuItems: { label: string; onClick: () => void }[];
}

export const Menubar: React.FC<MenubarProps> = ({ menuItems }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // active by default
  useEffect(() => {
    setActiveIndex(0);
  }, []);

  //
  const handleItemClick = (index: number, onClick: () => void) => {
    setActiveIndex(index);
    onClick();
    localStorage.setItem("activeMenuIndex", index.toString());
  };

  return (
    <nav className={`${styles.menubar} ${currentPath === "/" && styles.giveMargin}`}>
      <ul className={styles.menuItems}>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${styles.menuItem} ${
              activeIndex === index ? `${styles.active}` : ""
            }`}
            onClick={() => handleItemClick(index, item.onClick)}
          >
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};
