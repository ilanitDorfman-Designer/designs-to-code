import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { ReactNode } from 'react';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import type { SideMenuCloseReason, SideMenuTier } from '../api/types';
import { PANEL_WIDTH, TILE_GUTTER, TILE_MIN_HEIGHT, TILE_PADDING, TILE_RADIUS } from '../constants';
import { EtSideMenu } from '../et-side-menu';
import { findLayerByWidth, flat } from './side-menu-test-helpers';

jest.mock('../../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('../../../../core/hooks/accessibility/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

let mockDirection: 'ltr' | 'rtl' = 'ltr';
jest.mock('../../../../core/hooks/use-layout-direction', () => ({
  useLayoutDirection: () => mockDirection,
}));

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
  const { IconVariant } = jest.requireActual('../../../et-icon-v2/api/types') as {
    IconVariant: Record<string, string>;
  };
  return {
    IconVariant,
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

type OnExpandedChange = (expanded: boolean, reason: SideMenuCloseReason | 'open') => void;

interface TileHarnessProps {
  tier?: SideMenuTier;
  expanded?: boolean;
  onExpandedChange?: OnExpandedChange;
  tile: ReactNode;
}

const renderTile = ({ tier = 0, expanded = false, onExpandedChange = jest.fn<OnExpandedChange>(), tile }: TileHarnessProps) =>
  render(
    <EtSideMenu expanded={expanded} onExpandedChange={onExpandedChange} testID="side-menu" tier={tier}>
      {tile}
    </EtSideMenu>,
  );

const panelLayer = () => findLayerByWidth(screen.getByTestId('side-menu'), PANEL_WIDTH);

// The INACTIVE layer is aria-hidden, so queries into it must opt in explicitly.
const HIDDEN = { includeHiddenElements: true } as const;

describe('EtSideMenu.Tile', () => {
  beforeEach(() => {
    mockDirection = 'ltr';
  });

  it('renders in the panel layer only — the rail has no tile', () => {
    renderTile({ tile: <EtSideMenu.Tile icon="star" subtitle="Manage benefits" testID="tile" title="Club Select" /> });
    expect(screen.getAllByTestId('tile-panel', HIDDEN)).toHaveLength(1);
    expect(within(panelLayer()).getByTestId('tile-panel', HIDDEN)).toBeTruthy();
  });

  it('renders icon + title + subtitle + trailing chevron on the card surface', () => {
    renderTile({ tile: <EtSideMenu.Tile icon="star" subtitle="Manage benefits" testID="tile" title="Club Select" /> });
    const tile = within(screen.getByTestId('tile-panel', HIDDEN));
    expect(tile.getByTestId('et-icon-star', HIDDEN)).toBeTruthy();
    expect(tile.getByText('Club Select', HIDDEN).props.variant).toBe('label-primary-semibold');
    expect(tile.getByText('Manage benefits', HIDDEN).props.variant).toBe('body-secondary-regular');
    expect(tile.getByTestId('et-icon-angle-right', HIDDEN)).toBeTruthy();
  });

  it('the card is inset by the tile gutter and painted on cardDefault with the tile radius', () => {
    renderTile({ tile: <EtSideMenu.Tile subtitle="Join the Club" testID="tile" title="Club" /> });
    const block = screen.getByTestId('tile-panel', HIDDEN);
    expect(flat(block.props.style).paddingHorizontal).toBe(TILE_GUTTER);
    const card = block.findAll(
      (node) => typeof node.type === 'string' && flat(node.props.style).backgroundColor === colorsMock.colors.cardDefault,
    )[0];
    const cardStyle = flat(card.props.style);
    expect(cardStyle.borderRadius).toBe(TILE_RADIUS);
    expect(cardStyle.padding).toBe(TILE_PADDING);
    expect(cardStyle.minHeight).toBe(TILE_MIN_HEIGHT);
  });

  it('with onPress it is a button labelled by title + subtitle; press fires AND collapses the panel (Item contract)', () => {
    const onPress = jest.fn();
    const onExpandedChange = jest.fn<OnExpandedChange>();
    renderTile({
      expanded: true,
      onExpandedChange,
      tile: <EtSideMenu.Tile onPress={onPress} subtitle="Manage benefits" testID="tile" title="Club Select" />,
    });
    const button = screen.getByLabelText('Club Select, Manage benefits');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onExpandedChange).toHaveBeenCalledWith(false, 'item');
  });

  it('the chevron mirrors via scaleX(-1) in RTL', () => {
    mockDirection = 'rtl';
    renderTile({ tile: <EtSideMenu.Tile subtitle="Manage benefits" testID="tile" title="Club Select" /> });
    // The block's reveal style is also a transform, so collect all and pick the mirror.
    const transforms = screen
      .getByTestId('tile-panel', HIDDEN)
      .findAll((node) => typeof node.type === 'string' && flat(node.props.style).transform !== undefined)
      .map((node) => flat(node.props.style).transform);
    expect(transforms).toContainEqual([{ scaleX: -1 }]);
  });

  it('without onPress it renders as a plain view (no button role)', () => {
    renderTile({ tile: <EtSideMenu.Tile subtitle="Manage benefits" testID="tile" title="Club Select" /> });
    expect(screen.queryByLabelText('Club Select, Manage benefits', HIDDEN)).toBeNull();
  });

  it('while loading it renders the card-footprint skeleton instead of content', () => {
    renderTile({ tile: <EtSideMenu.Tile loading subtitle="Manage benefits" testID="tile" title="Club Select" /> });
    const skeleton = screen.getByTestId('tile-skeleton', HIDDEN);
    expect(skeleton.props.width).toBe(PANEL_WIDTH - 2 * TILE_GUTTER);
    expect(skeleton.props.height).toBe(TILE_MIN_HEIGHT + 2 * TILE_PADDING);
    expect(skeleton.props.borderRadius).toBe(TILE_RADIUS);
    expect(screen.queryByText('Club Select', HIDDEN)).toBeNull();
  });
});
