import { useEffect, useState, useRef, useContext } from "react";
import { LLMSettingsContext } from "../../../context/LLMSettings";
import styles from "../styles/DropdownMenu.module.css";

// Icon
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface DropdownMenuProps {
  defaultOption: string;
  optionList: Array<string>;
  taskType: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  defaultOption,
  optionList,
  taskType,
}) => {
  const llmContext = useContext(LLMSettingsContext);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isActive, setIsActive] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  //
  const onClick = (option: string) => {
    llmContext?.setValue(taskType, option);
    setSelectedOption(option);
    setIsActive(false);
  };

  //
  // At starting selecting model based on local storage
  useEffect(() => {
    const preferredOption = llmContext?.getValue(taskType);
    preferredOption != null && setSelectedOption(preferredOption);
  }, [llmContext, taskType]);

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
      <div className={styles.selector}>
        <span>{selectedOption}</span>
        <button onClick={() => setIsActive(!isActive)}>
          {isActive ? (
            <IoIosArrowUp size={24} color="var(--headerTitle-color)" />
          ) : (
            <IoIosArrowDown size={24} color="var(--headerTitle-color)" />
          )}
        </button>
      </div>
      <div
        className={`${styles.dropdownMenu} ${
          isActive ? `${styles.active}` : ""
        }`}
      >
        <ul>
          {optionList.map((option, index) => (
            <li key={index} onClick={() => onClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
