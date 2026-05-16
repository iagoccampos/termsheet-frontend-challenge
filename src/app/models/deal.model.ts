export interface Deal {
  id: string;
  name: string;
  purchasePrice: number;
  address: string;
  noi: number;
  capRate: number;
}

export type NewDeal = Omit<Deal, 'id' | 'capRate'>;

export type DealUpdate = Partial<NewDeal>;

export type PurchasePriceComparison = 'gt' | 'lt';
