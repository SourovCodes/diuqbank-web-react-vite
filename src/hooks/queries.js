import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getFilterOptions,
  getQuestions,
  getQuestion,
  getSubmissions,
} from "../api";

// Filter options are basically static — cache them for the whole session.
export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
    staleTime: Infinity,
  });
}

export function useQuestions(params) {
  return useQuery({
    queryKey: ["questions", params],
    queryFn: () => getQuestions(params),
    placeholderData: keepPreviousData, // keep old list visible while paging/filtering
  });
}

export function useQuestion(id) {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id),
    enabled: !!id,
  });
}

export function useSubmissions(id) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: () => getSubmissions(id),
    enabled: !!id,
  });
}
