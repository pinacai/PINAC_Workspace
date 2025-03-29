import React, { useState, useRef, useContext, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../features/header/index";
import { WelcomeText } from "../features/welcomeText/index";
import { AiMsgBubble, AiLoader } from "../features/msgBubble/AiMsgBubble";
import { UserMsgBubble } from "../features/msgBubble/UserMsgBubble";
import { InputPanel } from "../features/inputPanel/index";
import { StopTextGeneration } from "../context/StopTextGeneration";
import { startNewSession, addMsgToSession } from "../database/db";

// context
import { ChatMsgContext } from "../context/ChatMsg";
import { WelcomeTextContext } from "../context/WelcomeText";
import { ModelSettingsContext } from "../context/ModelSettings";
import { AttachmentContext } from "../context/Attachment";

// icons
import { FiMinus } from "react-icons/fi";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export const HomePage: React.FC = () => {
  const welcomeTextContext = useContext(WelcomeTextContext);
  const chatContext = useContext(ChatMsgContext);
  const llmContext = useContext(ModelSettingsContext);
  const attachmentContext = useContext(AttachmentContext);
  const [userInputText, setUserInputText] = useState<string>("");
  const [isUserInputActive, setIsUserInputActive] = useState<boolean>(false);
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
  const [isStop, setIsStop] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to start a new chat
  const InitializeNewChat = () => {
    chatContext?.setChatMsg([]);
    chatContext?.setCurrentSessionId(null);
    welcomeTextContext?.setIsWelcomeTextVisible(true);
    setButtonsDisabled(false);
    setUserInputText("");
  };

  // Function to handle sending user input
  const SubmitUserInput = (inputText: string) => {
    if (/\S/.test(userInputText)) {
      setButtonsDisabled(true);
      welcomeTextContext?.setIsWelcomeTextVisible(false);

      const userMessageKey = chatContext?.chatMsg.length ?? 0;
      const aiMessageKey = (chatContext?.chatMsg.length ?? 0) + 1;

      chatContext?.setChatMsg((prevChatHistory) => [
        ...prevChatHistory,
        {
          key: userMessageKey,
          element: [
            userMessageKey,
            "user",
            inputText,
            <UserMsgBubble response={inputText} key={userMessageKey} />,
          ],
        },
      ]);
      LogMessageToDatabase(userMessageKey, "user", inputText);

      chatContext?.setChatMsg((prevChatHistory) => [
        ...prevChatHistory,
        {
          key: aiMessageKey,
          element: [
            aiMessageKey,
            "aiLoader",
            "",
            <AiLoader key={aiMessageKey} />,
          ],
        },
      ]);

      const PreferredPrompt = localStorage.getItem("applied-prompt");

      // ======= Send user input to backend server ======= //
      window.ipcRenderer.send("request-to-server", {
        request_type: "user-input",
        preferred_model_type: llmContext?.textModelType,
        preferred_model:
          llmContext?.textModelType === "Cloud LLM"
            ? llmContext?.cloudModelName
            : llmContext?.ollamaModelName,
        prompt: PreferredPrompt,
        user_query: inputText,
        image_path: attachmentContext?.attachment?.path,
      });

      // Handle AI response from backend
      window.ipcRenderer.once("server-response", (_, response) => {
        const MessageContent = response["error_occurred"]
          ? `**${response["error"]}**\nTry again :(`
          : response["response"]["content"];

        chatContext?.setChatMsg((prevChatHistory) => [
          ...prevChatHistory.slice(0, -1),
          {
            key: aiMessageKey,
            element: [
              aiMessageKey,
              "ai",
              MessageContent,
              <AiMsgBubble
                live={true}
                response={MessageContent}
                setButtonsDisabled={setButtonsDisabled}
                key={aiMessageKey}
              />,
            ],
          },
        ]);

        if (!response["error_occurred"]) {
          LogMessageToDatabase(aiMessageKey, "ai", MessageContent);
        }
      });

      // clearing everything
      attachmentContext?.setAttachment(null);
      setUserInputText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "50px"; // Reset textarea height
      }
    }
  };

  //
  // Log message into the database
  const LogMessageToDatabase = (id: number, role: string, msgText: string) => {
    let currentSessionId = chatContext?.getCurrentSessionId() ?? null;
    if (currentSessionId == null) {
      chatContext?.setCurrentSessionId("newSession");
      currentSessionId = chatContext?.getCurrentSessionId() ?? null;

      if (currentSessionId != null) {
        startNewSession(currentSessionId, msgText.slice(0, 50));
        addMsgToSession(currentSessionId, id, role, msgText);
      }
    } else {
      addMsgToSession(currentSessionId, id, role, msgText);
    }
  };

  // for controling the window
  const minimize = () => {
    window.ipcRenderer.send("minimize");
  };

  const maximize = () => {
    window.ipcRenderer.send("maximize");
  };

  const close = () => {
    window.ipcRenderer.send("close");
  };

  // Auto-scroll effect for chat messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatContext?.chatMsg.length]);

  // --------------------------------------------------- //
  return (
    <div className="w-full h-screen flex">
      <Sidebar />
      <div className="w-full h-full flex flex-col justify-start items-center grow">
        <div
          className="w-full h-[30px] flex justify-end items-center
         bg-secondary dark:bg-secondary-dark text-gray-200"
        >
          <div
            className="draggable-element
            w-full h-full flex justify-center items-center font-exo"
          >
            PINAC Workspace v2.1
          </div>
          <div className="w-39 h-full grid grid-cols-3">
            <button
              className="flex justify-center items-center hover:bg-gray-700 dark:hover:bg-zinc-800"
              onClick={minimize}
            >
              <FiMinus size={17} />
            </button>
            <button
              className="flex justify-center items-center hover:bg-gray-700 dark:hover:bg-zinc-800"
              onClick={maximize}
            >
              <MdCheckBoxOutlineBlank size={15} />
            </button>
            <button
              className="flex justify-center items-center hover:bg-red-700"
              onClick={close}
            >
              <RxCross2 size={17} />
            </button>
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-start items-center grow">
          <Header title="PINAC" page="home" clearChat={InitializeNewChat} />
          <StopTextGeneration.Provider
            value={{ stop: isStop, setStop: setIsStop }}
          >
            <div className="msgBox">
              {welcomeTextContext?.isWelcomeTextVisible && <WelcomeText />}
              {chatContext?.chatMsg.map((item) => item.element[3])}
              <div ref={scrollRef} />
            </div>
          </StopTextGeneration.Provider>

          <InputPanel
            userInput={userInputText}
            setUserInput={setUserInputText}
            isUserInputActive={isUserInputActive}
            setUserInputActive={setIsUserInputActive}
            buttonsDisabled={buttonsDisabled}
            setButtonsDisabled={setButtonsDisabled}
            textareaRef={textareaRef}
            submit={SubmitUserInput}
            setStop={setIsStop}
          />
        </div>
      </div>
    </div>
  );
};
