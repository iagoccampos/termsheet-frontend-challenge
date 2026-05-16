import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DealsState } from './reducer';
import { RequestStatus } from '../../data/common';

const featSelector = createFeatureSelector<DealsState>('deals');

export const selectDeals = createSelector(featSelector, (s) => s.deals);

export const selectTotal = createSelector(featSelector, (s) => s.total);

export const selectPaginationData = createSelector(featSelector, (s) => ({
  pageSize: s.pageSize,
  pageIndex: s.pageIndex,
}));

export const selectFilter = createSelector(featSelector, (s) => s.filter);

export const selectIsLoadingDeals = createSelector(
  featSelector,
  (s) => s.loadStatus === RequestStatus.Loading,
);
export const selectLoadErrorMsg = createSelector(
  featSelector,
  (s) => s.loadErrorMsg,
);

export const selectIsCreatingDeal = createSelector(
  featSelector,
  (s) => s.createStatus === RequestStatus.Loading,
);
export const selectCreateErrorMsg = createSelector(
  featSelector,
  (s) => s.createErrorMsg,
);
