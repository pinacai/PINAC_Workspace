import React, { useState, useRef, useContext, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { GreetingText } from "../components/GreetingText";
import { Header } from "../features/header/index";
import { AiMsgBubble, AiLoader } from "../features/chatMessage/AiMsgBubble";
import { UserMsgBubble } from "../features/chatMessage/UserMsgBubble";
import { ChatInput } from "../features/chatInput";
import { StopTextGeneration } from "../context/StopTextGeneration";
import { startNewSession, addMsgToSession } from "../database/db";

// context
import { ChatMsgContext } from "../context/ChatMsg";
import { WelcomeTextContext } from "../context/WelcomeText";
import { ModelSettingsContext } from "../context/ModelSettings";
import { AttachmentContext } from "../context/Attachment";

const HomePage: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const welcomeTextContext = useContext(WelcomeTextContext);
  const chatContext = useContext(ChatMsgContext);
  const llmContext = useContext(ModelSettingsContext);
  const attachmentContext = useContext(AttachmentContext);
  const [userInputText, setUserInputText] = useState<string>("");
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
  const [isStop, setIsStop] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

      // Create request payload for the streaming API
      const requestData = {
        prompt: inputText,
        model: llmContext?.ollamaModelName,
      };

      // Start streaming response with fetch
      fetchStreamResponse(aiMessageKey, requestData);

      // clearing everything
      attachmentContext?.setAttachment(null);
      setUserInputText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "50px"; // Reset textarea height
      }
    }
  };

  // Function to fetch streaming response from backend
  const fetchStreamResponse = async (
    aiMessageKey: number,
    requestData: any
  ) => {
    let responseText = "";
    const apiUrl = "http://localhost:5000/api/chat/ollama/stream";

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        signal: signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      // Get the response as a readable stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get stream reader");
      }

      // Set up a TextDecoder to decode the stream chunks
      const decoder = new TextDecoder();

      let isDone = false;
      while (!isDone && !signal.aborted) {
        const { value, done } = await reader.read();

        if (done) {
          // Stream has ended
          isDone = true;
          setButtonsDisabled(false);
          break;
        }

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });

        // Process SSE format - each event starts with "data: "
        const eventChunks = chunk.split("\n\n");

        for (const eventChunk of eventChunks) {
          if (eventChunk.startsWith("data: ")) {
            try {
              const eventData = JSON.parse(eventChunk.substring(6));

              if (eventData.error) {
                responseText = `**Error: ${eventData.error}**\nTry again :(`;
                updateAIResponse(aiMessageKey, responseText, true);
                isDone = true;
                break;
              }

              // Append new content to the response text
              responseText += eventData.content;

              // Update the UI with the current accumulated response
              updateAIResponse(aiMessageKey, responseText, eventData.done);

              // Check if this is the last chunk
              if (eventData.done) {
                isDone = true;
                LogMessageToDatabase(aiMessageKey, "ai", responseText);
                setButtonsDisabled(false);
                break;
              }
            } catch (parseError) {
              console.error(
                "Failed to parse event data:",
                parseError,
                "Raw data:",
                eventChunk
              );
            }
          }
        }
      }

      // If stream ended or was aborted
      if (isDone || signal.aborted) {
        reader.cancel();
      }
    } catch (error) {
      console.error("Stream request error:", error);
      // Display error message only if it's not an aborted request
      if (error.name !== "AbortError") {
        updateAIResponse(
          aiMessageKey,
          `**Error: ${error.message}**\nTry again :(`,
          true
        );
      }
      setButtonsDisabled(false);
    }
  };

  // Function to update AI response in the chat context
  const updateAIResponse = (
    messageKey: number,
    content: string,
    isDone: boolean
  ) => {
    chatContext?.setChatMsg((prevChatHistory) => {
      // Create a new array with all previous messages
      const newHistory = [...prevChatHistory];

      // Find the index of the AI message we want to update
      const messageIndex = newHistory.findIndex(
        (msg) => msg.key === messageKey
      );

      // If found, update that message
      if (messageIndex !== -1) {
        newHistory[messageIndex] = {
          key: messageKey,
          element: [
            messageKey,
            "ai",
            content,
            <AiMsgBubble
              live={!isDone}
              response={content}
              setButtonsDisabled={isDone ? setButtonsDisabled : undefined}
              key={messageKey}
            />,
          ],
        };
      }

      return newHistory;
    });
  };

  // Clean up abort controller on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Effect to handle stopping text generation
  useEffect(() => {
    if (isStop && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setButtonsDisabled(false);
      setIsStop(false);
    }
  }, [isStop]);

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

  // Auto-scroll effect for chat messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatContext?.chatMsg.length]);

  // --------------------------------------------------- //
  return (
    <div className="w-full h-screen flex">
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />
      <div
        className={`${
          isSidebarExpanded
            ? "w-min-main-body lg:w-max-main-body"
            : "w-main-body"
        }
        w-full h-full flex flex-col justify-start items-center
        bg-primary dark:bg-primary-dark rounded-xl transition-all duration-300`}
      >
        <Header title="PINAC" page="home" clearChat={InitializeNewChat} />
        <div
          className={`
            ${
              !welcomeTextContext?.isWelcomeTextVisible
                ? "h-body-without-header"
                : "h-full"
            }
            w-full flex flex-col justify-center items-center`}
        >
          <div
            className={
              !welcomeTextContext?.isWelcomeTextVisible
                ? "w-full h-full flex flex-col justify-start items-center"
                : "w-full"
            }
          >
            <StopTextGeneration.Provider
              value={{ stop: isStop, setStop: setIsStop }}
            >
              <div className="msgBox">
                {welcomeTextContext?.isWelcomeTextVisible && <GreetingText />}
                {chatContext?.chatMsg.map((item) => item.element[3])}
                <div ref={scrollRef} />
              </div>
            </StopTextGeneration.Provider>
            <ChatInput
              userInput={userInputText}
              setUserInput={setUserInputText}
              buttonsDisabled={buttonsDisabled}
              setButtonsDisabled={setButtonsDisabled}
              textareaRef={textareaRef}
              submit={SubmitUserInput}
              setStop={setIsStop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
