import { computed, Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { MOCK_USERS } from '../data/mock-users';
import { User } from '../models/user.model';
import { SIMULATED_LATENCY_MS } from '../shared/const/consts';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(username: string, password: string): Observable<User> {
    const match = MOCK_USERS.find(
      (user) => user.username === username && user.password === password,
    );

    if (!match) {
      return throwError(() => new Error('Invalid username or password'));
    }

    return of(match).pipe(
      delay(SIMULATED_LATENCY_MS),
      tap((user) => this.currentUser.set(user)),
    );
  }

  logout(): Observable<void> {
    return of(undefined).pipe(tap(() => this.currentUser.set(null)));
  }
}
