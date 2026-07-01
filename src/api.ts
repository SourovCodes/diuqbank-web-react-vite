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

const API_BASE = "https://diuqbank-api-prod.sourov-cse.workers.dev";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

async function get<T>(path: string, params?: QueryParams): Promise<T> {
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
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
