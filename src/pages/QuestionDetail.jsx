import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getQuestion, getSubmissions } from "../api";

function formatSize(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([getQuestion(id), getSubmissions(id)])
      .then(([q, s]) => {
        if (!active) return;
        setQuestion(q);
        setSubmissions(s.data);
        setActiveId(s.data[0]?.id ?? null);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading)
    return (
      <main className="container mx-auto flex-1 px-4 py-10">
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      </main>
    );

  if (error)
    return (
      <main className="container mx-auto flex-1 px-4 py-10">
        <p className="text-red-600 dark:text-red-400">
          Couldn’t load this question: {error}
        </p>
        <Link
          to="/questions"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to questions
        </Link>
      </main>
    );

  const active = submissions?.find((s) => s.id === activeId) ?? null;

  return (
    <main className="container mx-auto flex flex-1 flex-col px-4 py-5">
      <div className="mb-4">
        <Link
          to="/questions"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← All questions
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
          {question.course.name}
        </h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Tag>{question.department.shortName}</Tag>
          <Tag>{question.semester.name}</Tag>
          <Tag>{question.examType.name}</Tag>
        </div>
      </div>

      {submissions.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {submissions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`flex flex-col items-start rounded-lg border px-3.5 py-2 text-left ${
                s.id === activeId
                  ? "border-blue-500 bg-gray-50 dark:bg-gray-900"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <span className="text-sm">{s.contributor?.name ?? "Anonymous"}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {[s.section, s.batch].filter(Boolean).join(" · ")}
                {s.fileSize ? ` · ${formatSize(s.fileSize)}` : ""}
              </span>
            </button>
          ))}
        </div>
      )}

      {!active || !active.pdfUrl ? (
        <p className="text-gray-500 dark:text-gray-400">
          No PDF available for this question yet.
        </p>
      ) : (
        <div className="flex min-h-[70vh] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-2.5 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {active.contributor?.name
                ? `Submitted by ${active.contributor.name}`
                : "Submission"}
              {active.fileSize ? ` · ${formatSize(active.fileSize)}` : ""}
            </span>
            <a
              href={active.pdfUrl}
              target="_blank"
              rel="noopener"
              className="shrink-0 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Open PDF ↗
            </a>
          </div>
          <iframe
            key={active.id}
            src={active.pdfUrl}
            title={`${question.course.name} question PDF`}
            className="min-h-[65vh] w-full flex-1 bg-white"
          />
        </div>
      )}
    </main>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
      {children}
    </span>
  );
}
