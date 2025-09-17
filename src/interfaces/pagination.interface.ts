export interface Pagination<T> {
  data: T[];
  meta: {
    totalCount: number;
    page: number;
    totalPages: number;
  };
}
