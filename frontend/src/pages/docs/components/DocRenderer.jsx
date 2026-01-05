import React from "react";
export default function DocRenderer({ content }) {
  return (
    <>
      {content.map((block, i) => {
        switch (block.type) {
          case "text":
            return <p key={i}>{block.value}</p>;
          case "heading":
            const HeadingTag = `h${block.level || 2}`;
            return <HeadingTag key={i}>{block.value}</HeadingTag>;
          case "code":
            return (
              <pre key={i} data-language={block.language || "javascript"}>
                <code>{block.value}</code>
              </pre>
            );
          case "list":
            return (
              <ul key={i}>
                {block.value.map((v, j) => <li key={j}>{v}</li>)}
              </ul>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
