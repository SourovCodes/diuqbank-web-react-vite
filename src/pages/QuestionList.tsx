import { useSearchParams } from "react-router-dom";
import { useFilterOptions, useQuestions } from "../hooks/queries";
import { FilterBar } from "../components/questions/FilterBar";
import { QuestionCard } from "../components/questions/QuestionCard";
import { Pagination } from "../components/ui/Pagination";
import { cx } from "../lib/cx";
import type { QuestionFilters } from "../types/api";

type FilterKey = Exclude<keyof QuestionFilters, "page" | "perPage">;

export default function QuestionList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: QuestionFilters = {
    page: Number(searchParams.get("page")) || 1,
    perPage: 20,
    departmentId: searchParams.get("departmentId") ?? "",
    courseId: searchParams.get("courseId") ?? "",
    semesterId: searchParams.get("semesterId") ?? "",
    examTypeId: searchParams.get("examTypeId") ?? "",
  };

  const { data: options } = useFilterOptions();
  const { data: result, isPending, isError, error, isFetching } =
    useQuestions(filters);

  function updateFilter(key: FilterKey, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        next.set("page", "1");
        return next;
      },
      { replace: true }
    );
  }

  function handleDepartmentChange(deptId: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (deptId) next.set("departmentId", deptId);
        else next.delete("departmentId");
        next.delete("courseId"); // department change invalidates course
        next.set("page", "1");
        return next;
      },
      { replace: true }
    );
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  function goToPage(page: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
  }

  return (
    <main className="container mx-auto flex-1 px-4 py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Archive
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Questions
          </h1>
          <p className="mt-3 max-w-[58ch] text-sm leading-6 text-gray-500 dark:text-gray-400">
            Filter by department, course, semester, and exam type to find the
            exact paper you need.
          </p>
        </div>

        {result && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Results
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {result.meta.total.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {options && (
        <div className="mb-6">
          <FilterBar
            options={options}
            filters={filters}
            onFilterChange={updateFilter}
            onDepartmentChange={handleDepartmentChange}
            onClear={clearFilters}
          />
        </div>
      )}

      {isError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          Failed to load questions: {error.message}
        </p>
      ) : isPending ? (
        <p className="rounded-lg border border-dashed border-gray-200 py-14 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Loading questions...
        </p>
      ) : (
        <>
          <div
            className={cx(
              "flex flex-col gap-3 transition-opacity",
              isFetching && "opacity-60"
            )}
          >
            {result.data.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 py-16 text-center dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  No questions found
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try relaxing one of the filters and search again.
                </p>
              </div>
            ) : (
              result.data.map((q) => <QuestionCard key={q.id} question={q} />)
            )}
          </div>

          <Pagination meta={result.meta} onPageChange={goToPage} />
        </>
      )}
    </main>
  );
}
