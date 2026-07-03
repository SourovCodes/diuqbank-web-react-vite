import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { recordSubmissionView } from "../../api";
import { cx } from "../../lib/cx";

const TURNSTILE_SITE_KEY = "0x4AAAAAADvF7K_JpwpPHfiE";
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      appearance?: "always" | "execute" | "interaction-only";
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      // Fired when the managed challenge escalates to (and leaves) an
      // interactive check — our cue to surface / hide the prompt.
      "before-interactive-callback"?: () => void;
      "after-interactive-callback"?: () => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let turnstileLoader: Promise<Turnstile> | null = null;

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  turnstileLoader ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile failed to initialise"));
    };
    script.onerror = () => {
      turnstileLoader = null; // allow a retry on the next view
      reject(new Error("Failed to load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return turnstileLoader;
}

// Submissions already handled this session — a re-visit shouldn't re-prompt.
const countedIds = new Set<number>();

/**
 * Counts one view for the submission being read. A Turnstile widget mints the
 * single-use token the API requires; with `interaction-only` it stays invisible
 * for the common managed/silent pass.
 *
 * When Cloudflare *does* demand interaction, the checkbox used to render inline
 * below the (tall) PDF, where it was easy to miss. Instead we surface it in a
 * prominent fixed prompt anchored to the viewport (portaled to `document.body`),
 * so the reader actually sees the check. The widget host stays mounted in one
 * place the whole time so Turnstile's injected iframe is never re-parented.
 */
export function SubmissionViewTracker({
  submissionId,
}: {
  submissionId: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  useEffect(() => {
    if (countedIds.has(submissionId)) return;

    let cancelled = false;
    let widgetId: string | null = null;

    const cleanupWidget = () => {
      if (widgetId !== null) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          /* widget already gone */
        }
        widgetId = null;
      }
    };

    // Tear down the widget and hide the prompt in one go.
    const finish = () => {
      cleanupWidget();
      if (!cancelled) setNeedsInteraction(false);
    };

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !hostRef.current || countedIds.has(submissionId)) return;
        widgetId = turnstile.render(hostRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          "before-interactive-callback": () => {
            if (!cancelled) setNeedsInteraction(true);
          },
          "after-interactive-callback": () => {
            if (!cancelled) setNeedsInteraction(false);
          },
          callback: (token) => {
            countedIds.add(submissionId);
            finish();
            recordSubmissionView(submissionId, token).catch(() => {
              /* best-effort */
            });
          },
          "error-callback": finish,
          "expired-callback": finish,
        });
      })
      .catch(() => {
        /* best-effort */
      });

    return () => {
      cancelled = true;
      cleanupWidget();
    };
  }, [submissionId]);

  // Dismissing is allowed — view counting is best-effort. Mark it handled so we
  // don't re-prompt for the same submission this session; the (now-hidden)
  // widget is torn down when the component unmounts.
  const dismiss = () => {
    countedIds.add(submissionId);
    setNeedsInteraction(false);
  };

  // The host is ALWAYS rendered (Turnstile needs a stable, live node). The card
  // is only made visible/interactive once an interactive challenge is required;
  // otherwise it's invisible and click-through so nothing shows during the
  // silent pass.
  return createPortal(
    <div
      className={cx(
        "fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 transition-opacity duration-200",
        needsInteraction ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!needsInteraction}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Quick check — confirm you&rsquo;re human
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Just so we can count your view. Takes a second.
          </p>
        </div>
        <div ref={hostRef} className="flex min-h-[65px] items-center justify-center" />
        <button
          type="button"
          onClick={dismiss}
          className="text-xs font-medium text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
        >
          Not now
        </button>
      </div>
    </div>,
    document.body
  );
}
