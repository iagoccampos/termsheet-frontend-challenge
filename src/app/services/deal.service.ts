import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Deal, DealFilter, DealInput, DealUpdate } from '../models/deal.model';
import { PaginatedResponse } from '../models/common.model';
import { MOCK_DEALS } from '../data/mock-deals';

const SIMULATED_LATENCY_MS = 400;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class DealService {
  private deals: Deal[] = [...MOCK_DEALS];

  getAll(filter: DealFilter = {}): Observable<PaginatedResponse<Deal>> {
    const {
      name,
      purchasePrice,
      purchasePriceComparison = 'gt',
      page = DEFAULT_PAGE,
      pageSize = DEFAULT_PAGE_SIZE,
    } = filter;

    let filtered = this.deals;

    if (name?.trim()) {
      const term = name.trim().toLowerCase();
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(term));
    }

    if (purchasePrice != null) {
      filtered = filtered.filter((d) =>
        purchasePriceComparison === 'lt'
          ? d.purchasePrice < purchasePrice
          : d.purchasePrice > purchasePrice,
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const response = new PaginatedResponse(data, page, pageSize, total);
    return of(response).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getById(id: string): Observable<Deal> {
    const deal = this.deals.find((d) => d.id === id);

    if (!deal) {
      return throwError(() => new Error(`Deal ${id} not found`)).pipe(delay(SIMULATED_LATENCY_MS))
    }

    return of({ ...deal }).pipe(delay(SIMULATED_LATENCY_MS))
  }

  create(input: DealInput): Observable<Deal> {
    const deal: Deal = {
      id: crypto.randomUUID(),
      ...input,
      capRate: this.calculateCapRate(input.noi, input.purchasePrice),
    };

    this.deals = [deal, ...this.deals];

    return of({ ...deal }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  update(id: string, changes: DealUpdate): Observable<Deal> {
    const index = this.deals.findIndex((d) => d.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Deal ${id} not found`)).pipe(delay(SIMULATED_LATENCY_MS));
    }

    const deal = { ...this.deals[index], ...changes };
    deal.capRate = this.calculateCapRate(deal.noi, deal.purchasePrice);
    this.deals[index] = deal;

    return of({ ...deal }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  delete(id: string): Observable<string> {
    const exists = this.deals.some((d) => d.id === id);
    if (!exists) {
      return throwError(() => new Error(`Deal ${id} not found`)).pipe(delay(SIMULATED_LATENCY_MS));
    }

    this.deals = this.deals.filter((d) => d.id !== id);

    return of(id).pipe(delay(SIMULATED_LATENCY_MS));
  }

  private calculateCapRate(noi: number, purchasePrice: number): number {
    if (purchasePrice <= 0) return 0;

    return Number(((noi / purchasePrice) * 100).toFixed(2));
  }
}
