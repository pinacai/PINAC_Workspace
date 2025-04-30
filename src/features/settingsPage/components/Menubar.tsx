import React, { useState, useEffect } from "react";

interface MenubarProps {
  menuItems: { label: string; onClick: () => void }[];
}

export const Menubar: React.FC<MenubarProps> = ({ menuItems }) => {
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
    <nav className="flex justify-start rounded-full text-gray-400 bg-gray-700 dark:bg-primary-dark">
      <ul className="flex style-none">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`py-2 px-4 rounded-full cursor-pointer teansition-all duration-300 ${
              activeIndex === index &&
              "bg-gray-500 dark:bg-tertiary-dark text-gray-100 cursor-none"
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
