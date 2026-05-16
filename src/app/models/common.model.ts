export class PaginatedResponse<T> {
  constructor(
    public readonly data: T[],
    public readonly total: number,
  ) {}
}

export interface PaginationRequestData {
  pageIndex: number;
  pageSize: number;
}
