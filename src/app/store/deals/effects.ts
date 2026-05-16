import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { DealService } from '../../services/deal.service';
import {
  createDeal,
  createDealError,
  createDealSuccess,
  loadDeals,
  loadDealsError,
  loadDealsSuccess,
} from './actions';
import { Store } from '@ngrx/store';
import { selectPaginationData } from './selector';

@Injectable()
export class DealsEffect {
  private readonly loadDeals$ = createEffect(() => {
    return this.actions.pipe(
      ofType(loadDeals),
      switchMap((action) => {
        return this.dealService.getAll(action.pagination).pipe(
          map((response) => loadDealsSuccess({ response })),
          catchError((err: Error) => {
            return of(loadDealsError({ message: err.message }));
          }),
        );
      }),
    );
  });

  private readonly createDeal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(createDeal),
      switchMap((action) => {
        return this.dealService.create(action.newDeal).pipe(
          map((deal) => createDealSuccess({ deal })),
          catchError((err: Error) => {
            return of(createDealError({ message: err.message }));
          }),
        );
      }),
    );
  });

  private readonly reloadAfterCreate$ = createEffect(() => {
    return this.actions.pipe(
      ofType(createDealSuccess),
      map(() => {
        const pagination = this.store.selectSignal(selectPaginationData)();
        return loadDeals({ pagination });
      }),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions: Actions,
    private readonly dealService: DealService,
  ) {}
}
