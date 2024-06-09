import { useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "./style/MarkdownStyle.css";

interface MarkdownStyleProps {
  text: string;
}

export const MarkdownStyle: React.FC<MarkdownStyleProps> = (props) => {
  // for syntax highlighting
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <p className="markdownText">
      <Markdown remarkPlugins={[remarkGfm]}>{props.text}</Markdown>
    </p>
  );
};
