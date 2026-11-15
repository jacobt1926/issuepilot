import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
  className?: string;
  disableLinks?: boolean;
};

export default function MarkdownContent({
  content,
  className,
  disableLinks = false,
}: MarkdownContentProps) {
  return (
    <div className={["markdown-content", className].filter(Boolean).join(" ")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, children, ...props }) =>
            disableLinks ? (
              <span>{children}</span>
            ) : (
              <a {...props} target="_blank" rel="noreferrer">
                {children}
              </a>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
