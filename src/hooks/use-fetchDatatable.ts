import { Filters, Pagination } from "@/interfaces";
import api from "@/lib/api";

export const fetchData = async <T>(
  url: string,
  filtersAndPagination: Filters
) => {
  const { pageIndex, pageSize, sortBy, filters } = filtersAndPagination;

  let customURL = `${url}?page=${pageIndex}&take=${pageSize}`;

  if (filters && filters.length > 0) {
    const filterParams = filters
      .map((filter) => `filters=${filter.id}:${filter.value}`)
      .join("&");
    customURL += `&${filterParams}`;
  }

  if (sortBy) {
    customURL += `&sort=${sortBy}`;
  }

  const data = await api.get(customURL);

  return data.data as Pagination<T>;
};
