// export default function DocRenderer({ content }) {
//   return (
//     <>
//       {content.map((block, i) => {
//         switch (block.type) {
//           case "text":
//             return <p key={i}>{block.value}</p>;
//           case "heading":
//             const H = `h${block.level || 2}`;
//             return <H key={i}>{block.value}</H>;
//           case "code":
//             return (
//               <pre key={i}>
//                 <code>{block.value}</code>
//               </pre>
//             );
//           case "list":
//             return (
//               <ul key={i}>
//                 {block.value.map((v, j) => (
//                   <li key={j}>{v}</li>
//                 ))}
//               </ul>
//             );
//           default:
//             return null;
//         }
//       })}
//     </>
//   );
// }
export default function DocRenderer({ content }) {
  return (
    <>
      {content.map((block, i) => {
        switch (block.type) {

          /* BASIC TEXT */
          case "text":
          case "paragraph":
            return <p key={i}>{block.value}</p>;

          /* HEADINGS */
          case "heading": {
            const H = `h${block.level || 2}`;
            return <H key={i}>{block.value}</H>;
          }

          /* CODE BLOCK */
          case "code":
            return (
              <pre key={i}>
                <code>{block.value}</code>
              </pre>
            );

          /* LIST */
          case "list":
            return (
              <ul key={i}>
                {block.value.map((v, j) => (
                  <li key={j}>{v}</li>
                ))}
              </ul>
            );

          /* DIVIDER */
          case "divider":
            return <hr key={i} />;

          /* CALLOUT BOX */
          case "callout":
            return (
              <div key={i} className={`doc-callout ${block.variant || "info"}`}>
                {block.value}
              </div>
            );

          /* STEP CARD */
          case "step":
            return (
              <div key={i} className="doc-step">
                <h3>
                  Step {block.step_no}: {block.title}
                </h3>
                <p>{block.description}</p>

                {block.code && (
                  <pre>
                    <code>{block.code}</code>
                  </pre>
                )}

                {block.where_used && (
                  <small>
                    <strong>Where used:</strong> {block.where_used}
                  </small>
                )}
              </div>
            );

          /* IMAGE SUPPORT */
          case "image":
            return (
              <figure key={i} className="doc-image">
                <img
                  src={block.src}
                  alt={block.alt || ""}
                  loading="lazy"
                />
                {block.caption && (
                  <figcaption>{block.caption}</figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

