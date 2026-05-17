import {
  selectCreateErrorMsg,
  selectDeals,
  selectFilter,
  selectIsCreatingDeal,
  selectIsLoadingDeals,
  selectPaginationData,
  selectTotal,
} from './selector';
import { initialState } from './reducer';
import { RequestStatus } from '../../data/common';
import { DEAL } from '../../../testing/mocks/deal/deal.mock';
import { buildState as buildStateFactory } from '../../../testing/util/functions';

const buildState = buildStateFactory(initialState);

describe('Deals selectors', () => {
  it('selectDeals should return deals', () => {
    expect(selectDeals.projector(buildState({ deals: [DEAL] }))).toEqual([
      DEAL,
    ]);
  });

  it('selectTotal should return total', () => {
    expect(selectTotal.projector(buildState({ total: 5 }))).toBe(5);
  });

  it('selectPaginationData should return pageSize and pageIndex', () => {
    expect(
      selectPaginationData.projector(
        buildState({ pageIndex: 2, pageSize: 25 }),
      ),
    ).toEqual({ pageSize: 25, pageIndex: 2 });
  });

  it('selectFilter should return the current filter', () => {
    expect(
      selectFilter.projector(buildState({ filter: { name: 'sun' } })),
    ).toEqual({ name: 'sun' });
  });

  it('selectFilter should return undefined when no filter is set', () => {
    expect(selectFilter.projector(buildState())).toBeUndefined();
  });

  it('selectIsLoadingDeals should be true when loadStatus is Loading', () => {
    expect(
      selectIsLoadingDeals.projector(
        buildState({ loadStatus: RequestStatus.Loading }),
      ),
    ).toBe(true);
  });

  it.each([RequestStatus.Pending, RequestStatus.Success, RequestStatus.Error])(
    'selectIsLoadingDeals should be false when loadStatus is %s',
    (status) => {
      expect(
        selectIsLoadingDeals.projector(buildState({ loadStatus: status })),
      ).toBe(false);
    },
  );

  it('selectIsCreatingDeal should be true when createStatus is Loading', () => {
    expect(
      selectIsCreatingDeal.projector(
        buildState({ createStatus: RequestStatus.Loading }),
      ),
    ).toBe(true);
  });

  it.each([RequestStatus.Pending, RequestStatus.Success, RequestStatus.Error])(
    'selectIsCreatingDeal should be false when createStatus is %s',
    (status) => {
      expect(
        selectIsCreatingDeal.projector(buildState({ createStatus: status })),
      ).toBe(false);
    },
  );

  it('selectCreateErrorMsg should return createErrorMsg', () => {
    expect(
      selectCreateErrorMsg.projector(buildState({ createErrorMsg: 'error' })),
    ).toBe('error');
  });
});
