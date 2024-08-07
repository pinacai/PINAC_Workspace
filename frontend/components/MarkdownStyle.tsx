import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStopTextGeneration } from "../context/StopTextGeneration";
import styles from "./styles/MarkdownStyle.module.css";

interface MarkdownStyleProps {
  text: string;
  setButtonsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SyntaxHighlight = ({ children, code, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <SyntaxHighlighter
        style={nightOwl}
        language="javascript"
        showLineNumbers
        customStyle={{
          padding: "1rem",
          borderRadius: "5px 5px 0 0",
          fontSize: "1rem",
          margin: "0",
        }}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
      <div className={styles.copy_btn_container}>
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <button className={styles.copyButton}>
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </CopyToClipboard>
      </div>
    </>
  );
};

export const MarkdownStyle: React.FC<MarkdownStyleProps> = ({
  text,
  setButtonsDisabled,
}) => {
  const { stop, setStop } = useStopTextGeneration();
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const delay = 10;

  //
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
  }, [currentIndex, delay]);

  return (
    <div className={styles.markdownText}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            if (className?.includes("language-")) {
              return <SyntaxHighlight code={children?.toString()}>{children}</SyntaxHighlight>;
            }
            return (
              <code {...props} className={styles.inlineCode}>
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
