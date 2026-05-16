import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import { login, loginError, loginSuccess, logout } from './actions';
import { RequestStatus } from '../../data/common';

export interface AuthState {
  requestStatus: RequestStatus;
  currentUser: User | null;
  errorMsg?: string;
}

const initialState: AuthState = {
  requestStatus: RequestStatus.Pending,
  currentUser: null,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state, action) => {
    return {
      ...state,
      requestStatus: RequestStatus.Loading,
    };
  }),
  on(loginSuccess, (state, action) => {
    return {
      ...state,
      currentUser: action.user,
      requestStatus: RequestStatus.Success,
    };
  }),
  on(loginError, (state, action) => {
    return {
      ...state,
      currentUser: null,
      requestStatus: RequestStatus.Error,
      errorMsg: action.message,
    };
  }),
  on(logout, (state) => {
    return {
      ...state,
      currentUser: null,
      requestStatus: RequestStatus.Pending,
    };
  }),
);
