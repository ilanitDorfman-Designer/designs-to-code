import { guardedRouter } from '@etoro/common/utils/rn';
import { fireEvent, render } from '@testing-library/react-native';

import { DefaultStartButton } from './default-start-button';

// The real `@etoro/common/utils/rn` barrel imports expo-router at module scope;
// mock it so `requireActual` (which keeps the real `backOrReplace` under test)
// never loads expo-router's untransformed ESM dependencies.
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
    navigate: jest.fn(),
    canGoBack: jest.fn(),
  },
}));

jest.mock('@etoro/common/utils/rn', () => ({
  ...(jest.requireActual('@etoro/common/utils/rn') as Record<string, unknown>),
  guardedRouter: {
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: jest.fn(),
  },
}));

jest.mock('./default-menu-button', () => ({
  DefaultMenuButton: () => null,
}));

const mockRouter = guardedRouter as jest.Mocked<typeof guardedRouter>;

describe('DefaultStartButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN navigation history exists WHEN the back chevron is pressed THEN it goes back', () => {
    (mockRouter.canGoBack as jest.Mock).mockReturnValue(true);
    const { getByTestId } = render(<DefaultStartButton isInnerScreen />);

    fireEvent.press(getByTestId('screen-back'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('GIVEN no history (cold-start deep link) WHEN the back chevron is pressed THEN it falls back to /home instead of no-oping', () => {
    (mockRouter.canGoBack as jest.Mock).mockReturnValue(false);
    const { getByTestId } = render(<DefaultStartButton isInnerScreen />);

    fireEvent.press(getByTestId('screen-back'));

    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/home');
  });
});
