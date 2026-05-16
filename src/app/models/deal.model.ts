export interface Deal {
  id: string;
  name: string;
  purchasePrice: number;
  address: string;
  noi: number;
  capRate: number;
}

export type DealInput = Omit<Deal, 'id' | 'capRate'>;

export type DealUpdate = Partial<DealInput>;

export type PurchasePriceComparison = 'gt' | 'lt';

export interface DealFilter {
  name?: string;
  purchasePrice?: number;
  purchasePriceComparison?: PurchasePriceComparison;
  page?: number;
  pageSize?: number;
}
