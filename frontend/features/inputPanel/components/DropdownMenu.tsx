import { useEffect, useState, useRef } from "react";
import styles from "../styles/DropdownMenu.module.css";

// Icon
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface DropdownMenuProps {
  labelText: string;
  defaultOption: string;
  optionList: Array<string>;
  localStorageVariableName: string;
  searchBar: boolean;
  updateValue?: (value: string) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  labelText: labelText,
  defaultOption,
  optionList,
  localStorageVariableName,
  searchBar,
  updateValue,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultOption);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Handle option click
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsActive(false);
    localStorage.setItem(localStorageVariableName, option);
    updateValue && updateValue(option);
    setSearchQuery("");
  };

  // Initialize selected option from local storage
  useEffect(() => {
    const preferredOption = localStorage.getItem(localStorageVariableName);
    preferredOption !== null && setSelectedOption(preferredOption);
  }, [localStorageVariableName]);

  // Close dropdown on outside click
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

  // Filter options based on search query
  const filteredOptions = optionList.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------------------------------- //
  return (
    <div className={styles.dropdown} ref={dropdownMenuRef}>
      {/* ===== Dropdown Menu (Above the button) ===== */}
      <div
        className={`${styles.dropdownMenu} ${
          isActive ? `${styles.active}` : ""
        }`}
      >
        <ul>
          {filteredOptions.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
        {searchBar && (
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>
      {/* =========== Dropdown Button ========== */}
      <div className={styles.selector}>
        <span>{labelText}</span>
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
