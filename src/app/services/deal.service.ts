import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Deal, NewDeal } from '../models/deal.model';
import {
  PaginatedResponse,
  PaginationRequestData,
} from '../models/common.model';
import { MOCK_DEALS } from '../data/mock-deals';
import {
  DEFAULT_PAGINATION,
  SIMULATED_LATENCY_MS,
} from '../shared/const/consts';

@Injectable({ providedIn: 'root' })
export class DealService {
  private deals: Deal[] = [...MOCK_DEALS];

  getAll(
    pagination?: PaginationRequestData,
  ): Observable<PaginatedResponse<Deal>> {
    const { pageIndex, pageSize } = pagination ?? DEFAULT_PAGINATION;
    const pageNumber = pageIndex + 1;

    let filtered = this.deals;

    // if (name?.trim()) {
    //   const term = name.trim().toLowerCase();
    //   filtered = filtered.filter((d) => d.name.toLowerCase().includes(term));
    // }

    // if (purchasePrice != null) {
    //   filtered = filtered.filter((d) =>
    //     purchasePriceComparison === 'lt'
    //       ? d.purchasePrice < purchasePrice
    //       : d.purchasePrice > purchasePrice,
    //   );
    // }

    const total = filtered.length;
    const start = (pageNumber - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const response = new PaginatedResponse(data, total);
    return of(response).pipe(delay(SIMULATED_LATENCY_MS));
  }

  create(input: NewDeal): Observable<Deal> {
    const deal: Deal = {
      id: crypto.randomUUID(),
      ...input,
      capRate: DealService.calculateCapRate(input.noi, input.purchasePrice),
    };

    this.deals = [deal, ...this.deals];

    return of({ ...deal }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  static calculateCapRate(noi: number, purchasePrice: number): number {
    if (purchasePrice <= 0) return 0;

    return Number(((noi / purchasePrice) * 100).toFixed(2));
  }
}
