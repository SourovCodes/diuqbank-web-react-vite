import { SearchableSelect } from "../ui/SearchableSelect";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400";

export function FilterBar({ options, filters, onFilterChange, onDepartmentChange, onClear }) {
  const visibleCourses = filters.departmentId
    ? options.courses.filter((c) => c.departmentId === Number(filters.departmentId))
    : options.courses;

  const deptShort = new Map(options.departments.map((d) => [d.id, d.shortName]));
  const courseOptions = visibleCourses.map((c) => ({
    value: String(c.id),
    label: filters.departmentId
      ? c.name
      : `${c.name} (${deptShort.get(c.departmentId) ?? "?"})`,
  }));

  const hasFilters = !!(
    filters.departmentId ||
    filters.courseId ||
    filters.semesterId ||
    filters.examTypeId
  );

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClass}>Department</label>
          <SearchableSelect
            options={options.departments.map((d) => ({ value: String(d.id), label: d.name }))}
            value={filters.departmentId}
            onChange={onDepartmentChange}
            placeholder="All departments"
          />
        </div>
        <div>
          <label className={labelClass}>Course</label>
          <SearchableSelect
            options={courseOptions}
            value={filters.courseId}
            onChange={(v) => onFilterChange("courseId", v)}
            placeholder="All courses"
          />
        </div>
        <div>
          <label className={labelClass}>Semester</label>
          <SearchableSelect
            options={options.semesters.map((s) => ({ value: String(s.id), label: s.name }))}
            value={filters.semesterId}
            onChange={(v) => onFilterChange("semesterId", v)}
            placeholder="All semesters"
          />
        </div>
        <div>
          <label className={labelClass}>Exam Type</label>
          <SearchableSelect
            options={options.examTypes.map((e) => ({ value: String(e.id), label: e.name }))}
            value={filters.examTypeId}
            onChange={(v) => onFilterChange("examTypeId", v)}
            placeholder="All types"
          />
        </div>
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onClear}
            className="rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-500/10"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
