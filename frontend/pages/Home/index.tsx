import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { WelcomeText } from "./components/WelcomeText";
import { ShowAiMessage } from "./components/AiMsgBubble";
import { UserMsgBubble } from "./components/UserMsgBubble";
import { InputPanel } from "./components/InputPanel";
import { StopTextGeneration } from "./context/StopTextGeneration";
import styles from "./style/index.module.css";

export const HomePage: React.FC = () => {
  const [welcomeText, setWelcomeText] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<JSX.Element[]>([]);
  const [userInput, setUserInput] = useState<string>(""); // Declare state for input value
  const [isUserInputActive, setUserInputActive] = useState<boolean>(false); // Declare state for input value
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false); // For disabling send button
  const [stop, setStop] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // Scroll to the bottom whenever messages change

  //
  const startNewChat = () => {
    setChatHistory([]);
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

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        <UserMsgBubble response={text} key={`user-${chatHistory.length}`} />,
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
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        <ShowAiMessage
          key={`ai-${chatHistory.length + 1}`}
          setButtonsDisabled={setButtonsDisabled}
        />,
      ]);
      setUserInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "50px"; // Reset textarea height
      }
    }
  };

  //
  // for auto scrolling
  useEffect(() => {
    if (chatHistory.length) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatHistory.length]);

  //
  //
  // For smooth applying of current theme
  useEffect(() => {
    const body = document.body;
    const preferredTheme = localStorage.getItem("preferred-theme");
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");

    // Remove all theme classes first
    body.classList.remove(
      "Dawn_n_Dusk-light",
      "Dawn_n_Dusk-dark",
      "Cyber_Tech_01-light",
      "Cyber_Tech_01-dark",
      "Aesthetics_Unbound-light",
      "Aesthetics_Unbound-dark"
    );
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`);
  });

  // --------------------------------------------------- //
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <Header title="PINAC" clearChat={startNewChat} />
        <div className={styles.chat_container}>
          <StopTextGeneration.Provider value={{ stop, setStop }}>
            <div className={styles.msg_box}>
              {welcomeText && <WelcomeText />}
              {chatHistory}
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
