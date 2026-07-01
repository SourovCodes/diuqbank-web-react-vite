import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

// Reused for all four question-list filters. `value` is the selected option
// object (or null = "all"); onChange receives the option or null when cleared.
export default function SearchableSelect({
  options,
  value,
  onChange,
  getLabel,
  placeholder = "All",
  disabled = false,
}) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? options
      : options.filter((o) =>
          getLabel(o).toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox
      value={value}
      onChange={onChange}
      onClose={() => setQuery("")}
      disabled={disabled}
      immediate
    >
      <div className="relative">
        <ComboboxInput
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-14 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          displayValue={(o) => (o ? getLabel(o) : "")}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />

        {value && !disabled && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => onChange(null)}
            className="absolute inset-y-0 right-7 flex items-center px-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 8.586l4.293-4.293 1.414 1.414L11.414 10l4.293 4.293-1.414 1.414L10 11.414l-4.293 4.293-1.414-1.414L8.586 10 4.293 5.707l1.414-1.414L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </ComboboxButton>

        <ComboboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900">
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-gray-400">No matches</div>
          )}
          {filtered.map((o) => (
            <ComboboxOption
              key={o.id}
              value={o}
              className="cursor-pointer px-3 py-2 text-gray-700 data-focus:bg-blue-600 data-focus:text-white data-selected:font-semibold dark:text-gray-200"
            >
              {getLabel(o)}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
