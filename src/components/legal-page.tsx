import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LegalPage({
  title,
  content,
}: {
  /** Rendered inside the markdown content's own H1 — kept as a prop for call-site clarity. */
  title?: string;
  content: string;
}) {
  void title;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-lg prose-neutral max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
