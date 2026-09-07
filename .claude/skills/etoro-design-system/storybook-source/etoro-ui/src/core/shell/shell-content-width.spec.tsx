import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { frameOccupiedWidth } from '../../components/shell/app-layout/constants';
import { ShellContentWidthProvider, useContentWidth } from './shell-content-width';

function Probe() {
  return <Text testID="probe">{String(useContentWidth())}</Text>;
}

const read = (ui: React.ReactElement) => render(ui).getByTestId('probe').props.children;

// What `useWindowDimensions()` reports under the RN preset, and therefore what a screen with no
// frame around it must get back.
const WINDOW_WIDTH = Number(read(<Probe />));

describe('useContentWidth', () => {
  // Native and phone-width web: identical to what a screen measures today.
  it('GIVEN no frame WHEN read THEN it is the window width', () => {
    expect(read(<Probe />)).toBe(String(WINDOW_WIDTH));
  });

  it('GIVEN the frame publishes its content column WHEN read THEN that width wins', () => {
    expect(
      read(
        <ShellContentWidthProvider width={1080}>
          <Probe />
        </ShellContentWidthProvider>,
      ),
    ).toBe('1080');
  });

  it('GIVEN the frame publishes null WHEN read THEN it falls back to the window', () => {
    expect(
      read(
        <ShellContentWidthProvider width={null}>
          <Probe />
        </ShellContentWidthProvider>,
      ),
    ).toBe(read(<Probe />));
  });
});

describe('frameOccupiedWidth', () => {
  const RAIL = 72;

  it('GIVEN no aside on this route THEN only the side-menu rail is taken', () => {
    expect(frameOccupiedWidth({ railWidth: RAIL, aside: 'absent', asideInline: false, asidePanelWidth: 360 })).toBe(RAIL);
  });

  it('GIVEN the rail is hidden at the lowest tier THEN the menu takes nothing', () => {
    expect(frameOccupiedWidth({ railWidth: 0, aside: 'absent', asideInline: false, asidePanelWidth: 360 })).toBe(0);
  });

  // Overlay mode: the open panel floats over main, so main only ever loses the closed rail.
  it('GIVEN an overlay aside THEN main loses the closed rail whether it is open or not', () => {
    const collapsed = frameOccupiedWidth({ railWidth: RAIL, aside: 'collapsed', asideInline: false, asidePanelWidth: 360 });
    const expanded = frameOccupiedWidth({ railWidth: RAIL, aside: 'expanded', asideInline: false, asidePanelWidth: 360 });
    expect(collapsed).toBe(RAIL + 8 + 60);
    expect(expanded).toBe(collapsed);
  });

  // In-flow mode: opening the aside reflows main, so the panel width is really gone.
  it('GIVEN an in-flow aside THEN opening it takes the panel width out of main', () => {
    expect(frameOccupiedWidth({ railWidth: RAIL, aside: 'collapsed', asideInline: true, asidePanelWidth: 360 })).toBe(RAIL + 12 + 60);
    expect(frameOccupiedWidth({ railWidth: RAIL, aside: 'expanded', asideInline: true, asidePanelWidth: 360 })).toBe(RAIL + 12 + 360);
  });
});
