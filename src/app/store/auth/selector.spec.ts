import { selectErrorMsg, selectIsAuth, selectIsLoading } from './selector';
import { initialState } from './reducer';
import { RequestStatus } from '../../data/common';
import { USER } from '../../../testing/mocks/user/user.mock';
import { buildState as buildStateFactory } from '../../../testing/util/functions';

const buildState = buildStateFactory(initialState);

describe('Auth selectors', () => {
  it('selectIsAuth should be true when currentUser is set', () => {
    expect(selectIsAuth.projector(buildState({ currentUser: USER }))).toBe(
      true,
    );
  });

  it('selectIsAuth should be false when currentUser is null', () => {
    expect(selectIsAuth.projector(buildState({ currentUser: null }))).toBe(
      false,
    );
  });

  it('selectIsLoading should be true when requestStatus is Loading', () => {
    expect(
      selectIsLoading.projector(
        buildState({ requestStatus: RequestStatus.Loading }),
      ),
    ).toBe(true);
  });

  it.each([RequestStatus.Pending, RequestStatus.Success, RequestStatus.Error])(
    'selectIsLoading should be false when requestStatus is %s',
    (status) => {
      expect(
        selectIsLoading.projector(buildState({ requestStatus: status })),
      ).toBe(false);
    },
  );

  it('selectErrorMsg should return errorMsg', () => {
    expect(
      selectErrorMsg.projector(buildState({ errorMsg: 'invalid' })),
    ).toBe('invalid');
  });
});