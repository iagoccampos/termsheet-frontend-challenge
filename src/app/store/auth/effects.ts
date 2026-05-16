import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { login, loginError, loginSuccess, logout } from './actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffect {
  private readonly login$ = createEffect(() => {
    return this.actions.pipe(
      ofType(login),
      switchMap((action) => {
        return this.authService.login(action.username, action.password).pipe(
          map((res) => {
            this.router.navigate(['deals']);
            return loginSuccess({ user: res });
          }),
          catchError((err: Error) => {
            return of(loginError({ message: err.message }));
          }),
        );
      }),
    );
  });

  private readonly logout$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(logout),
        tap(() => this.router.navigate(['login'])),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}
}
