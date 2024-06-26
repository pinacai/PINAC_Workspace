import React, { useState, useEffect, useRef } from "react";
import { MarkdownStyle } from "../components/MarkdownStyle";
import { useStopContext } from "./context_file";
import "./style/MessageViewer.css";

// Icons
import userIcon from "../assets/icon/user_icon.png";
import pinacLogo from "../assets/icon/pinac-logo.png";

//
interface ShowAiMessageProps {
  setButtonsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowAiMessage: React.FC<ShowAiMessageProps> = ({
  setButtonsDisabled,
}) => {
  const [message, setMessage] = useState(<AiLoader />);

  window.ipcRenderer.once("server-response", (_, response) => {
    if (response["error_occurred"]) {
      setMessage(
        <AiMessage
          response={`**${response["error"]}**\nTry again :(`}
          setButtonsDisabled={setButtonsDisabled}
        />
      );
    } else {
      setMessage(
        <AiMessage
          response={response["response"]["content"]}
          setButtonsDisabled={setButtonsDisabled}
        />
      );
    }
  });
  return <>{message}</>;
};

//
//
interface ShowHumanMessageProps {
  response: string;
}

export const ShowHumanMessage: React.FC<ShowHumanMessageProps> = (props) => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={userIcon} alt="User Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">You</div>
          <div className="msg-text human-msg">{props.response}</div>
        </div>
      </div>
    </>
  );
};

//
//
interface AiMessageProps {
  response: string;
  setButtonsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AiMessage: React.FC<AiMessageProps> = (props) => {
  const { setButtonsDisabled } = props;
  const { stop, setStop } = useStopContext();
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size
  const [currentText, setCurrentText] = useState(""); // Text state for typing effect
  const [currentIndex, setCurrentIndex] = useState(0); // Index state to emulate writing effect by displaying till certain index
  const delay = 30; // Delay for writing each character

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatScrollRef = useRef<any>(null); // Ref for empty Div to server as end of messages
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex >= props.response.length - 5) setButtonsDisabled(false);
    if (stop) {
      setButtonsDisabled(false);
      setStop(false);
    } else if (currentIndex < props.response.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + props.response[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay]); // Handle the typing effect by creating a timeout while whole string is not written

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);
  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-btn">
            <div className="msg-name">PINAC</div>
          </div>
          <div className="msg-text ai-msg">
            <MarkdownStyle text={currentText} />
          </div>
          <div className="ai-msg-copy-btn">
            <button className="copy-btn">copy</button>
          </div>
          <div ref={chatScrollRef} />
        </div>
      </div>
    </>
  );
};

//
//
// Creating a AiLoader component similar to AiMessage. message state is initialized with this loader and replaced as soon as we have the data.
export const AiLoader: React.FC = () => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-btn">
            <div className="msg-name">PINAC</div>
          </div>
          <div className="msg-text ai-msg">
            <div className="loader" />
          </div>
        </div>
      </div>
    </>
  );
};
