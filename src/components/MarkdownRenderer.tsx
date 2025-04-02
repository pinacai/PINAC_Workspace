//@ts-nocheck
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStopTextGeneration } from "../context/StopTextGeneration";

// Icons
import { FiCopy } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

interface LiveMarkdownRendererProps {
  text: string;
  setButtonsDisabled?: React.Dispatch<React.SetStateAction<boolean>> | null;
}

export const LiveMarkdownRenderer: React.FC<LiveMarkdownRendererProps> = ({
  text,
  setButtonsDisabled,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { stop, setStop } = useStopTextGeneration();
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const delay = 10;

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle typing effect for the entire Markdown content
  useEffect(() => {
    if (currentIndex >= text.length - 5) {
      setButtonsDisabled ? setButtonsDisabled(false) : null;
    }
    if (stop) {
      setButtonsDisabled ? setButtonsDisabled(false) : null;
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
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  showLineNumbers
                  customStyle={{
                    margin: "0",
                    fontSize: "0.9rem",
                    borderRadius: "0",
                  }}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
                <div className="w-full pr-3 flex justify-end bg-tertiary-dark">
                  <CopyToClipboard text={String(children)} onCopy={handleCopy}>
                    <button className="m-0.5 px-1.5 py-0.5 flex text-gray-200 hover:bg-zinc-600 rounded-lg cursor-pointer">
                      <span className="flex items-center justify-center mr-1">
                        {isCopied ? (
                          <FaCheck className="size-3" />
                        ) : (
                          <FiCopy className="size-3" />
                        )}
                      </span>
                      <span className="text-sm">
                        {isCopied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </CopyToClipboard>
                </div>
              </>
            ) : (
              <code className={`inline-code ${className || ""}`} {...props}>
                {children}
              </code>
            );
          },
          // Customize other elements as needed
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl mt-5 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => <p className="" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-3" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-3" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic my-3"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {currentText}
      </ReactMarkdown>
    </div>
  );
};

//    ================================================     //
interface MarkdownRendererProps {
  text: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                customStyle={{
                  margin: "0",
                  padding: "0",
                  fontSize: "0.9rem",
                  borderRadius: "0",
                }}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={`inline-code ${className || ""}`} {...props}>
                {children}
              </code>
            );
          },
          // Customize other elements as needed
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl mt-5 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => <p className="" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-3" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-3" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic my-3"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
