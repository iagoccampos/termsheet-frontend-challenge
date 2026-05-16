export interface Deal {
  id: string;
  name: string;
  purchasePrice: number;
  address: string;
  noi: number;
  capRate: number;
}

export type NewDeal = Omit<Deal, 'id' | 'capRate'>;

export type PurchasePriceComparison = 'gt' | 'lt';

export interface DealFilter {
  name?: string | null;
  purchasePrice?: number | null;
  operator?: PurchasePriceComparison;
}
