import { render } from '@testing-library/react-native';

import { TickerFilterIcon } from './ticker-filter-icon';

// Mock EtoroIcon
jest.mock('../../../../foundations/icon-assets', () => ({
  EtoroIcon: ({ icon, appearance, ...props }: any) => {
    const MockView = require('react-native').View;
    return <MockView testID="etoro-icon" accessibilityLabel={`icon-${icon.iconName}-size-${appearance.size}`} {...props} />;
  },
}));

describe('TickerFilterIcon', () => {
  describe('Rendering', () => {
    it('should render EtoroIcon component', () => {
      const { getByTestId } = render(<TickerFilterIcon />);

      expect(getByTestId('etoro-icon')).toBeDefined();
    });

    it('should use sortDescending icon with size 18', () => {
      const { getByLabelText } = render(<TickerFilterIcon />);

      expect(getByLabelText('icon-sortDescending-size-18')).toBeDefined();
    });
  });

  describe('DisplayName', () => {
    it('should have correct displayName', () => {
      expect(TickerFilterIcon.displayName).toBe('EtTicker.FilterIcon');
    });
  });

  describe('Independence from context', () => {
    it('should render without EtTicker context', () => {
      // Unlike other subcomponents, FilterIcon doesn't need context
      expect(() => render(<TickerFilterIcon />)).not.toThrow();
    });
  });
});
