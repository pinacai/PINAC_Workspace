import React, { useState, useRef, useContext, useEffect } from "react";
import { IpcRendererEvent } from "electron";
import { Sidebar } from "../features/sidebar";
import { GreetingText } from "../components/GreetingText";
import { AiMsgBubble, AiLoader } from "../features/messageBubble/AiBubble";
import { UserMsgBubble } from "../features/messageBubble/UserBubble";
import { ChatInput } from "../features/chatInput";
import { startNewSession, addMsgToSession } from "../database/db";

// context
import { ChatMsgContext } from "../context/ChatMsg";
import { WelcomeTextContext } from "../context/WelcomeText";
import { ModelSettingsContext } from "../context/ModelSettings";
import { WebSearchContext } from "../context/WebSearch";
import { AttachmentContext } from "../context/Attachment";
import { StopTextGeneration } from "../context/StopTextGeneration";

const HomePage: React.FC = () => {
  const welcomeTextContext = useContext(WelcomeTextContext);
  const chatContext = useContext(ChatMsgContext);
  const modelContext = useContext(ModelSettingsContext);
  const webSearchContext = useContext(WebSearchContext);
  const attachmentContext = useContext(AttachmentContext);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [userInputText, setUserInputText] = useState<string>("");
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
  const [isStop, setIsStop] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to start a new chat
  // --------------------------------
  const InitializeNewChat = () => {
    chatContext?.setChatMsg([]);
    chatContext?.setCurrentSessionId(null);
    welcomeTextContext?.setIsWelcomeTextVisible(true);
    setButtonsDisabled(false);
    if (attachmentContext?.setUsingAttachment) {
      attachmentContext?.setUsingAttachment(false);
      attachmentContext?.setAttachment(null);
    }
    setUserInputText("");
  };

  // Getting currently usedAI Model name
  // ----------------------
  const getModelName = () => {
    return modelContext?.modelType === "Pinac CLoud Model"
      ? modelContext?.pinacCloudModel
      : modelContext?.ollamaModel || "";
  };

  // Function to handle sending user input
  // -------------------------------------
  const SubmitUserInput = (inputText: string) => {
    if (/\S/.test(userInputText)) {
      setButtonsDisabled(true);
      welcomeTextContext?.setIsWelcomeTextVisible(false);

      const userMessageKey = chatContext?.chatMsg.length ?? 0;
      const aiMessageKey = (chatContext?.chatMsg.length ?? 0) + 1;

      // --- Attachment Handling ---
      let attachmentName: string | undefined = undefined;
      let attachmentUsedInThisMessage = false;

      // Check if an attachment exists and is being used for the first time in this interaction
      if (attachmentContext?.attachment && !attachmentContext.usingAttachment) {
        attachmentName = attachmentContext.attachment.name;
        attachmentUsedInThisMessage = true; // Mark that attachment is used for this message bubble
      }
      // --- End Attachment Handling ---

      chatContext?.setChatMsg((prevChatHistory) => [
        ...prevChatHistory,
        {
          key: userMessageKey,
          element: [
            userMessageKey,
            "user",
            inputText,
            <UserMsgBubble
              response={inputText}
              attachment={attachmentName}
              key={userMessageKey}
            />,
          ],
        },
      ]);

      LogMessageToDatabase(
        userMessageKey,
        "user",
        inputText,
        attachmentUsedInThisMessage ? attachmentName : undefined
      );

      chatContext?.setChatMsg((prevChatHistory) => [
        ...prevChatHistory,
        {
          key: aiMessageKey,
          element: [
            aiMessageKey,
            "aiLoader",
            "",
            <AiLoader key={aiMessageKey} modelName={getModelName()} />,
          ],
        },
      ]);

      // Mark the attachment as 'in use
      if (
        attachmentUsedInThisMessage &&
        attachmentContext?.setUsingAttachment
      ) {
        attachmentContext.setUsingAttachment(true);
      }

      // Start streaming response with fetch based on model type
      if (modelContext?.modelType === "Pinac CLoud Model") {
        // if (modelContext?.webSearch) {
        //   fetchWebSearchResponse(aiMessageKey, inputText);
        // } else {
        fetchCloudLLMResponse(aiMessageKey, inputText);
        // }
      } else {
        fetchPrivateLLMResponse(aiMessageKey, inputText);
      }

      // clearing everything
      setUserInputText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "50px"; // Reset textarea height
      }
    }
  };

  // Function to fetch streaming response from Cloud server
  // ------------------------------------------------------
  const fetchCloudLLMResponse = async (
    aiMessageKey: number,
    inputText: string
  ) => {
    let responseText = "";
    let hasProcessedAnyData = false;

    // Define cleanup function first
    const cleanupListeners = () => {
      window.ipcRenderer.removeListener("cloud-ai-stream-chunk", chunkListener);
      window.ipcRenderer.removeListener("cloud-ai-stream-done", doneListener);
      window.ipcRenderer.removeListener("cloud-ai-stream-error", errorListener);
    };

    // Define listeners
    const chunkListener = (_event: IpcRendererEvent, chunk: string) => {
      // Safety check to ensure chunk is a string
      if (typeof chunk !== "string") {
        console.error("Received non-string chunk:", chunk);
        return;
      }

      const trimmedChunk = chunk.trim();
      // Skip empty chunks
      if (trimmedChunk.length === 0) return;

      if (trimmedChunk.startsWith("data:")) {
        const dataStr = trimmedChunk.substring(5).trim();

        // Skip the [DONE] marker
        if (dataStr === "[DONE]") return;
        try {
          const parsedData = JSON.parse(dataStr);

          // Handle the response chunk - looking for the response field
          if (parsedData.response !== undefined) {
            responseText += parsedData.response;
            hasProcessedAnyData = true;
            updateAIResponse(aiMessageKey, responseText, false);
          }
        } catch (parseError) {
          console.error("Failed to parse data:", dataStr, parseError);
        }
      } else {
        console.log("Received non-data chunk:", trimmedChunk);
      }
    };

    const doneListener = () => {
      if (hasProcessedAnyData) {
        updateAIResponse(aiMessageKey, responseText, true);
        LogMessageToDatabase(aiMessageKey, "ai", responseText);
      } else {
        updateAIResponse(
          aiMessageKey,
          "**Error: No valid content received**\nTry again :(",
          true
        );
      }
      cleanupListeners(); // Use the defined cleanup function
      setButtonsDisabled(false);
    };

    const errorListener = (_event: any, errorMsg: any) => {
      console.error("Stream error:", errorMsg);
      updateAIResponse(
        aiMessageKey,
        `**Error: ${errorMsg}**\nTry again :(`,
        true
      );
      cleanupListeners(); // Use the defined cleanup function
      setButtonsDisabled(false);
    };

    try {
      // Ensure any previous listeners are removed before adding new ones
      window.ipcRenderer.removeAllListeners("cloud-ai-stream-chunk");
      window.ipcRenderer.removeAllListeners("cloud-ai-stream-done");
      window.ipcRenderer.removeAllListeners("cloud-ai-stream-error");

      // Register the listeners for the current request
      window.ipcRenderer.on("cloud-ai-stream-chunk", chunkListener);
      window.ipcRenderer.on("cloud-ai-stream-done", doneListener);
      window.ipcRenderer.on("cloud-ai-stream-error", errorListener);

      // Start the stream
      await window.ipcRenderer.invoke("fetch-cloud-ai-stream", inputText);
    } catch (error) {
      console.error("Cloud AI request error:", error);
      updateAIResponse(
        aiMessageKey,
        `**Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }**\nTry again :(`,
        true
      );
      setButtonsDisabled(false);
      cleanupListeners();
    }
  };

  // Function to fetch streaming response from Ollama from backend
  // -------------------------------------------------------------
  const fetchPrivateLLMResponse = async (
    aiMessageKey: number,
    inputText: string
  ) => {
    let responseText = "";
    const apiUrl = "http://localhost:5000/api/chat/ollama/stream";

    const requestData = {
      prompt: inputText,
      model: modelContext?.ollamaModel,
      ...(attachmentContext?.attachment && {
        rag: true,
        documents_path: attachmentContext.attachment.path,
      }),
      ...(webSearchContext?.webSearch && {
        web_search: true,
        quick_search: webSearchContext.quickSearch,
        better_search: webSearchContext.betterSearch,
      }),
    };

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
      if (error instanceof Error) {
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
    }
  };

  // Function to update AI response in the chat context
  // --------------------------------------------------
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
              modelName={getModelName()}
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
  // ----------------------------------------------
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
  // -----------------------------
  const LogMessageToDatabase = (
    id: number,
    role: string,
    msgText: string,
    attachmentName?: string // Add optional attachmentName parameter
  ) => {
    let currentSessionId = chatContext?.getCurrentSessionId() ?? null;
    if (currentSessionId == null) {
      // Generate a unique ID for the new session
      const newSessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      chatContext?.setCurrentSessionId(newSessionId);
      currentSessionId = newSessionId; // Use the newly generated ID

      if (currentSessionId != null) {
        startNewSession(currentSessionId, msgText.slice(0, 50));
        addMsgToSession(
          currentSessionId,
          id,
          role,
          msgText,
          getModelName(),
          attachmentName
        );
      }
    } else {
      addMsgToSession(
        currentSessionId,
        id,
        role,
        msgText,
        getModelName(),
        attachmentName
      );
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
        clearChat={InitializeNewChat}
      />
      <div
        className={`${
          isSidebarExpanded
            ? "w-min-main-body lg:w-max-main-body"
            : "w-main-body"
        }
        w-full h-full flex justify-start items-center
        bg-primary dark:bg-primary-dark rounded-xl transition-all duration-300`}
      >
        <div
          className={`
            ${
              !welcomeTextContext?.isWelcomeTextVisible
                ? "h-body-with-margin-b"
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
