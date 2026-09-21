import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import type { TickerItem } from '../api';
import { EtTicker } from '../et-ticker';

jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textSecondaryNeutral: '#666666',
      statusPositive: '#00CC44',
      statusNegative: '#FF3366',
    },
  }),
}));

const mockItem: TickerItem = {
  instrumentId: 1,
  name: 'AAPL',
  currentPrice: 150.25,
  dailyChange: 2.5,
  navigationUrl: '/instruments/1',
};

describe('TickerStart', () => {
  it('should render children', () => {
    const { getByText } = render(
      <EtTicker items={[mockItem]}>
        <EtTicker.Start>
          <Text>Filter</Text>
        </EtTicker.Start>
      </EtTicker>,
    );

    expect(getByText('Filter')).toBeDefined();
  });

  it('should render with proper margins for spacing', () => {
    const { getByTestId } = render(
      <EtTicker items={[mockItem]}>
        <EtTicker.Start testID="start-slot">
          <Text>Filter</Text>
        </EtTicker.Start>
      </EtTicker>,
    );

    const startSlot = getByTestId('start-slot');
    expect(startSlot).toBeDefined();
    // TickerStart should have marginRight for spacing (style is an array)
    expect(startSlot.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ marginRight: 16 })]));
  });

  it('should accept testID', () => {
    const { getByTestId } = render(
      <EtTicker items={[mockItem]}>
        <EtTicker.Start testID="start-slot">
          <Text>Filter</Text>
        </EtTicker.Start>
      </EtTicker>,
    );

    expect(getByTestId('start-slot')).toBeDefined();
  });

  it('should have correct displayName', () => {
    const { TickerStart } = require('./ticker-slot');
    expect(TickerStart.displayName).toBe('EtTicker.Start');
  });
});

describe('TickerEnd', () => {
  it('should render children', () => {
    const { getByText } = render(
      <EtTicker items={[mockItem]}>
        <EtTicker.End>
          <Text>Close</Text>
        </EtTicker.End>
      </EtTicker>,
    );

    expect(getByText('Close')).toBeDefined();
  });

  it('should render with proper margins for spacing', () => {
    const { getByTestId } = render(
      <EtTicker items={[mockItem]}>
        <EtTicker.End testID="end-slot">
          <Text>Close</Text>
        </EtTicker.End>
      </EtTicker>,
    );

    const endSlot = getByTestId('end-slot');
    expect(endSlot).toBeDefined();
    // TickerEnd should have marginLeft for spacing (style is an array)
    expect(endSlot.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ marginLeft: 16 })]));
  });

  it('should accept testID', () => {
    const { getByTestId } = render(
      <EtTicker items={[mockItem]}>
        <EtTicker.End testID="end-slot">
          <Text>Close</Text>
        </EtTicker.End>
      </EtTicker>,
    );

    expect(getByTestId('end-slot')).toBeDefined();
  });

  it('should have correct displayName', () => {
    const { TickerEnd } = require('./ticker-slot');
    expect(TickerEnd.displayName).toBe('EtTicker.End');
  });
});

describe('TickerStart + TickerEnd together', () => {
  it('should render both slots alongside content', () => {
    const { getByText } = render(
      <EtTicker items={[mockItem]}>
        <EtTicker.Start>
          <Text>Start</Text>
        </EtTicker.Start>
        <Text>Middle</Text>
        <EtTicker.End>
          <Text>End</Text>
        </EtTicker.End>
      </EtTicker>,
    );

    expect(getByText('Start')).toBeDefined();
    expect(getByText('Middle')).toBeDefined();
    expect(getByText('End')).toBeDefined();
  });
});
