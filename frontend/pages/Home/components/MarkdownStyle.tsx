import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStopContext } from "../context/context_file";
import "../style/MarkdownStyle.css";

interface MarkdownStyleProps {
  text: string;
  setButtonsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chatScrollRef: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SyntaxHighlight = ({ children, ...props }: any) => (
  <SyntaxHighlighter
    style={nightOwl}
    language="javascript"
    showLineNumbers
    customStyle={{
      padding: "1rem",
      borderRadius: "5px",
      fontSize: "1rem",
    }}
    {...props}
  >
    {children}
  </SyntaxHighlighter>
);

export const MarkdownStyle: React.FC<MarkdownStyleProps> = ({
  text,
  setButtonsDisabled,
  chatScrollRef,
}) => {
  const { stop, setStop } = useStopContext();
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const delay = 10;

  //
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Handle typing effect for the entire Markdown content
  useEffect(() => {
    if (currentIndex >= text.length - 5) setButtonsDisabled(false);
    if (stop) {
      setButtonsDisabled(false);
      setStop(false);
    } else if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, delay]);

  return (
    <div className="markdownText">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            if (className?.includes("language-")) {
              return <SyntaxHighlight {...props}>{children}</SyntaxHighlight>;
            }
            return (
              <code {...props} className="inlineCode">
                {children}
              </code>
            );
          },
        }}
      >
        {currentText}
      </Markdown>
    </div>
  );
};
