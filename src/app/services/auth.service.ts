import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, throwError, timer } from 'rxjs';
import { MOCK_USERS } from '../data/mock-users';
import { User } from '../models/user.model';
import { SIMULATED_LATENCY_MS } from '../shared/const/consts';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(username: string, password: string): Observable<User> {
    const match = MOCK_USERS.find(
      (user) => user.username === username && user.password === password,
    );

    if (!match) {
      return timer(SIMULATED_LATENCY_MS).pipe(
        switchMap(() =>
          throwError(() => new Error('Invalid username or password')),
        ),
      );
    }

    return of(match).pipe(delay(SIMULATED_LATENCY_MS));
  }
}
