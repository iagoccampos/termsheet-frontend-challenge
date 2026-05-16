import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { DealService } from '../../services/deal.service';
import {
  createDeal,
  createDealError,
  createDealSuccess,
  filterDeals,
  loadDeals,
  loadDealsError,
  loadDealsSuccess,
} from './actions';
import { Store } from '@ngrx/store';
import { selectFilter, selectPaginationData } from './selector';

@Injectable()
export class DealsEffect {
  private readonly loadDeals$ = createEffect(() => {
    return this.actions.pipe(
      ofType(loadDeals),
      concatLatestFrom(() => this.store.select(selectFilter)),
      switchMap(([action, filter]) => {
        return this.dealService.getAll(action.pagination, filter).pipe(
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

  private readonly filterDeals$ = createEffect(() => {
    return this.actions.pipe(
      ofType(filterDeals),
      concatLatestFrom(() => this.store.select(selectPaginationData)),
      switchMap(([action, pagination]) => {
        return this.dealService.getAll(pagination, action.filter).pipe(
          map((response) => loadDealsSuccess({ response })),
          catchError((err: Error) => {
            return of(loadDealsError({ message: err.message }));
          }),
        );
      }),
    );
  });

  private readonly reloadAfterCreate$ = createEffect(() => {
    return this.actions.pipe(
      ofType(createDealSuccess),
      concatLatestFrom(() => this.store.select(selectPaginationData)),
      map(([, pagination]) => loadDeals({ pagination })),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions: Actions,
    private readonly dealService: DealService,
  ) {}
}
