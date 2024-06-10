import "./style/Menubar.css";
import React, { useState, useEffect } from "react";

interface MenubarProps {
  menuItems: { label: string; onClick: () => void }[];
}

export const Menubar: React.FC<MenubarProps> = ({ menuItems }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedActiveIndex = localStorage.getItem("activeMenuIndex");
    if (savedActiveIndex !== null) {
      setActiveIndex(parseInt(savedActiveIndex));
    } else {
      // active by default
      setActiveIndex(0);
    }
  }, []);

  //
  const handleItemClick = (index: number, onClick: () => void) => {
    setActiveIndex(index);
    onClick();
    localStorage.setItem("activeMenuIndex", index.toString());
  };

  return (
    <nav className="menubar">
      <ul className="menu-items">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`menu-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => handleItemClick(index, item.onClick)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};
