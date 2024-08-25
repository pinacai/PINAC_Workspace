import React, { useState, useContext, useEffect, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../features/header/index";
import { WelcomeText } from "../features/welcomeText/index";
import { AiMsgBubble, AiLoader } from "../features/msgBubble/AiMsgBubble";
import UserMsgBubble from "../features/msgBubble/UserMsgBubble";
import { InputPanel } from "../features/inputPanel/index";
import { ChatContext } from "../context/Chat";
import { StopTextGeneration } from "../context/StopTextGeneration";
import { SubPageContext } from "../context/SubPage";
import styles from "./styles/Home.module.css";

// sub-pages
import AboutUs from "../features/aboutUs/index";
import Settings from "../features/settings/index";
import Profile from "../features/profile/index";

export const HomePage: React.FC = () => {
  const subPageContext = useContext(SubPageContext);
  const chatContext = useContext(ChatContext);
  const [welcomeText, setWelcomeText] = useState<boolean>(true);
  const [userInput, setUserInput] = useState<string>(""); // Declare state for input value
  const [isUserInputActive, setUserInputActive] = useState<boolean>(false); // Declare state for input value
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false); // For disabling send button
  const [stop, setStop] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // Scroll to the bottom whenever messages change

  //
  const startNewChat = () => {
    chatContext?.setChatMsg([]);
    window.ipcRenderer.send("request-to-backend", {
      request_type: "clear-chat",
    });
    setWelcomeText(true);
    setButtonsDisabled(false);
    setUserInput("");
  };

  //
  // Actions after clicking send button or pressing Enter
  const submit = (text: string) => {
    if (/\S/.test(userInput)) {
      setButtonsDisabled(true);
      setWelcomeText(false);

      const userMessageKey = `user-${chatContext?.chat.length ?? 0}`;
      const aiMessageKey = `ai-${(chatContext?.chat.length ?? 0) + 1}`;
      const aiLoaderMessageKey = `aiLoader-${(chatContext?.chat.length ?? 0) + 1}`;

      chatContext?.setChatMsg((prevChatHistory) => [
        ...prevChatHistory,
        {
          key: userMessageKey,
          element: [
            userMessageKey,
            "user",
            text,
            <UserMsgBubble response={text} key={userMessageKey} />,
          ],
        },
      ]);

      chatContext?.setChatMsg((prevChatHistory) => [
        ...prevChatHistory,
        {
          key: aiLoaderMessageKey,
          element: [
            aiLoaderMessageKey,
            "aiLoader",
            "",
            <AiLoader key={aiLoaderMessageKey} />,
          ],
        },
      ]);

      const preferredPrompt = localStorage.getItem("applied-prompt");
      const preferredModelType = localStorage.getItem("preferred-model-type");
      const preferredCloudModel = localStorage.getItem("preferred-cloud-model");
      const preferredPrivateModel = localStorage.getItem(
        "preferred-private-model"
      );
      window.ipcRenderer.send("request-to-server", {
        request_type: "user-input",
        preferred_model_type: preferredModelType,
        preferred_model:
          preferredModelType === "Cloud LLM"
            ? preferredCloudModel
            : preferredPrivateModel,
        prompt: preferredPrompt,
        user_query: text,
      });

      // fetching AI response from backend
      window.ipcRenderer.once("server-response", (_, response) => {
        if (response["error_occurred"]) {
          chatContext?.setChatMsg((prevChatHistory) => [
            ...prevChatHistory.slice(0, -1),
            {
              key: aiMessageKey,
              element: [
                aiMessageKey,
                "ai",
                "Error Occurred",
                <AiMsgBubble
                  response={`**${response["error"]}**\nTry again :(`}
                  setButtonsDisabled={setButtonsDisabled}
                  key={aiMessageKey}
                />,
              ],
            },
          ]);
        } else {
          chatContext?.setChatMsg((prevChatHistory) => [
            ...prevChatHistory.slice(0, -1),
            {
              key: aiMessageKey,
              element: [
                aiMessageKey,
                "ai",
                response["response"]["content"],
                <AiMsgBubble
                  response={response["response"]["content"]}
                  setButtonsDisabled={setButtonsDisabled}
                  key={aiMessageKey}
                />,
              ],
            },
          ]);
        }
      });

      setUserInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "50px"; // Reset textarea height
      }
    }
  };

  //
  // for auto scrolling
  useEffect(() => {
    if (chatContext?.chat.length) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatContext?.chat.length]);

  // --------------------------------------------------- //
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.subPageContainer}>
          {subPageContext?.subPage === "/profile" ? (
            <Profile />
          ) : subPageContext?.subPage === "/about" ? (
            <AboutUs />
          ) : subPageContext?.subPage === "/settings" ? (
            <Settings />
          ) : null}
        </div>
        <div className={styles.chatContainer}>
          <Header title="PINAC" subPage={false} clearChat={startNewChat} />
          <StopTextGeneration.Provider value={{ stop, setStop }}>
            <div className={styles.msgBox}>
              {welcomeText && <WelcomeText />}
              {chatContext?.chat.map((item) => item.element[3])}
              <div ref={scrollRef} />
            </div>
          </StopTextGeneration.Provider>

          <InputPanel
            userInput={userInput}
            setUserInput={setUserInput}
            isUserInputActive={isUserInputActive}
            setUserInputActive={setUserInputActive}
            buttonsDisabled={buttonsDisabled}
            setButtonsDisabled={setButtonsDisabled}
            textareaRef={textareaRef}
            submit={submit}
            setStop={setStop}
          />
        </div>
      </div>
    </>
  );
};
