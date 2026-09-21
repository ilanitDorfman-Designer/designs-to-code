import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { StyleSheet, Text, View } from 'react-native';

import { EtAssetInfo } from './et-asset-info';
import { useEtAssetInfoContext } from './hooks';

jest.mock('../../../core/hooks/use-etoro-theme');
jest.mock('../../social/avatar', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const MockAvatar = ({ children, testID, ...props }: React.PropsWithChildren<{ testID?: string } & Record<string, unknown>>) =>
    React.createElement(View, { ...props, testID: testID ?? 'mock-avatar' }, children);
  MockAvatar.Image = () => React.createElement(View, { testID: 'mock-avatar-image' });
  return { EtAvatar: MockAvatar };
});

describe('EtAssetInfo', () => {
  const defaultData = {
    avatar: {
      source: 'https://example.com/logo.png',
      size: 'medium' as const,
      shape: 'square' as const,
    },
    title: 'AAPL',
    subtitle: 'Apple Inc',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders with avatar, title and subtitle in horizontal layout', () => {
      const { getByText, getByTestId } = render(
        <EtAssetInfo data={defaultData} layout="horizontal">
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc')).toBeTruthy();
      expect(getByTestId('mock-avatar')).toBeTruthy();
    });

    it('renders with vertical layout', () => {
      const { getByText } = render(
        <EtAssetInfo data={defaultData} layout="vertical">
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc')).toBeTruthy();
    });

    it('defaults to horizontal layout when layout is omitted', () => {
      const { getByText } = render(
        <EtAssetInfo data={defaultData}>
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc')).toBeTruthy();
    });
  });

  describe('Subcomponents', () => {
    it('has Avatar, Title and Subtitle as static properties', () => {
      expect(EtAssetInfo.Avatar).toBeDefined();
      expect(EtAssetInfo.Title).toBeDefined();
      expect(EtAssetInfo.Subtitle).toBeDefined();
    });

    it('renders only Title when Subtitle is omitted', () => {
      const { getByText, queryByText } = render(
        <EtAssetInfo
          data={{
            ...defaultData,
            subtitle: undefined,
          }}
        >
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
        </EtAssetInfo>,
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(queryByText('Apple Inc')).toBeNull();
    });

    it('renders custom title children', () => {
      const { getByText } = render(
        <EtAssetInfo data={{ avatar: defaultData.avatar }}>
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title>
            <Text>Custom Title</Text>
          </EtAssetInfo.Title>
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      );

      expect(getByText('Custom Title')).toBeTruthy();
    });

    it('renders custom avatar children inside the avatar', () => {
      const { getByTestId } = render(
        <EtAssetInfo data={defaultData}>
          <EtAssetInfo.Avatar>
            <View testID="avatar-child" />
          </EtAssetInfo.Avatar>
          <EtAssetInfo.Title />
        </EtAssetInfo>,
      );

      expect(getByTestId('avatar-child')).toBeTruthy();
    });
  });

  describe('Context', () => {
    it('useEtAssetInfoContext throws when used outside EtAssetInfo', () => {
      function BadComponent() {
        useEtAssetInfoContext();
        return <View />;
      }

      expect(() => render(<BadComponent />)).toThrow('must be used within an EtAssetInfo component');
    });
  });

  describe('Avatar validation', () => {
    it('EtAssetInfo.Avatar renders null when avatar source is missing', () => {
      const { queryByTestId } = render(
        <EtAssetInfo data={{ title: 'Bitcoin' }}>
          <EtAssetInfo.Avatar />
        </EtAssetInfo>,
      );

      expect(queryByTestId('mock-avatar')).toBeNull();
    });

    it('EtAssetInfo.Avatar renders null when avatar source is empty string', () => {
      const { queryByTestId } = render(
        <EtAssetInfo data={{ avatar: { source: '' } }}>
          <EtAssetInfo.Avatar />
        </EtAssetInfo>,
      );

      expect(queryByTestId('mock-avatar')).toBeNull();
    });
  });

  describe('Props', () => {
    it('accepts and applies custom style to root container', () => {
      const customStyle = { margin: 10 };
      const { getByText } = render(
        <EtAssetInfo data={defaultData} style={customStyle}>
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc')).toBeTruthy();
    });

    it('accepts maxWidth in horizontal layout', () => {
      const { getByText } = render(
        <EtAssetInfo data={defaultData} layout="horizontal" maxWidth={140}>
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      );

      expect(getByText('AAPL')).toBeTruthy();
    });

    it('applies flex shrink styles when shrink is true', () => {
      const tree = render(
        <EtAssetInfo data={defaultData} layout="horizontal" shrink>
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      ).toJSON() as import('react-test-renderer').ReactTestRendererJSON;

      const rootStyle = StyleSheet.flatten(tree.props.style);
      expect(rootStyle).toEqual(expect.objectContaining({ flex: 1 }));

      // Text block is the View child that is NOT the mock avatar (no testID)
      type TreeNode = import('react-test-renderer').ReactTestRendererJSON;
      const viewChildren = (tree.children ?? []).filter((child): child is TreeNode => typeof child === 'object' && child?.type === 'View');
      const textBlock = viewChildren.find((child) => child.props.testID !== 'mock-avatar');
      expect(textBlock).toBeTruthy();
      const textBlockStyle = StyleSheet.flatten(textBlock!.props.style);
      expect(textBlockStyle).toEqual(expect.objectContaining({ flex: 1, minWidth: 0 }));
    });

    it.each([
      { label: 'omitted', extraProps: {} },
      { label: 'false', extraProps: { shrink: false as const } },
    ])('does not apply shrink styles when shrink is $label', ({ extraProps }) => {
      const tree = render(
        <EtAssetInfo data={defaultData} layout="horizontal" {...extraProps}>
          <EtAssetInfo.Avatar />
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      ).toJSON() as import('react-test-renderer').ReactTestRendererJSON;

      const rootStyle = StyleSheet.flatten(tree.props.style);
      expect(rootStyle.flex).toBeUndefined();

      type TreeNode = import('react-test-renderer').ReactTestRendererJSON;
      const viewChildren = (tree.children ?? []).filter((child): child is TreeNode => typeof child === 'object' && child?.type === 'View');
      const textBlock = viewChildren.find((child) => child.props.testID !== 'mock-avatar');
      expect(textBlock).toBeTruthy();
      const textBlockStyle = StyleSheet.flatten(textBlock!.props.style);
      expect(textBlockStyle.flex).toBeUndefined();
      expect(textBlockStyle.minWidth).toBeUndefined();
    });
  });

  describe('Component structure', () => {
    it('has displayName set', () => {
      expect(EtAssetInfo.displayName).toBe('EtAssetInfo');
    });

    it('ignores non-compound children (only known slots are rendered)', () => {
      const { getByText, queryByText } = render(
        <EtAssetInfo data={defaultData}>
          <EtAssetInfo.Avatar />
          <Text>Ignored</Text>
          <EtAssetInfo.Title />
          <EtAssetInfo.Subtitle />
        </EtAssetInfo>,
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc')).toBeTruthy();
      expect(queryByText('Ignored')).toBeNull();
    });
  });
});
