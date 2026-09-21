import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { NO_SHELL, ShellProvider, useShell } from './shell.context';

function Probe() {
  const { isShell, frameWidth, tier, aside } = useShell();
  return <Text testID="probe">{`${isShell}|${frameWidth}|${tier}|${aside}`}</Text>;
}

const read = (ui: React.ReactElement) => render(ui).getByTestId('probe').props.children;

describe('useShell', () => {
  // The whole point of the seam: absence of a provider is the native answer, so native can never
  // learn about the desktop frame and no component needs a width read to find that out.
  it('GIVEN no provider WHEN read THEN the frame is absent', () => {
    expect(read(<Probe />)).toBe('false|false|-1|absent');
    expect(NO_SHELL).toEqual({ isShell: false, frameWidth: false, tier: -1, aside: 'absent' });
  });

  it('GIVEN the frame provides its state WHEN read THEN that state is published downward', () => {
    expect(
      read(
        <ShellProvider value={{ isShell: true, frameWidth: true, tier: 2, aside: 'expanded' }}>
          <Probe />
        </ShellProvider>,
      ),
    ).toBe('true|true|2|expanded');
  });

  it('GIVEN the frame is off for this route WHEN read THEN it reads exactly like native', () => {
    expect(
      read(
        <ShellProvider value={NO_SHELL}>
          <Probe />
        </ShellProvider>,
      ),
    ).toBe(read(<Probe />));
  });

  /*
   * The two questions the frame answers are different, and a consumer that mounts a navigator must
   * ask the width one. On a frameless route at desktop width `isShell` is false — the frame is not
   * around THIS route — while `frameWidth` stays true, because the viewport did not change. Branching
   * a navigator's shape on the first field rebuilds it every time a modal route opens over it.
   */
  it('GIVEN a frameless route at frame width WHEN read THEN the frame is off but the width is not', () => {
    expect(
      read(
        <ShellProvider value={{ ...NO_SHELL, frameWidth: true }}>
          <Probe />
        </ShellProvider>,
      ),
    ).toBe('false|true|-1|absent');
  });
});
