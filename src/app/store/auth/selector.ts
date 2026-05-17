import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './reducer';
import { RequestStatus } from '../../data/common';

const featSelector = createFeatureSelector<AuthState>('auth');

export const selectIsAuth = createSelector(
  featSelector,
  (s) => !!s.currentUser,
);
export const selectIsLoading = createSelector(
  featSelector,
  (s) => s.requestStatus === RequestStatus.Loading,
);
export const selectErrorMsg = createSelector(featSelector, (s) => s.errorMsg);
