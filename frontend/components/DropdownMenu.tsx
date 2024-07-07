import { useEffect, useState, useRef } from "react";
import "./style/DropdownMenu.css";

// Icon
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface DropdownMenuProps {
  defaultOption: string;
  optionList: Array<string>;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const [selectedOption, setSelectedOption] = useState(props.defaultOption);
  const [isActive, setIsActive] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    setIsActive(!isActive);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsActive(false);
    // Saving choice
    localStorage.setItem("preferred-model", option);
  };

  // At starting
  // Selecting model based on local storage
  useEffect(() => {
    const preferredModel = localStorage.getItem("preferred-model");
    preferredModel !== null && setSelectedOption(preferredModel);
  }, []);

  // Creating an event handler to close the dropdown menu by click elsewhere outside the menu
  useEffect(() => {
    const handleOutsideClicks = (e: MouseEvent) => {
      if (
        isActive &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(e.target as Node)
      ) {
        setIsActive(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClicks);

    return () => window.removeEventListener("mousedown", handleOutsideClicks);
  }, [isActive]);

  return (
    <div className="dropdown" ref={dropdownMenuRef}>
      <div className="selector">
        <span>{selectedOption}</span>
        <button onClick={openMenu}>
          {isActive ? (
            <IoIosArrowUp size={24} color="var(--headerTitle-color)" />
          ) : (
            <IoIosArrowDown size={24} color="var(--headerTitle-color)" />
          )}
        </button>
      </div>
      <div className={`dropdown-menu ${isActive ? "active" : ""}`}>
        <ul>
          {props.optionList.map((option, index) => (
            <li
              key={index}
              className={selectedOption == option ? "selected" : ""}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
