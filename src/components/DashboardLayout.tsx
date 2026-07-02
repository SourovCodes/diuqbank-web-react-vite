import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";
import { cx } from "../lib/cx";

type NavItem = { to: string; icon: string; text: string; end?: boolean };

const navSections: { label: string; links: NavItem[] }[] = [
  {
    label: "Account",
    links: [{ to: "/profile", icon: "👤", text: "Edit Profile" }],
  },
  {
    label: "Submit Paper",
    links: [
      { to: "/submissions/auto/new", icon: "🤖", text: "AI Auto Submission" },
      { to: "/submissions/manual/new", icon: "✋", text: "Manual Submission" },
    ],
  },
  {
    label: "My Submissions",
    links: [
      { to: "/submissions/auto", icon: "⚡", text: "Auto Submissions", end: true },
      { to: "/submissions/manual", icon: "📄", text: "Manual Submissions", end: true },
    ],
  },
];

const allLinks = navSections.flatMap((s) => s.links);

function SidebarLink({ to, icon, text, end }: NavItem) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cx(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        )
      }
    >
      <span className="text-base">{icon}</span>
      {text}
    </NavLink>
  );
}

export function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto w-full flex-1 px-4 py-8">
      {/* Mobile horizontal nav */}
      <nav className="mb-6 flex gap-1 overflow-x-auto pb-1 lg:hidden">
        {allLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cx(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition",
                isActive
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
              )
            }
          >
            <span>{link.icon}</span>
            {link.text}
          </NavLink>
        ))}
      </nav>

      <div className="flex gap-6 lg:items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-56 lg:shrink-0 lg:flex-col lg:sticky lg:top-20">
          {user && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {user.image ? (
                <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
                  {user.name[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-4">
            {navSections.map((section) => (
              <div key={section.label}>
                <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {section.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {section.links.map((link) => (
                    <SidebarLink key={link.to} {...link} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content area */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
