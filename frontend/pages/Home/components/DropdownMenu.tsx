import { useEffect, useState, useRef } from "react";
import styles from "../style/DropdownMenu.module.css";

// Icon
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface DropdownMenuProps {
  lebelText: string;
  defaultOption: string;
  optionList: Array<string>;
  localStorageVariableName: string;
  updateValue?: (value: string) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  lebelText,
  defaultOption,
  optionList,
  localStorageVariableName,
  updateValue,
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isActive, setIsActive] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  //
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsActive(false);
    localStorage.setItem(localStorageVariableName, option);
    updateValue && updateValue(option);
  };

  //
  // At starting selecting model based on local storage
  useEffect(() => {
    const preferredOption = localStorage.getItem(localStorageVariableName);
    preferredOption !== null && setSelectedOption(preferredOption);
  }, [localStorageVariableName]);

  //
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

  // -------------------------------------------- //
  return (
    <div className={styles.dropdown} ref={dropdownMenuRef}>
      {/* ===== Dropdown Menu (Above the button) ===== */}
      <div
        className={`${styles.dropdown_menu} ${
          isActive ? `${styles.active}` : ""
        }`}
      >
        <ul>
          {optionList.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      </div>
      {/* =========== Dropdown Button ========== */}
      <div className={styles.selector}>
        <span>{lebelText}</span>
        <span>{selectedOption}</span>
        <button onClick={() => setIsActive(!isActive)}>
          {isActive ? (
            <IoIosArrowUp size={24} color="var(--headerTitle-color)" />
          ) : (
            <IoIosArrowDown size={24} color="var(--headerTitle-color)" />
          )}
        </button>
      </div>
    </div>
  );
};
