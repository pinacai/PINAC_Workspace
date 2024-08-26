import React, { useState, useRef, useContext, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../features/header/index";
import { WelcomeText } from "../features/welcomeText/index";
import { AiMsgBubble, AiLoader } from "../features/msgBubble/AiMsgBubble";
import { UserMsgBubble } from "../features/msgBubble/UserMsgBubble";
import { InputPanel } from "../features/inputPanel/index";
import { StopTextGeneration } from "../context/StopTextGeneration";
import { SubPageContext } from "../context/SubPage";
import { startNewSession, addMsgToSession } from "../database/db";
import { generateUUID } from "../database/UUID";
import styles from "./styles/Home.module.css";

// sub-pages
import { ChatHistory } from "../features/chatHistory";
import AboutUs from "../features/aboutUs/index";
import Settings from "../features/settings/index";
import Profile from "../features/profile/index";

interface ChatMessage {
  key: number;
  element: [number, string, string, JSX.Element]; // [ id, role, text, jsx ]
}

export const HomePage: React.FC = () => {
  const subPageContext = useContext(SubPageContext);
  const currentSessionIdRef = useRef<string | null>(null);
  const [isWelcomeTextVisible, setIsWelcomeTextVisible] =
    useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInputText, setUserInputText] = useState<string>("");
  const [isUserInputActive, setIsUserInputActive] = useState<boolean>(false);
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
  const [isStop, setIsStop] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to start a new chat
  const InitializeNewChat = () => {
    setChatMessages([]);
    currentSessionIdRef.current = null;
    window.ipcRenderer.send("request-to-backend", {
      request_type: "clear-chat",
    });
    setIsWelcomeTextVisible(true);
    setButtonsDisabled(false);
    setUserInputText("");
  };

  // Function to handle sending user input
  const SubmitUserInput = (inputText: string) => {
    if (/\S/.test(userInputText)) {
      setButtonsDisabled(true);
      setIsWelcomeTextVisible(false);

      const userMessageKey = chatMessages.length ?? 0;
      const aiMessageKey = (chatMessages.length ?? 0) + 1;

      setChatMessages((prevChatHistory) => [
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

      setChatMessages((prevChatHistory) => [
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
      const PreferredModelType = localStorage.getItem("preferred-model-type");
      const PreferredCloudModel = localStorage.getItem("preferred-cloud-model");
      const PreferredPrivateModel = localStorage.getItem(
        "preferred-private-model"
      );

      window.ipcRenderer.send("request-to-server", {
        request_type: "user-input",
        preferred_model_type: PreferredModelType,
        preferred_model:
          PreferredModelType === "Cloud LLM"
            ? PreferredCloudModel
            : PreferredPrivateModel,
        prompt: PreferredPrompt,
        user_query: inputText,
      });

      // Handle AI response from backend
      window.ipcRenderer.once("server-response", (_, response) => {
        const MessageContent = response["error_occurred"]
          ? `**${response["error"]}**\nTry again :(`
          : response["response"]["content"];

        setChatMessages((prevChatHistory) => [
          ...prevChatHistory.slice(0, -1),
          {
            key: aiMessageKey,
            element: [
              aiMessageKey,
              "ai",
              MessageContent,
              <AiMsgBubble
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

      setUserInputText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "50px"; // Reset textarea height
      }
    }
  };

  //
  // Auto-scroll effect for chat messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages.length]);

  //
  // Log message into the database
  const LogMessageToDatabase = (id: number, role: string, msgText: string) => {
    if (currentSessionIdRef.current == null) {
      currentSessionIdRef.current = generateUUID();
      if (currentSessionIdRef.current != null) {
        startNewSession(currentSessionIdRef.current, "New Session");
        addMsgToSession(currentSessionIdRef.current, id, role, msgText);
      }
    } else {
      addMsgToSession(currentSessionIdRef.current, id, role, msgText);
    }
  };

  // --------------------------------------------------- //
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.subPageContainer}>
          {subPageContext?.subPage === "/profile" ? (
            <Profile />
          ) : subPageContext?.subPage === "/history" ? (
            <ChatHistory />
          ) : subPageContext?.subPage === "/about" ? (
            <AboutUs />
          ) : subPageContext?.subPage === "/settings" ? (
            <Settings />
          ) : null}
        </div>
        <div className={styles.chatContainer}>
          <Header title="PINAC" subPage={false} clearChat={InitializeNewChat} />
          <StopTextGeneration.Provider
            value={{ stop: isStop, setStop: setIsStop }}
          >
            <div className={styles.msgBox}>
              {isWelcomeTextVisible && <WelcomeText />}
              {chatMessages.map((item) => item.element[3])}
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
    </>
  );
};
