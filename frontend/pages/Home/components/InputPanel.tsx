import React, { useState, useEffect } from "react";

// Icons
import { VscSend } from "react-icons/vsc";
import { FaRegStopCircle } from "react-icons/fa";
import { FiImage, FiFile, FiSearch, FiMoreVertical } from "react-icons/fi";

interface InputPanelProps {
  userInput: string;
  setUserInput: (value: string) => void;
  isUserInputActive: boolean;
  setUserInputActive: (value: boolean) => void;
  buttonsDisabled: boolean;
  setButtonsDisabled: (value: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  submit: (text: string) => void;
  setStop: (value: boolean) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  userInput,
  setUserInput,
  isUserInputActive,
  setUserInputActive,
  buttonsDisabled,
  textareaRef,
  submit,
  setStop,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false); // State for showing options

  //
  // Handles Enter key press for submitting messages
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Insert a new line
        setUserInput((userInput) => userInput + "\n");
        event.preventDefault(); // Prevent the default behavior of adding a new line
      } else {
        event.preventDefault(); // Prevent default Enter behavior
        submit(userInput);
      }
    }
  };

  //
  // for managing the height of the textarea automatically
  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      const scHeight = (e.target as HTMLTextAreaElement).scrollHeight;
      (e.target as HTMLTextAreaElement).style.height = "50px";
      textareaRef.current!.style.height = `${scHeight}px`;

      if ((e.target as HTMLTextAreaElement).value.trim() === "") {
        // Set the textarea height back to the default
        textareaRef.current!.style.height = "50px";
      }
    };

    const textareaElement = textareaRef.current;
    if (textareaElement) {
      textareaElement.addEventListener("keyup", handleKeyup);
    }

    return () => {
      if (textareaElement) {
        textareaElement.removeEventListener("keyup", handleKeyup);
      }
    };
  }, [textareaRef]);

  // -------------------------------------------------------- //
  return (
    <div className="input-box">
      <div
        className={`input-group ${isUserInputActive ? "active" : ""}`}
        onFocus={() => setUserInputActive(true)}
        onBlur={() => setUserInputActive(false)}
      >
        {showOptions && (
          // this is the class that has add files icons.
          <div className="options-menu">
            <FiImage title="Add Image" className="options-menu-icon" />
            <FiFile title="Add PDF" className="options-menu-icon" />
            <FiSearch title="Web Search" className="options-menu-icon" />
          </div>
        )}
        <textarea
          id="user-input"
          className={buttonsDisabled ? "disabled" : ""}
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me your task..."
          disabled={buttonsDisabled}
          ref={textareaRef}
          required
        />
        <div className="input-group-append">
          {!buttonsDisabled ? (
            <>
              {/* this button is for toggling options */}
              <button
                id="options-btn"
                className={buttonsDisabled ? "disabled" : ""}
                onClick={() => setShowOptions(!showOptions)}
                disabled={buttonsDisabled}
              >
                <FiMoreVertical
                  size={29}
                  color="var(--text-color2)"
                  style={{ marginTop: "6px" }}
                />
              </button>

              <button
                id="submit-btn"
                className={buttonsDisabled ? "disabled" : ""}
                onClick={() =>
                  userInput !== undefined ? submit(userInput) : {}
                }
                disabled={buttonsDisabled}
              >
                <VscSend size={30} color="var(--text-color2)" />
              </button>
            </>
          ) : (
            <button onClick={() => setStop(true)} className="stop-icon">
              <FaRegStopCircle size={25} color={"gray"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
