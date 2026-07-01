import type {
  Contributor,
  ContributorList,
  ContributorSubmissionList,
  FilterOptions,
  PaginationParams,
  QuestionDetail,
  QuestionFilters,
  QuestionList,
  QuestionSubmissions,
} from "./types/api";

const PRODUCTION_API_BASE = "https://diuqbank-api-prod.sourov-cse.workers.dev";
const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE = (configuredApiBase || (import.meta.env.DEV ? "/api" : PRODUCTION_API_BASE))
  .replace(/\/+$/, "");

type QueryParams = Record<string, string | number | boolean | null | undefined>;

async function get<T>(path: string, params?: QueryParams): Promise<T> {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url);
  if (!res.ok) {
    const message = await readErrorMessage(res);
    throw new Error(message || `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function readErrorMessage(res: Response): Promise<string | null> {
  try {
    const body = (await res.json()) as { error?: string; message?: string };
    return body.error || body.message || null;
  } catch {
    return null;
  }
}

export const getQuestions = (params: QuestionFilters): Promise<QuestionList> =>
  get("/questions", params);

export const getQuestion = (id: string): Promise<QuestionDetail> =>
  get(`/questions/${id}`);

export const getSubmissions = (id: string): Promise<QuestionSubmissions> =>
  get(`/questions/${id}/submissions`);

export const getFilterOptions = (): Promise<FilterOptions> =>
  get("/filter-options");

export const getContributors = (
  params: PaginationParams
): Promise<ContributorList> => get("/contributors", params);

export const getContributor = (username: string): Promise<Contributor> =>
  get(`/contributors/${encodeURIComponent(username)}`);

export const getContributorSubmissions = (
  username: string,
  params: PaginationParams
): Promise<ContributorSubmissionList> =>
  get(`/contributors/${encodeURIComponent(username)}/submissions`, params);
