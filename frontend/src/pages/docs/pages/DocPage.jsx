import { useParams } from "react-router-dom";
import docs from "../data";
import DocRenderer from "../components/DocRenderer";

export default function DocPage() {
  const { topic, section } = useParams();
  const doc = docs[topic];

  if (!doc) return <h2>Topic not found</h2>;

  const sections = section
    ? doc.sections.filter(s => s.id === section)
    : doc.sections;

  return (
    <>
      {sections.map(sec => (
        <section key={sec.id}>
          <h2>{sec.title}</h2>
          <DocRenderer content={sec.content} />
        </section>
      ))}
    </>
  );
}
