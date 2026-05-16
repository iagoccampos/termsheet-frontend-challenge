import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

const prefix = '[Auth]';

export const login = createAction(
  `${prefix} Login`,
  props<{ username: string; password: string }>(),
);
export const loginSuccess = createAction(
  `${prefix} Login Success`,
  props<{ user: User }>(),
);
export const loginError = createAction(
  `${prefix} Login Error`,
  props<{ message: string }>(),
);

export const logout = createAction(`${prefix} Logout`);
