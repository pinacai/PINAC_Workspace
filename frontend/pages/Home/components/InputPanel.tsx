import React, { useState, useEffect, useRef } from "react";
import { DropdownMenu } from "./DropdownMenu";
import styles from "../style/InputPanel.module.css";

// Icons
import { VscSend, VscFilePdf } from "react-icons/vsc";
import { FaRegStopCircle } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { CgAttachment } from "react-icons/cg";
import { FiImage } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

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
  const optionMenuRef = useRef<HTMLDivElement>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] =
    useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentDropdownIndex, setCurrentDropdownIndex] = useState(0); // To track the active dropdown
  const [isOutImgPreview, setIsOutImgPreview] = useState(
    window.innerWidth > 320
  );
  const [isShowAllAdvanceOptions, setIsShowAllAdvanceOptions] = useState(
    window.innerWidth > 576
  );

  //
  const dropdowns = [
    {
      label: "Prompt: ",
      defaultOption: "None",
      optionList: ["None"],
      localStorageVariableName: "applied-prompt",
    },
    {
      label: "Output: ",
      defaultOption: "Markdown Format",
      optionList: ["Markdown Format"],
      localStorageVariableName: "ai-response-format",
    },
  ];

  //
  // Handles Enter key press for submitting messages
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Insert a new line
        setUserInput(userInput + "\n");
        event.preventDefault(); // Prevent the default behavior of adding a new line
      } else {
        event.preventDefault(); // Prevent default Enter behavior
        submit(userInput);
      }
    }
  };

  //
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    if (fileType === "image") {
      const file = event.target.files?.[0];
      if (file) {
        setUploadedImage(file);
      }
    }
  };

  //
  const handleCancelUpload = () => {
    setUploadedImage(null);
  };

  //
  // Creating an event handler to close the option menu by click elsewhere outside the menu
  useEffect(() => {
    const handleOutsideClicks = (e: MouseEvent) => {
      if (
        showAttachmentOptions &&
        optionMenuRef.current &&
        !optionMenuRef.current.contains(e.target as Node)
      ) {
        setShowAttachmentOptions(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClicks);

    return () => window.removeEventListener("mousedown", handleOutsideClicks);
  }, [showAttachmentOptions]);

  //
  //
  // for UI responsiveness
  useEffect(() => {
    const updateOutImgPreview = () => {
      setIsOutImgPreview(window.innerWidth > 320);
      setIsShowAllAdvanceOptions(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateOutImgPreview);
    return () => window.removeEventListener("resize", updateOutImgPreview);
  }, []);

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
    <div className={styles.input_box}>
      {/* ============ Image Preview ============ */}
      {!isOutImgPreview && uploadedImage && (
        <div className={styles.outer_image_preview}>
          <div>
            <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" />
            <button
              className={styles.cancel_button}
              onClick={handleCancelUpload}
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>
      )}
      {/* ======== Advance Options (Dropdown) ============ */}
      <div className={styles.input_option_menu}>
        {/* Render both dropdowns on wider screens */}
        {isShowAllAdvanceOptions ? (
          <>
            <DropdownMenu
              lebelText={dropdowns[0].label}
              defaultOption={dropdowns[0].defaultOption}
              optionList={dropdowns[0].optionList}
              localStorageVariableName={dropdowns[0].localStorageVariableName}
            />
            <DropdownMenu
              lebelText={dropdowns[1].label}
              defaultOption={dropdowns[1].defaultOption}
              optionList={dropdowns[1].optionList}
              localStorageVariableName={dropdowns[1].localStorageVariableName}
            />
          </>
        ) : (
          // Render the current dropdown when on smaller screens
          <>
            <DropdownMenu
              lebelText={dropdowns[currentDropdownIndex].label}
              defaultOption={dropdowns[currentDropdownIndex].defaultOption}
              optionList={dropdowns[currentDropdownIndex].optionList}
              localStorageVariableName={
                dropdowns[currentDropdownIndex].localStorageVariableName
              }
            />
            <button
              className={styles.next_button}
              onClick={() =>
                setCurrentDropdownIndex(
                  (currentDropdownIndex + 1) % dropdowns.length
                )
              }
            >
              <FaAngleRight
                size={25}
                color="var(--headerTitle-color)"
              />
            </button>
          </>
        )}
      </div>

      {/* ============================ */}
      <div
        className={`${styles.input_group} ${
          isUserInputActive ? `${styles.active}` : ""
        }`}
        onFocus={() => setUserInputActive(true)}
        onBlur={() => setUserInputActive(false)}
      >
        {/* ====== Image Preview ======= */}
        {isOutImgPreview && uploadedImage && (
          <div className={styles.image_preview}>
            <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" />
            <button
              className={styles.cancel_button}
              onClick={handleCancelUpload}
            >
              <AiOutlineClose />
            </button>
          </div>
        )}

        {/* ====== Attachment Options Menu ======= */}
        {showAttachmentOptions && (
          <div className={styles.options_menu} ref={optionMenuRef}>
            <label className={styles.options_menu_btn}>
              <FiImage title="Add Image" className={styles.options_menu_icon} />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e, "image")}
              />
            </label>
            <label className={styles.options_menu_btn}>
              <VscFilePdf
                title="Add PDF"
                className={styles.options_menu_icon}
              />
              <input
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                // onChange={(e) => handleFileUpload(e, "pdf")}
              />
            </label>
          </div>
        )}

        {/* ====== Main Input Area ======= */}
        <textarea
          id={styles.user_input}
          className={buttonsDisabled ? `${styles.disabled}` : ""}
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me your task..."
          disabled={buttonsDisabled}
          ref={textareaRef}
          required
        />
        {/* ============ Buttons besides the text area ============= */}
        <div className={styles.input_group_append}>
          {!buttonsDisabled ? (
            <>
              {/* ====== Attachment Button ======= */}
              <button
                id={styles.attachment_btn}
                className={buttonsDisabled ? `${styles.disabled}` : ""}
                onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                disabled={buttonsDisabled}
              >
                <CgAttachment id={styles.attachment_icon} />
              </button>

              {/* ====== Submit Button ======= */}
              <button
                id={styles.submit_btn}
                className={buttonsDisabled ? `${styles.disabled}` : ""}
                onClick={() =>
                  userInput !== undefined ? submit(userInput) : {}
                }
                disabled={buttonsDisabled}
              >
                <VscSend id={styles.submit_icon} />
              </button>
            </>
          ) : (
            /* ====== Stop Text Generation Button ======= */
            <button onClick={() => setStop(true)} className={styles.stop_icon}>
              <FaRegStopCircle size={25} color="var(--headerTitle-color)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
