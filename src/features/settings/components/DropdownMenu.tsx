import { useEffect, useState, useRef, useContext } from "react";
import { ModelSettingsContext } from "../../../context/ModelSettings";

// Icon
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface DropdownMenuProps {
  defaultOption: string | null;
  optionList: Array<string>;
  valueName:
    | "model-type"
    | "text-model-type"
    | "cloud-model-name"
    | "ollama-model-name"
    | "output-language";
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  defaultOption,
  optionList,
  valueName,
}) => {
  const modelContext = useContext(ModelSettingsContext);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isActive, setIsActive] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const onClick = (option: string) => {
    modelContext?.setValue(valueName, option);
    setSelectedOption(option);
    setIsActive(false);
  };

  // At starting selecting model based on local storage
  useEffect(() => {
    const preferredOption = modelContext?.getValue(valueName);
    preferredOption != null && setSelectedOption(preferredOption);
  }, [modelContext, valueName]);

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
    <div className="w-full text-gray-200" ref={dropdownMenuRef}>
      <div
        className="max-w-64 h-9 pl-2 flex items-center justify-between rounded-lg
        bg-gray-700 dark:bg-tertiary-dark"
      >
        <span>{selectedOption}</span>
        <button
          className="h-full pl-2.5 pr-3 flex items-center justify-center rounded-r-lg
          hover:bg-gray-600 dark:hover:bg-zinc-600 cursor-pointer"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
        </button>
      </div>
      <div
        className={
          isActive
            ? "absolute w-48 lg:w-52 mt-2 rounded-xl bg-gray-700 dark:bg-tertiary-dark"
            : "hidden"
        }
      >
        <ul className="style-none">
          {optionList.map((option, index) => (
            <li
              className="flex items-center justify-start p-2 rounded-xl
              hover:bg-gray-600 dark:hover:bg-zinc-600 cursor-pointer"
              key={index}
              onClick={() => onClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
