import {
  useQuery,
  useQueryClient,
  keepPreviousData,
  type QueryClient,
} from "@tanstack/react-query";
import {
  getFilterOptions,
  getQuestions,
  getQuestion,
  getSubmissions,
} from "../api";
import type { QuestionDetail, QuestionFilters, QuestionList } from "../types/api";

function findCachedQuestion(
  queryClient: QueryClient,
  id?: string
): QuestionDetail | undefined {
  const questionId = Number(id);
  if (!Number.isFinite(questionId)) return undefined;

  const cachedLists = queryClient.getQueriesData<QuestionList>({
    queryKey: ["questions"],
  });

  for (const [, list] of cachedLists) {
    const question = list?.data.find((item) => item.id === questionId);
    if (question) return question;
  }

  return undefined;
}

// Filter options are basically static — cache them for the whole session.
export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
    staleTime: Infinity,
  });
}

export function useQuestions(params: QuestionFilters) {
  return useQuery({
    queryKey: ["questions", params],
    queryFn: () => getQuestions(params),
    placeholderData: keepPreviousData, // keep old list visible while paging/filtering
  });
}

export function useQuestion(id?: string, initialQuestion?: QuestionDetail) {
  const queryClient = useQueryClient();
  const questionId = Number(id);
  const hydratedQuestion =
    initialQuestion?.id === questionId
      ? initialQuestion
      : findCachedQuestion(queryClient, id);

  return useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id as string),
    enabled: !!id && !hydratedQuestion,
    initialData: hydratedQuestion,
  });
}

export function useSubmissions(id?: string) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: () => getSubmissions(id as string),
    enabled: !!id,
  });
}
