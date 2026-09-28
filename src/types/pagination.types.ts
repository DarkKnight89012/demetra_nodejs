export interface Pagination<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
