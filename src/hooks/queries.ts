import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getFilterOptions,
  getQuestions,
  getQuestion,
  getSubmissions,
} from "../api";
import type { QuestionFilters } from "../types/api";

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

export function useQuestion(id?: string) {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id as string),
    enabled: !!id,
  });
}

export function useSubmissions(id?: string) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: () => getSubmissions(id as string),
    enabled: !!id,
  });
}
