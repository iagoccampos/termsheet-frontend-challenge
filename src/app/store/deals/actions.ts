import { createAction, props } from '@ngrx/store';
import { Deal, NewDeal } from '../../models/deal.model';
import {
  PaginatedResponse,
  PaginationRequestData,
} from '../../models/common.model';

const prefix = '[Deals]';

export const loadDeals = createAction(
  `${prefix} Load Deals`,
  props<{ pagination?: PaginationRequestData }>(),
);
export const loadDealsSuccess = createAction(
  `${prefix} Load Deals Success`,
  props<{ response: PaginatedResponse<Deal> }>(),
);
export const loadDealsError = createAction(
  `${prefix} Load Deals Error`,
  props<{ message: string }>(),
);

export const createDeal = createAction(
  `${prefix} Create Deal`,
  props<{ newDeal: NewDeal }>(),
);
export const createDealSuccess = createAction(
  `${prefix} Create Deal Success`,
  props<{ deal: Deal }>(),
);
export const createDealError = createAction(
  `${prefix} Create Deal Error`,
  props<{ message: string }>(),
);
