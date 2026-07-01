import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFilterOptions, getQuestions } from "../api";
import SearchableSelect from "../components/SearchableSelect";

const noFilters = { department: null, course: null, semester: null, examType: null };

export default function QuestionList() {
  const [options, setOptions] = useState(null);
  const [filters, setFilters] = useState(noFilters);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFilterOptions().then(setOptions).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getQuestions({
      departmentId: filters.department?.id,
      courseId: filters.course?.id,
      semesterId: filters.semester?.id,
      examTypeId: filters.examType?.id,
      page,
      perPage: 20,
    })
      .then((r) => active && setResult(r))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filters, page]);

  function setFilter(key, option) {
    setPage(1);
    setFilters((f) => {
      const next = { ...f, [key]: option };
      // changing department invalidates the chosen course
      if (key === "department") next.course = null;
      return next;
    });
  }

  const courses =
    options?.courses.filter((c) => c.departmentId === filters.department?.id) ??
    [];

  const meta = result?.meta;
  const byName = (o) => o.name;

  return (
    <main className="container mx-auto flex-1 px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Questions</h1>

      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchableSelect
          options={options?.departments ?? []}
          value={filters.department}
          onChange={(o) => setFilter("department", o)}
          getLabel={byName}
          placeholder="All departments"
        />
        <SearchableSelect
          options={courses}
          value={filters.course}
          onChange={(o) => setFilter("course", o)}
          getLabel={byName}
          placeholder="All courses"
          disabled={!filters.department}
        />
        <SearchableSelect
          options={options?.semesters ?? []}
          value={filters.semester}
          onChange={(o) => setFilter("semester", o)}
          getLabel={byName}
          placeholder="All semesters"
        />
        <SearchableSelect
          options={options?.examTypes ?? []}
          value={filters.examType}
          onChange={(o) => setFilter("examType", o)}
          getLabel={byName}
          placeholder="All exam types"
        />
      </div>

      {error && (
        <p className="py-6 text-red-600 dark:text-red-400">
          Couldn’t load questions: {error}
        </p>
      )}
      {loading && <p className="py-6 text-gray-500 dark:text-gray-400">Loading…</p>}
      {!loading && !error && result?.data.length === 0 && (
        <p className="py-6 text-gray-500 dark:text-gray-400">
          No questions match these filters.
        </p>
      )}

      {!loading && !error && result?.data.length > 0 && (
        <ul className="flex flex-col gap-3">
          {result.data.map((q) => (
            <li key={q.id}>
              <Link
                to={`/questions/${q.id}`}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-blue-500 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold">{q.course.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Tag>{q.department.shortName}</Tag>
                    <Tag>{q.semester.name}</Tag>
                    <Tag>{q.examType.name}</Tag>
                  </div>
                </div>
                <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                  {q.submissionCount} submission{q.submissionCount === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-9 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <PageButton
            disabled={meta.page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </PageButton>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <PageButton
            disabled={meta.page >= meta.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </PageButton>
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

function PageButton({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 enabled:hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-100"
    >
      {children}
    </button>
  );
}
