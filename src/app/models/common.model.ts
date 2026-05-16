export class PaginatedResponse<T> {
  readonly totalPages: number;

  constructor(
    public readonly data: T[],
    public readonly page: number,
    public readonly pageSize: number,
    public readonly total: number,
  ) {
    this.totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  }
}
