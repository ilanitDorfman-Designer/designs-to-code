import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import {
  ACTION_SLOT_SIZE,
  ACTIONS_PADDING,
  LEADING_SLOT_SIZE,
  SEARCH_GROUP_GAP,
  SEARCH_PILL_BG_OPACITY,
  SEARCH_PILL_HEIGHT,
  SEARCH_PILL_RADIUS,
  SEARCH_PILL_WIDTH,
  TOP_PANEL_HEIGHT_REGULAR,
  TOP_PANEL_HEIGHT_TALL,
  TOP_PANEL_PADDING_END,
  TOP_PANEL_PADDING_START,
  TORI_BADGE_HEIGHT,
  TORI_BADGE_RADIUS,
  TORI_BADGE_SKELETON_WIDTH,
  TORI_LABEL_GRADIENT_STOP,
} from '../constants';
import { EtTopPanel } from '../et-top-panel';

jest.mock('../../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('../../../../foundations/text/et-text', () => {
  const { Text } = require('react-native');
  return {
    EtText: function MockEtText({ children, ...props }: { children?: ReactNode }) {
      return <Text {...props}>{children}</Text>;
    },
  };
});

jest.mock('../../../et-icon-v2', () => {
  const { View: RNView } = require('react-native');
  return {
    EtIconV2: function MockEtIconV2(props: { name: string }) {
      return <RNView {...props} testID={`et-icon-${props.name}`} />;
    },
  };
});

jest.mock('../../../status/skeleton', () => {
  const { View: RNView } = require('react-native');
  return {
    EtSkeleton: function MockEtSkeleton(props: { width: number; height: number; borderRadius: number; testID?: string }) {
      return <RNView {...props} />;
    },
  };
});

jest.mock('@react-native-masked-view/masked-view', () => {
  const { View: RNView } = require('react-native');
  return {
    __esModule: true,
    default: function MockMaskedView({ maskElement, children, ...props }: { maskElement?: ReactNode; children?: ReactNode }) {
      return (
        <RNView {...props}>
          {maskElement}
          {children}
        </RNView>
      );
    },
  };
});

jest.mock('expo-linear-gradient', () => {
  const { View: RNView } = require('react-native');
  return {
    LinearGradient: function MockLinearGradient({ children, ...props }: { children?: ReactNode }) {
      return (
        <RNView {...props} testID="tori-label-gradient">
          {children}
        </RNView>
      );
    },
  };
});

/** Flattens any style prop into a plain object (empty object for undefined). */
const flat = (style: unknown): ViewStyle & TextStyle => StyleSheet.flatten(style as StyleProp<ViewStyle & TextStyle>) ?? {};

const renderPanel = (tall = false, leadingChildren?: ReactNode, actionsChildren?: ReactNode) =>
  render(
    <EtTopPanel tall={tall} testID="panel">
      <EtTopPanel.Leading testID="leading">{leadingChildren}</EtTopPanel.Leading>
      <EtTopPanel.Search onPress={jest.fn()} placeholder="Search for…" testID="search" />
      <EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" testID="tori" />
      <EtTopPanel.Actions testID="actions">{actionsChildren}</EtTopPanel.Actions>
    </EtTopPanel>,
  );

describe('EtTopPanel', () => {
  it('renders a row with 24/40 edge paddings and the slots — no border (design: none)', () => {
    renderPanel(false, <View testID="trigger" />);
    const panel = screen.getByTestId('panel');
    const style = flat(panel.props.style);
    expect(style.flexDirection).toBe('row');
    expect(style.paddingStart).toBe(TOP_PANEL_PADDING_START);
    expect(style.paddingEnd).toBe(TOP_PANEL_PADDING_END);
    expect(style.borderBottomWidth).toBeUndefined();
    expect(screen.getByTestId('leading')).toBeTruthy();
    expect(screen.getByTestId('search')).toBeTruthy();
    expect(screen.getByTestId('tori')).toBeTruthy();
    expect(screen.getByTestId('actions')).toBeTruthy();
  });

  it('centers search and the Tori badge as one group in the flexible zone', () => {
    renderPanel();
    // Walks up to the nearest HOST (native) ancestor, skipping composite wrappers.
    const hostParent = (node: ReactTestInstance): ReactTestInstance => {
      let current = node.parent;
      while (current && typeof current.type !== 'string') {
        current = current.parent;
      }
      return current as ReactTestInstance;
    };
    const searchZone = hostParent(screen.getByTestId('search'));
    // Both live in the same wrapper — the centered flex-1 zone with the 10px gap.
    expect(hostParent(screen.getByTestId('tori'))).toBe(searchZone);
    const zoneStyle = flat(searchZone.props.style);
    expect(zoneStyle.flex).toBe(1);
    expect(zoneStyle.justifyContent).toBe('center');
    expect(zoneStyle.gap).toBe(SEARCH_GROUP_GAP);
  });

  it('is 76px tall by default and has no corner radius (D8)', () => {
    renderPanel(false);
    const style = flat(screen.getByTestId('panel').props.style);
    expect(style.height).toBe(TOP_PANEL_HEIGHT_REGULAR);
    expect(style.borderRadius).toBeUndefined();
    expect(style.borderTopLeftRadius).toBeUndefined();
    expect(style.overflow).toBeUndefined();
  });

  it('is 84px tall with tall={true}', () => {
    renderPanel(true);
    expect(flat(screen.getByTestId('panel').props.style).height).toBe(TOP_PANEL_HEIGHT_TALL);
  });

  it('paints the theme backgroundBase', () => {
    renderPanel();
    expect(flat(screen.getByTestId('panel').props.style).backgroundColor).toBe(colorsMock.colors.backgroundBase);
  });

  it('is memoized with subcomponent statics attached', () => {
    expect((EtTopPanel as { $$typeof?: symbol }).$$typeof).toBe(Symbol.for('react.memo'));
    expect(EtTopPanel.displayName).toBe('EtTopPanel');
    expect(EtTopPanel.Leading.displayName).toBe('EtTopPanel.Leading');
    expect(EtTopPanel.Search.displayName).toBe('EtTopPanel.Search');
    expect(EtTopPanel.ToriBadge.displayName).toBe('EtTopPanel.ToriBadge');
    expect(EtTopPanel.Actions.displayName).toBe('EtTopPanel.Actions');
  });
});

describe('EtTopPanel.Leading', () => {
  it('is a 44px-tall content-sized slot when it has content — no width floor', () => {
    renderPanel(false, <View testID="trigger" />);
    const style = flat(screen.getByTestId('leading').props.style);
    expect(style.height).toBe(LEADING_SLOT_SIZE);
    // No minWidth: handed-up content may render null under the frame, and a
    // floor would hold a phantom box open where the design has nothing.
    expect(style.minWidth).toBeUndefined();
    expect(style.width).toBeUndefined();
  });

  it('with no children renders nothing — the centered group owes it no geometry', () => {
    renderPanel();
    expect(screen.queryByTestId('leading', { includeHiddenElements: true })).toBeNull();
  });

  it('treats boolean children from a false && conditional as empty', () => {
    renderPanel(false, false);
    expect(screen.queryByTestId('leading', { includeHiddenElements: true })).toBeNull();
  });

  it('treats null children from a ternary as empty', () => {
    renderPanel(false, null);
    expect(screen.queryByTestId('leading', { includeHiddenElements: true })).toBeNull();
  });
});

describe('EtTopPanel.Search', () => {
  it('is a 280×40 pill with radius 100', () => {
    renderPanel();
    const style = flat(screen.getByTestId('search').props.style);
    expect(style.width).toBe(SEARCH_PILL_WIDTH);
    expect(style.height).toBe(SEARCH_PILL_HEIGHT);
    expect(style.borderRadius).toBe(SEARCH_PILL_RADIUS);
  });

  it('renders the carbon900 background layer at 8% opacity', () => {
    renderPanel();
    const carbonLayer = screen.getByTestId('search').findAll((node: ReactTestInstance) => {
      if (typeof node.type !== 'string') return false;
      const style = flat(node.props.style);
      return style.opacity === SEARCH_PILL_BG_OPACITY && style.backgroundColor === colorsMock.colors.carbon900;
    });
    expect(carbonLayer).toHaveLength(1);
  });

  it('renders the search icon and the single-line text in the primary text color', () => {
    renderPanel();
    expect(screen.getByTestId('et-icon-search')).toBeTruthy();
    const placeholder = screen.getByText('Search for…');
    expect(placeholder.props.numberOfLines).toBe(1);
    expect(placeholder.props.variant).toBe('body-secondary-regular');
    expect(flat(placeholder.props.style).color).toBe(colorsMock.colors.carbon900);
  });

  it('is a button labelled by the placeholder by default', () => {
    renderPanel();
    const search = screen.getByTestId('search');
    expect(search.props.accessibilityRole).toBe('button');
    expect(search.props.accessibilityLabel).toBe('Search for…');
  });

  it('accepts a custom accessibility label', () => {
    render(<EtTopPanel.Search accessibilityLabel="Open search" onPress={jest.fn()} placeholder="Search for…" />);
    expect(screen.getByLabelText('Open search')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<EtTopPanel.Search onPress={onPress} placeholder="Search for…" testID="search" />);
    fireEvent.press(screen.getByTestId('search'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders the rest-state xmark in carbon400, hidden from AT (D5)', () => {
    renderPanel();
    // Hidden from default (accessible) queries…
    expect(screen.queryByTestId('et-icon-xmark-circle-fill')).toBeNull();
    // …but still rendered (decorative, per the DS rest-state variant).
    const xmark = screen.getByTestId('et-icon-xmark-circle-fill', { includeHiddenElements: true });
    expect(xmark.props.color).toBe(colorsMock.colors.carbon400);
    expect(screen.getByTestId('search-clear', { includeHiddenElements: true }).props['aria-hidden']).toBe(true);
  });
});

describe('EtTopPanel.ToriBadge', () => {
  it('is a 40px accentE100 pill with radius 100', () => {
    renderPanel();
    const style = flat(screen.getByTestId('tori').props.style);
    expect(style.height).toBe(TORI_BADGE_HEIGHT);
    expect(style.borderRadius).toBe(TORI_BADGE_RADIUS);
    expect(style.backgroundColor).toBe(colorsMock.colors.accentE100);
  });

  it('renders the logo and the label as ONE gradient run at the Figma stop', () => {
    renderPanel();
    expect(screen.getByTestId('et-icon-tori-logo', { includeHiddenElements: true })).toBeTruthy();
    const gradient = screen.getByTestId('tori-label-gradient');
    expect(gradient.props.colors).toEqual([colorsMock.colors.carbon900, colorsMock.colors.verdictPositive600]);
    expect(gradient.props.locations).toEqual([0, TORI_LABEL_GRADIENT_STOP]);
    // The label is the joined string masked by the gradient — no split spans.
    expect(screen.getAllByText('Ask Tori').length).toBeGreaterThanOrEqual(1);
  });

  it('without onPress it is a plain view: no role and NO container label — the text announces itself', () => {
    renderPanel();
    const badge = screen.getByTestId('tori');
    // A label on a role-less container is dead on native (plain View is not an
    // accessibility element) and invalid ARIA on web — the visible text is the
    // accessible name.
    expect(badge.props.accessibilityLabel).toBeUndefined();
    expect(badge.props.accessibilityRole).toBeUndefined();
    expect(screen.getAllByText('Ask Tori').length).toBeGreaterThanOrEqual(1);
  });

  it('becomes a button labelled by both label parts and fires onPress when wired', () => {
    const onPress = jest.fn();
    render(<EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" onPress={onPress} testID="tori" />);
    const badge = screen.getByTestId('tori');
    expect(badge.props.accessibilityRole).toBe('button');
    expect(badge.props.accessibilityLabel).toBe('Ask Tori');
    fireEvent.press(badge);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('swaps to a same-footprint skeleton pill while loading', () => {
    render(<EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" loading testID="tori" />);
    expect(screen.queryByTestId('tori')).toBeNull();
    const skeleton = screen.getByTestId('tori-skeleton');
    expect(skeleton.props.width).toBe(TORI_BADGE_SKELETON_WIDTH);
    expect(skeleton.props.height).toBe(TORI_BADGE_HEIGHT);
    expect(skeleton.props.borderRadius).toBe(TORI_BADGE_RADIUS);
    expect(screen.queryByText(/Tori/)).toBeNull();
  });
});

describe('EtTopPanel.Actions', () => {
  it('hugs a lone bell as a 44×44 icon button (36 slot + 4 padding), no spacers', () => {
    renderPanel(false, undefined, <View testID="bell" />);
    const actions = screen.getByTestId('actions');
    const style = flat(actions.props.style);
    expect(style.width).toBeUndefined();
    expect(style.padding).toBe(ACTIONS_PADDING);
    const slots = actions.findAll((node: ReactTestInstance) => {
      if (typeof node.type !== 'string') return false;
      const slotStyle = flat(node.props.style);
      return slotStyle.width === ACTION_SLOT_SIZE && slotStyle.height === ACTION_SLOT_SIZE;
    });
    expect(slots).toHaveLength(1);
    expect(screen.getByTestId('bell')).toBeTruthy();
  });

  it('renders a handed-up action RAW before the bell — never boxed into a slot', () => {
    render(
      <EtTopPanel tall={false} testID="panel">
        <EtTopPanel.Actions leading={<View testID="screen-action" />} testID="actions">
          <View testID="bell" />
        </EtTopPanel.Actions>
      </EtTopPanel>,
    );
    const actions = screen.getByTestId('actions');
    // Still exactly ONE 36×36 slot (the bell's) — a fixed box around the hand-up
    // would re-create phantom geometry when it renders null under the frame.
    const slots = actions.findAll((node: ReactTestInstance) => {
      if (typeof node.type !== 'string') return false;
      const slotStyle = flat(node.props.style);
      return slotStyle.width === ACTION_SLOT_SIZE && slotStyle.height === ACTION_SLOT_SIZE;
    });
    expect(slots).toHaveLength(1);
    expect(screen.getByTestId('screen-action')).toBeTruthy();
    expect(screen.getByTestId('bell')).toBeTruthy();
  });
});
