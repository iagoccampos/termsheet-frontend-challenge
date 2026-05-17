import { dealsReducer, DealsState, initialState } from './reducer';
import {
  createDeal,
  createDealError,
  createDealSuccess,
  filterDeals,
  loadDeals,
  loadDealsError,
  loadDealsSuccess,
} from './actions';
import { RequestStatus } from '../../data/common';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '../../shared/const/consts';
import { Deal, DealFilter } from '../../models/deal.model';
import { PaginatedResponse } from '../../models/common.model';
import { DEAL } from '../../../testing/mocks/deal/deal.mock';

describe('dealsReducer', () => {
  it('loadDeals should set Loading status and apply pagination', () => {
    const state = dealsReducer(
      initialState,
      loadDeals({ pagination: { pageIndex: 2, pageSize: 10 } }),
    );

    expect(state).toEqual({
      ...initialState,
      pageIndex: 2,
      pageSize: 10,
      loadStatus: RequestStatus.Loading,
      loadErrorMsg: undefined,
    });
  });

  it('loadDeals should reset pageIndex to default when pageSize changes', () => {
    const prev: DealsState = { ...initialState, pageIndex: 3, pageSize: 10 };

    const state = dealsReducer(
      prev,
      loadDeals({ pagination: { pageIndex: 3, pageSize: 25 } }),
    );

    expect(state.pageSize).toBe(25);
    expect(state.pageIndex).toBe(DEFAULT_PAGE_INDEX);
    expect(state.loadStatus).toBe(RequestStatus.Loading);
  });

  it('loadDeals should fall back to defaults when pagination is omitted', () => {
    const prev: DealsState = { ...initialState, pageIndex: 5, pageSize: 25 };

    const state = dealsReducer(prev, loadDeals({}));

    expect(state.pageSize).toBe(DEFAULT_PAGE_SIZE);
    expect(state.pageIndex).toBe(DEFAULT_PAGE_INDEX);
  });

  it('loadDeals should clear previous loadErrorMsg', () => {
    const prev: DealsState = {
      ...initialState,
      loadStatus: RequestStatus.Error,
      loadErrorMsg: 'old error',
    };

    const state = dealsReducer(prev, loadDeals({}));

    expect(state.loadErrorMsg).toBeUndefined();
    expect(state.loadStatus).toBe(RequestStatus.Loading);
  });

  it('filterDeals should set the filter, reset pageIndex and mark as Loading', () => {
    const prev: DealsState = { ...initialState, pageIndex: 4 };
    const filter: DealFilter = { name: 'Sunset' };

    const state = dealsReducer(prev, filterDeals({ filter }));

    expect(state).toEqual({
      ...prev,
      filter,
      pageIndex: DEFAULT_PAGE_INDEX,
      loadStatus: RequestStatus.Loading,
      loadErrorMsg: undefined,
    });
  });

  it('filterDeals should support clearing the filter', () => {
    const prev: DealsState = {
      ...initialState,
      filter: { name: 'Sunset' },
    };

    const state = dealsReducer(prev, filterDeals({}));

    expect(state.filter).toBeUndefined();
  });

  it('loadDealsSuccess should populate deals, total and mark as Success', () => {
    const response = new PaginatedResponse<Deal>([DEAL], 42);

    const state = dealsReducer(
      { ...initialState, loadStatus: RequestStatus.Loading },
      loadDealsSuccess({ response }),
    );

    expect(state.deals).toEqual([DEAL]);
    expect(state.total).toBe(42);
    expect(state.loadStatus).toBe(RequestStatus.Success);
  });

  it('loadDealsError should mark as Error and store the message', () => {
    const state = dealsReducer(
      { ...initialState, loadStatus: RequestStatus.Loading },
      loadDealsError({ message: 'boom' }),
    );

    expect(state.loadStatus).toBe(RequestStatus.Error);
    expect(state.loadErrorMsg).toBe('boom');
  });

  it('createDeal should mark as Loading and clear previous error', () => {
    const prev: DealsState = {
      ...initialState,
      createStatus: RequestStatus.Error,
      createErrorMsg: 'old',
    };

    const state = dealsReducer(
      prev,
      createDeal({
        newDeal: {
          name: 'x',
          purchasePrice: 1,
          address: 'a',
          noi: 1,
        },
      }),
    );

    expect(state.createStatus).toBe(RequestStatus.Loading);
    expect(state.createErrorMsg).toBeUndefined();
  });

  it('createDealSuccess should mark as Success', () => {
    const state = dealsReducer(
      { ...initialState, createStatus: RequestStatus.Loading },
      createDealSuccess({ deal: DEAL }),
    );

    expect(state.createStatus).toBe(RequestStatus.Success);
  });

  it('createDealError should mark as Error and store the message', () => {
    const state = dealsReducer(
      { ...initialState, createStatus: RequestStatus.Loading },
      createDealError({ message: 'nope' }),
    );

    expect(state.createStatus).toBe(RequestStatus.Error);
    expect(state.createErrorMsg).toBe('nope');
  });
});
