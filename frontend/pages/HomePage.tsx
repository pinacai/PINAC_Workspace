import "./style/HomePage.css";
import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { ShowHumanMessage, ShowAiMessage } from "../components/MessageViewer";
import {StopContext} from "../components/context_file";
import { FaRegStopCircle } from "react-icons/fa";
// Icons
import sendIcon from "../assets/icon/send.svg";

export const HomePage: React.FC = () => {
  const [welcomeBox, setWelcomeBox] = useState<JSX.Element>(
    <div className="welcome-text-row">
      <div className="welcome-text">
        Hello,
        <br />
        How can I help you today ?
      </div>
    </div>
  );
  const [messages, setMessages] = useState<JSX.Element[]>([]); // For showing conversation bubbles
  const [userInput, setUserInput] = useState<string>(""); // Declare state for input value
  const [isUserInputActive, setUserInputActive] = useState<boolean>(false); // Declare state for input value
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false); // For disabling send button
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [stop,setStop] = useState<boolean>(false); 

  // Handles changes in user input
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

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
  const clearChat = () => {
    setMessages([]);
    window.ipcRenderer.send("client-request", ["clear-history"]);
    setWelcomeBox(
      <div className="welcome-text-row">
        <div className="welcome-text">
          Hello,
          <br />
          How can I help you today ?
        </div>
      </div>
    );
  };

  //
  // Actions after clicking send button or pressing Enter
  const submit = (text: string) => {
    if (/\S/.test(userInput)) {
      setButtonsDisabled(true);
      if (welcomeBox !== <></>) {
        setWelcomeBox(<></>);
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        <ShowHumanMessage
          key={`human-message-${prevMessages.length}`}
          response={text}
        />,
      ]);
      const preferredModel = localStorage.getItem("preferred-model");
      window.ipcRenderer.send("client-request", {
        "request-type": "user-input",
        "preferred-model": preferredModel,
        "user-query": text,
      });
      setMessages((prevMessages) => [...prevMessages, <ShowAiMessage key={`ai-message-${prevMessages.length}`} setButtonsDisabled={setButtonsDisabled} />]);
      setUserInput("");
      // setButtonsDisabled(false);
    }
  };

    // Scroll to the bottom whenever messages change
    const scrollRef = useRef<any>(null); // Ref for empty Div to server as end of messages

    useEffect(() => {
      if (messages.length) {
        scrollRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, [messages.length]); 

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
  }, []);

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
      "Cyber_Tech_01-dark"
    );
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`);
  });

  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="PINAC" clearChat={clearChat} />
        <div className="chat-container">
          <StopContext.Provider value={{stop,setStop}}>
            <div className="msg-box" >
              {welcomeBox}
              {messages}
              <div ref={scrollRef} />
            </div>
          </StopContext.Provider>

          <div className="input-box">
            <div
              className={`input-group ${isUserInputActive ? "active" : ""}`}
              onFocus={() => setUserInputActive(true)}
              onBlur={() => setUserInputActive(false)}
            >
              <textarea
                id="user-input"
                className={buttonsDisabled ? "disabled" : ""}
                value={userInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Tell me your task..."
                disabled={buttonsDisabled}
                ref={textareaRef}
                required
              />
              <div className="input-group-append">
                {
                  !buttonsDisabled ? 
                    <button
                      id="submit-btn"
                      className={buttonsDisabled ? "disabled" : ""}
                      onClick={() =>
                        userInput !== undefined ? submit(userInput) : {}
                      }
                      disabled={buttonsDisabled}
                    >
                      <img
                        src={sendIcon}
                        alt="Submit"
                        className="submit-icon changeable-icon"
                      />
                    </button>
                  :
                    <button
                      onClick={() => setStop(true)} 
                      className="stop-icon"
                    >
                      <FaRegStopCircle size={25}/>
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
