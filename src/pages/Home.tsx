import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    document.title = "DIUQBank";
  }, []);

  return (
    <main className="container mx-auto flex flex-1 flex-col items-center px-4 py-20 text-center sm:py-28">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
        Welcome
      </p>
      <h1 className="max-w-[16ch] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Past questions, one PDF away.
      </h1>
      <p className="mt-5 max-w-[52ch] text-lg text-gray-500 dark:text-gray-400">
        Browse the DIUQBank question archive by department, semester, and exam
        type — then read the paper right in your browser.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3.5">
        <Link
          to="/questions"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse Questions
        </Link>
        <a
          href="#about"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
        >
          Learn More
        </a>
      </div>
    </main>
  );
}
