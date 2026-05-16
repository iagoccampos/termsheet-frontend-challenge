import { createReducer, on } from '@ngrx/store';
import { Deal } from '../../models/deal.model';
import { RequestStatus } from '../../data/common';
import {
  createDeal,
  createDealError,
  createDealSuccess,
  loadDeals,
  loadDealsError,
  loadDealsSuccess,
} from './actions';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '../../shared/const/consts';

export interface DealsState {
  deals: Deal[];
  total: number;
  pageIndex: number;
  pageSize: number;
  loadStatus: RequestStatus;
  loadErrorMsg?: string;
  createStatus: RequestStatus;
  createErrorMsg?: string;
}

const initialState: DealsState = {
  deals: [],
  total: 0,
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
  loadStatus: RequestStatus.Pending,
  createStatus: RequestStatus.Pending,
};

export const dealsReducer = createReducer(
  initialState,
  on(loadDeals, (state, action) => {
    return {
      ...state,
      pageSize: action.pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
      pageIndex: action.pagination?.pageIndex ?? DEFAULT_PAGE_INDEX,
      loadStatus: RequestStatus.Loading,
      loadErrorMsg: undefined,
    };
  }),
  on(loadDealsSuccess, (state, action) => {
    const { data, total } = action.response;
    return {
      ...state,
      deals: data,
      total,
      loadStatus: RequestStatus.Success,
    };
  }),
  on(loadDealsError, (state, action) => {
    return {
      ...state,
      loadStatus: RequestStatus.Error,
      loadErrorMsg: action.message,
    };
  }),

  on(createDeal, (state) => {
    return {
      ...state,
      createStatus: RequestStatus.Loading,
      createErrorMsg: undefined,
    };
  }),
  on(createDealSuccess, (state) => {
    return {
      ...state,
      createStatus: RequestStatus.Success,
    };
  }),
  on(createDealError, (state, action) => {
    return {
      ...state,
      createStatus: RequestStatus.Error,
      createErrorMsg: action.message,
    };
  }),
);
