import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";

export type PaginationParams = PaginationState;
export type SortParams = { sortBy: `${string}.${"asc" | "desc"}` };
export type FilterParams = ColumnFiltersState;
export type Filters = Partial<
  PaginationParams & SortParams & { filters?: FilterParams }
>;
