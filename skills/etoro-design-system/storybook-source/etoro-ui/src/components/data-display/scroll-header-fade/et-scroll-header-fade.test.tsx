import { render } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

import { EtScrollHeaderFade } from './et-scroll-header-fade';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: { bgNeutralPrimary: '#FFFFFF' },
    isDarkMode: false,
  })),
}));

// Rendered outside an EtScreen, so the optional screen context resolves to null and the component
// falls back to its internal shared value (opacity pinned at 0).
jest.mock('../../screen/api/context', () => ({
  useOptionalScreenContext: () => null,
}));

describe('EtScrollHeaderFade', () => {
  it('renders a gradient overlay without throwing', () => {
    const { UNSAFE_getByType } = render(<EtScrollHeaderFade />);
    // LinearGradient is mocked to the string 'LinearGradient' host in the etoro-ui test setup.
    expect(UNSAFE_getByType('LinearGradient' as never)).toBeTruthy();
  });

  it('applies the provided height to the overlay container (and pushes it down by the same amount)', () => {
    const { toJSON } = render(<EtScrollHeaderFade height={48} />);
    const tree = JSON.stringify(toJSON());
    expect(tree).toContain('"height":48');
    expect(tree).toContain('"translateY":48');
  });

  it('pins to the host bottom edge without pushing down when edge="top" (footer fade)', () => {
    const { toJSON } = render(<EtScrollHeaderFade edge="top" height={48} />);
    const tree = JSON.stringify(toJSON());
    expect(tree).toContain('"height":48');
    expect(tree).toContain('"translateY":0');
  });

  it('accepts an explicit scrollY source', () => {
    function Harness() {
      const scrollY = useSharedValue(0);
      return <EtScrollHeaderFade scrollY={scrollY} color="#101010" />;
    }
    expect(() => render(<Harness />)).not.toThrow();
  });
});
