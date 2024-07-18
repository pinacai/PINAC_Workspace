import { useEffect, useState, useRef } from "react";
import styles from "../style/DropdownMenu.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface DropdownMenuProps {
  defaultOption: string;
  optionList: Array<string>;
}

const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const [selectedOption, setSelectedOption] = useState(props.defaultOption);
  const [isActive, setIsActive] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsActive(false);
    localStorage.setItem("homepage-dropdown-option", option); // Set the value accordingly
  };

  useEffect(() => {
    const dropdown_option = localStorage.getItem("homepage-dropdown-option");
    dropdown_option !== null && setSelectedOption(dropdown_option);
  }, []);

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
    <div className={styles.dropdown} ref={dropdownMenuRef}>
      <div className={styles.button_group}>
        {props.optionList.map((option, index) => (
          <button
            key={index}
            className={`${styles.option_button} ${selectedOption === option ? styles.selected : ""}`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className={styles.dropdown_wrapper}>
        <div className={styles.selector} onClick={() => setIsActive(!isActive)}>
          <span>{selectedOption}</span>
          <button>
            {isActive ? (
              <IoIosArrowDown size={24} color="var(--headerTitle-color)" />
            ) : (
              <IoIosArrowUp size={24} color="var(--headerTitle-color)" />
            )}
          </button>
        </div>
        {isActive && (
          <div className={`${styles.dropdown_menu} ${isActive ? styles.active : ""}`}>
            <ul>
              {props.optionList.map((option, index) => (
                <li
                  key={index}
                  className={selectedOption === option ? styles.selected : ""}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
