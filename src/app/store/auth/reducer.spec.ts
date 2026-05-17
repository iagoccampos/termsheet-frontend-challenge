import { authReducer, initialState } from './reducer';
import { login, loginError, loginSuccess, logout } from './actions';
import { RequestStatus } from '../../data/common';
import { USER } from '../../../testing/mocks/user/user.mock';

describe('authReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const state = authReducer(undefined, { type: 'UNKNOWN' } as never);

    expect(state).toEqual(initialState);
  });

  it('login should set Loading status and clear errorMsg', () => {
    const state = authReducer(
      { ...initialState, errorMsg: 'old error' },
      login({ username: 'john', password: 'secret' }),
    );

    expect(state.requestStatus).toBe(RequestStatus.Loading);
    expect(state.errorMsg).toBeUndefined();
  });

  it('loginSuccess should store the user and mark as Success', () => {
    const state = authReducer(
      { ...initialState, requestStatus: RequestStatus.Loading },
      loginSuccess({ user: USER }),
    );

    expect(state.currentUser).toEqual(USER);
    expect(state.requestStatus).toBe(RequestStatus.Success);
  });

  it('loginError should clear user, mark as Error and store the message', () => {
    const state = authReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.Loading,
        currentUser: USER,
      },
      loginError({ message: 'invalid credentials' }),
    );

    expect(state.currentUser).toBeNull();
    expect(state.requestStatus).toBe(RequestStatus.Error);
    expect(state.errorMsg).toBe('invalid credentials');
  });

  it('logout should clear the user and reset status to Pending', () => {
    const state = authReducer(
      {
        ...initialState,
        currentUser: USER,
        requestStatus: RequestStatus.Success,
      },
      logout(),
    );

    expect(state.currentUser).toBeNull();
    expect(state.requestStatus).toBe(RequestStatus.Pending);
  });
});
