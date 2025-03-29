import React, { useState, useEffect, useContext } from "react";
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
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  submit: (text: string) => void;
  setStop: (value: boolean) => void;
}

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
    <div className="w-full min-h-12 max-h-230 mt-[10px] mb-[20px] flex items-center justify-center">
      <div
        className="w-4xl min-h-12 max-h-200 rounded-3xl p-3 relative
      bg-gray-200 dark:bg-tertiary-dark border-1 border-gray-300 dark:border-neutral-600
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

        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-gray-100">
            <label className="w-9 h-9 rounded-full flex items-center justify-center border-1 border-gray-400 dark:border-zinc-500 cursor-pointer">
              <FiPlus size={20} />
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                className="hidden"
                onChange={(e) => handleFileUpload(e)}
              />
            </label>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full border-1 border-gray-400 dark:border-zinc-500 cursor-pointer">
              <PiSparkleLight size={20} />
              <span>Deep Think</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full border-1 border-gray-400 dark:border-zinc-500 cursor-pointer">
              <TbBulb size={20} />
              <span>Prompt</span>
            </button>

            <button className="w-9 h-9 rounded-full flex items-center justify-center border-1 border-gray-400 dark:border-zinc-500 cursor-pointer">
              <IoIosMore size={20} />
            </button>
          </div>

          {!buttonsDisabled ? (
            <button
              className="w-10 h-10 bg-gray-800 dark:bg-gray-100 rounded-full flex items-center justify-center
            text-gray-100 dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
