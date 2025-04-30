import React, { useState, useEffect, useContext, useRef } from "react";
import { ModelSettingsContext } from "../../context/ModelSettings";
import { AttachmentContext } from "../../context/Attachment";
import { promptsData } from "../../data/prompts"; // Import prompts data

// icons
import { GoGlobe } from "react-icons/go";
import { PiGlobeX } from "react-icons/pi";
import { TbBulb } from "react-icons/tb";
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

export const ChatInput: React.FC<ChatInputProps> = ({
  userInput,
  setUserInput,
  buttonsDisabled,
  textareaRef,
  submit,
  setStop,
}) => {
  const modelContext = useContext(ModelSettingsContext);
  const attachmentContext = useContext(AttachmentContext);
  const [isPromptMenuOpen, setIsPromptMenuOpen] = useState<boolean>(false);
  const [promptSearchQuery, setPromptSearchQuery] = useState<string>(""); // State for search query
  const promptMenuRef = useRef<HTMLDivElement>(null); // Ref for the menu
  const promptButtonRef = useRef<HTMLButtonElement>(null); // Ref for the prompt button

  // Handles adding attachment
  const handleFileUpload = async () => {
    let filters: { name: string; extensions: string[] }[] = [];

    if (modelContext?.modelType === "Pinac CLoud Model") {
      filters = [{ name: "Supported Files", extensions: ["pdf"] }];
    } else {
      filters = [
        {
          name: "Supported Files",
          extensions: [
            "pdf",
            "docx",
            "pptx",
            // "xlsx",
            // "xls",
            "txt",
            "md",
            "py",
            "js",
            "ts",
            "jsx",
            "tsx",
            "c",
            "cpp",
            "java",
            "html",
            "css",
          ],
        },
      ];
    }

    const filePath = await window.ipcRenderer.invoke(
      "open-file-dialog",
      filters
    );
    if (filePath) {
      attachmentContext?.setAttachmentFile(filePath);
    }
  };

  const handleCancelUpload = () => {
    attachmentContext?.setAttachment(null);
  };

  const removeUsingAttachment = () => {
    if (attachmentContext?.setUsingAttachment) {
      attachmentContext.setUsingAttachment(false);
      attachmentContext.setAttachment(null);
    }
  };

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
  const handlePromptSelect = (promptKey: string) => {
    const promptText = promptsData[promptKey];
    setUserInput(promptText); // Set the selected prompt text to the input
    setIsPromptMenuOpen(false);
    setPromptSearchQuery(""); // Clear search query on selection
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
        setPromptSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPromptMenuOpen]);

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

  // Filter prompts based on search query
  const filteredPromptKeys = Object.keys(promptsData).filter((key) =>
    key.toLowerCase().includes(promptSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full mt-[10px] mb-[20px] flex flex-col items-center justify-center">
      {/* For showing currently under used attachment */}
      {attachmentContext?.usingAttachment && attachmentContext?.attachment && (
        <div className="w-[80%] lg:w-[60%] mb-3 p-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FaRegFileLines
              size={16}
              className="text-blue-600 dark:text-blue-400"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Using document:{" "}
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {attachmentContext?.attachment.name}
              </span>
            </span>
          </div>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={removeUsingAttachment}
          >
            <AiOutlineClose size={16} />
          </button>
        </div>
      )}
      <div
        className="rounded-3xl p-3 relative w-[80%] lg:w-[60%]
        bg-gray-200 dark:bg-tertiary-dark border-1 border-gray-300 dark:border-zinc-600
        "
      >
        {/* For showing added attachment (Not in use) */}
        {attachmentContext?.attachment &&
          !attachmentContext?.usingAttachment && (
            <div className="mb-4 relative">
              <div className="flex items-center gap-2 bg-gray-700 dark:bg-primary-dark p-2 pr-3 rounded-2xl w-fit">
                <div className="bg-sky-500 p-2 rounded-lg">
                  <FaRegFileLines size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white">
                    {attachmentContext?.attachment.nameWithoutExtension}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {attachmentContext?.attachment.extension}
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
            <button
              onClick={handleFileUpload}
              className={`w-9 h-9 rounded-full flex items-center justify-center border-1 
            border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 
            ${
              attachmentContext?.usingAttachment
                ? "opacity-50 cursor-not-allowed"
                : " cursor-pointer"
            }`}
              disabled={attachmentContext?.usingAttachment} // Disable button when a attachment is under use
            >
              <FiPlus size={20} />
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full border-1 
            border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
              onClick={() =>
                modelContext?.setWebSearch(!modelContext?.webSearch)
              }
            >
              {modelContext?.webSearch ? (
                <GoGlobe size={20} className="text-green-600" />
              ) : (
                <PiGlobeX size={20} />
              )}
              <span>Web</span>
            </button>

            <div className="relative">
              {" "}
              {/* Wrapper for positioning the menu */}
              <button
                ref={promptButtonRef}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-1
              border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
                onClick={() => setIsPromptMenuOpen(!isPromptMenuOpen)}
              >
                <TbBulb size={20} />
                <span>Prompt</span>
              </button>
              {isPromptMenuOpen && (
                <div
                  ref={promptMenuRef}
                  className="absolute bottom-full left-0 mb-2 w-64 flex flex-col max-h-80 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-lg z-10" // Added flex flex-col and max-h-80
                >
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-300 dark:border-zinc-600">
                    <input
                      type="text"
                      placeholder="Search prompts..."
                      value={promptSearchQuery}
                      onChange={(e) => setPromptSearchQuery(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus // Automatically focus the search input when the menu opens
                    />
                  </div>
                  {/* Menu Content */}
                  <div className="p-2 text-gray-700 dark:text-gray-200 overflow-y-auto">
                    {" "}
                    {filteredPromptKeys.length > 0 ? (
                      filteredPromptKeys.map((promptKey) => (
                        <button
                          key={promptKey}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
                          onClick={() => handlePromptSelect(promptKey)}
                        >
                          {promptKey}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                        No prompts found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* <button
              className="w-9 h-9 rounded-full flex items-center justify-center border-1 
            border-gray-400 dark:border-zinc-500 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
            >
              <IoIosMore size={20} />
            </button> */}
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
