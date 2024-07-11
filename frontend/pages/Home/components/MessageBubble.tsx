import React, { useState, useEffect, useRef } from "react";
import { MarkdownStyle } from "./MarkdownStyle";
import "../style/MessageBubble.css";

// Icons
import userIcon from "../../../assets/icon/user_icon.png";
import pinacLogo from "../../../assets/icon/pinac-logo.png";

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
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatScrollRef = useRef<any>(null);

  const copyToClipboard = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(props.response)
        .then(() => {
          const copyBtn = document.querySelector(".copy-btn");
          if (copyBtn) {
            copyBtn.classList.add("animate");
            setTimeout(() => {
              copyBtn.classList.remove("animate");
            }, 1000);
          }
        })
        .catch((error) => {
          console.error("Failed to copy:", error);
        });
    }
  };

  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
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
            <MarkdownStyle
              text={props.response}
              setButtonsDisabled={setButtonsDisabled}
              chatScrollRef={chatScrollRef}
            />
          </div>
          <div className="ai-msg-copy-btn">
            <button className="copy-btn" onClick={() => copyToClipboard()}>
              copy
            </button>
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
  );

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
