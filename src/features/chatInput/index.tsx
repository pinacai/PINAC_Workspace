import React, { useState, useEffect, useContext, useRef } from "react"; // Added useRef
import { AttachmentContext } from "../../context/Attachment";

// icons
import { PiSparkleLight } from "react-icons/pi";
import { TbBulb } from "react-icons/tb";
import { IoIosMore } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { FaRegStopCircle } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";

interface ChatInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  buttonsDisabled: boolean;
  setButtonsDisabled: (value: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  submit: (text: string) => void;
  setStop: (value: boolean) => void;
}

// Define the list of prompts
const prompts = [
  "Sample Prompt 1",
  "Sample Prompt 2",
  "Sample Prompt 3",
  "Sample Prompt 4",
  "Sample Prompt 5",
  "Sample Prompt 6",
  "Sample Prompt 7",
];

export const ChatInput: React.FC<ChatInputProps> = ({
  userInput,
  setUserInput,
  buttonsDisabled,
  textareaRef,
  submit,
  setStop,
}) => {
  const attachmentContext = useContext(AttachmentContext);
  const [, setAttachment] = useState<boolean>(false);
  const [isPromptMenuOpen, setIsPromptMenuOpen] = useState<boolean>(false);
  const promptMenuRef = useRef<HTMLDivElement>(null); // Ref for the menu
  const promptButtonRef = useRef<HTMLButtonElement>(null); // Ref for the prompt button

  // Handles attachment
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      attachmentContext?.setAttachment(file);
      setAttachment(true);
    }
  };

  const handleCancelUpload = () => {
    attachmentContext?.setAttachment(null);
    setAttachment(false);
  };

  function getFileName(filePath: string) {
    const parts = filePath.split("/");
    const fileNameWithExtension = parts.pop() || "";
    const [fileName, extension] = fileNameWithExtension.split(".");
    return [fileName, extension];
  }

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

  // Handles selecting a prompt from the menu
  const handlePromptSelect = (promptText: string) => {
    setUserInput(promptText); // Set the selected prompt text to the input
    setIsPromptMenuOpen(false); // Close the menu
    // Optionally focus the textarea after selecting a prompt
    textareaRef.current?.focus();
  };

  // Effect for handling clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPromptMenuOpen &&
        promptMenuRef.current &&
        !promptMenuRef.current.contains(event.target as Node) &&
        promptButtonRef.current &&
        !promptButtonRef.current.contains(event.target as Node)
      ) {
        setIsPromptMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPromptMenuOpen]); // Re-run effect when menu visibility changes

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

  return (
    <div className="w-full mt-[10px] mb-[20px] flex items-center justify-center">
      <div
        className="rounded-3xl p-3 relative w-[80%] lg:w-[60%]
        bg-gray-200 dark:bg-tertiary-dark border-1 border-gray-300 dark:border-zinc-600
        "
      >
        {attachmentContext?.attachment && (
          <div className="mb-4 relative">
            <div className="flex items-center gap-2 bg-gray-700 dark:bg-primary-dark p-2 pr-3 rounded-2xl w-fit">
              <div className="bg-sky-500 p-2 rounded-lg">
                <FaRegFileLines size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white">
                  {getFileName(attachmentContext?.attachment.name)[0]}
                </div>
                <div className="text-gray-400 text-sm">
                  {getFileName(attachmentContext?.attachment.name)[1]}
                </div>
              </div>
              <button
                className="pl-2 rounded-full text-gray-400 hover:text-red-500"
                onClick={handleCancelUpload}
              >
                <AiOutlineClose size={16} />
              </button>
            </div>
          </div>
        )}

        <textarea
          className={`chatInput placeholder:text-gray-500 dark:placeholder:text-zinc-400 ${
            buttonsDisabled && "cursor-none"
          }`}
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me your task..."
          disabled={buttonsDisabled}
          ref={textareaRef}
          required
        />

        <div className="flex items-center justify-between pl-2 relative">
          {" "}
          {/* Added relative positioning */}
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-gray-100">
            <label
              className="w-9 h-9 rounded-full flex items-center justify-center border-1 
            border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
            >
              <FiPlus size={20} />
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                className="hidden"
                onChange={(e) => handleFileUpload(e)}
              />
            </label>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full border-1 
            border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
            >
              <PiSparkleLight size={20} />
              <span>Deep Think</span>
            </button>

            <div className="relative">
              {" "}
              {/* Wrapper for positioning the menu */}
              <button
                ref={promptButtonRef} // Assign ref to the button
                className="flex items-center gap-2 px-4 py-2 rounded-full border-1
              border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
                onClick={() => setIsPromptMenuOpen(!isPromptMenuOpen)} // Toggle menu
              >
                <TbBulb size={20} />
                <span>Prompt</span>
              </button>
              {isPromptMenuOpen && (
                <div
                  ref={promptMenuRef} // Assign ref to the menu container
                  className="absolute bottom-full left-0 mb-2 w-64 max-h-70 overflow-y-auto bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-lg z-10"
                >
                  {/* Menu Content */}
                  <div className="p-2 text-gray-700 dark:text-gray-200">
                    {prompts.map((prompt, index) => (
                      <button
                        key={index}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
                        onClick={() => handlePromptSelect(prompt)} // Call handler on click
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="w-9 h-9 rounded-full flex items-center justify-center border-1 
            border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
            >
              <IoIosMore size={20} />
            </button>
          </div>
          {!buttonsDisabled ? (
            <button
              className="w-10 h-10 bg-gray-800 dark:bg-gray-100 rounded-full flex items-center justify-center
            text-gray-100 dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
              onClick={() => submit(userInput)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0  0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          ) : (
            <button
              className="size-10 bg-gray-800 dark:bg-gray-100 rounded-full flex items-center justify-center
              text-gray-100 dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
              onClick={() => setStop(true)}
            >
              <FaRegStopCircle className="size-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
