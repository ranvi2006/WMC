export default function DocRenderer({ content }) {
  return (
    <>
      {content.map((block, i) => {
        switch (block.type) {
          case "text":
            return <p key={i}>{block.value}</p>;
          case "heading":
            const H = `h${block.level || 2}`;
            return <H key={i}>{block.value}</H>;
          case "code":
            return (
              <pre key={i}>
                <code>{block.value}</code>
              </pre>
            );
          case "list":
            return (
              <ul key={i}>
                {block.value.map((v, j) => (
                  <li key={j}>{v}</li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
