import { PaginationRequestData } from '../../models/common.model';

export const SIMULATED_LATENCY_MS = 1000;
export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGINATION: PaginationRequestData = {
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
};
