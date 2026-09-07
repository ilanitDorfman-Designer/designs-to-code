import { act, fireEvent, render } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

import type { EtTableColumn } from '../../api';
import { EtTableHorizontalEndFade } from '../et-table-horizontal-end-fade';

jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({ colors: { backgroundBase: '#000000', bgNeutralPrimary: '#000000' } }),
}));

const columns: EtTableColumn[] = [
  { name: 'asset', title: 'Asset', width: 160, isFirstColumn: true },
  { name: 'price', title: 'Price', width: 100 },
  { name: 'change', title: 'Change', width: 100 },
  { name: 'value', title: 'Value', width: 100 },
];

describe('EtTableHorizontalEndFade', () => {
  it('measures and follows a SharedValue without triggering React rerenders', () => {
    let renderCount = 0;
    let setScrollOffset: ((value: number) => void) | undefined;

    function Harness() {
      renderCount += 1;
      const scrollOffsetX = useSharedValue(0);
      setScrollOffset = (value: number) => scrollOffsetX.set(value);
      return <EtTableHorizontalEndFade columns={columns} scrollOffsetX={scrollOffsetX} testID="table-end-fade" />;
    }

    const { getByTestId } = render(<Harness />);
    const fade = getByTestId('table-end-fade');

    fireEvent(fade, 'layout', { nativeEvent: { layout: { width: 320 } } });
    act(() => setScrollOffset?.(100));

    expect(renderCount).toBe(1);
    expect(fade.props.pointerEvents).toBe('none');
  });
});
