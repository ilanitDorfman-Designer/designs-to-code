import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { StyleSheet, Text, View } from 'react-native';

import { EtUserInfo } from './et-user-info';
import { useEtUserInfoContext } from './hooks';

jest.mock('../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      textPrimaryNeutral: '#262626',
    },
  })),
}));
jest.mock('../../social/avatar', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const MockAvatar = ({ children, testID, ...props }: React.PropsWithChildren<{ testID?: string } & Record<string, unknown>>) =>
    React.createElement(View, { ...props, testID: testID ?? 'mock-avatar' }, children);
  MockAvatar.Image = () => React.createElement(View, { testID: 'mock-avatar-image' });
  return { EtAvatar: MockAvatar };
});

describe('EtUserInfo', () => {
  const defaultData = {
    avatar: {
      source: 'https://example.com/avatar.png',
      size: 'medium' as const,
      alt: 'Test User',
    },
    title: 'Emma Collins',
    subtitle: '@emmacollins',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders with avatar, title and subtitle in horizontal layout', () => {
      const { getByText, getByTestId } = render(
        <EtUserInfo data={defaultData} layout="horizontal">
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      expect(getByText('Emma Collins')).toBeTruthy();
      expect(getByText('@emmacollins')).toBeTruthy();
      expect(getByTestId('mock-avatar')).toBeTruthy();
    });

    it('renders with vertical layout', () => {
      const { getByText } = render(
        <EtUserInfo data={defaultData} layout="vertical">
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      expect(getByText('Emma Collins')).toBeTruthy();
      expect(getByText('@emmacollins')).toBeTruthy();
    });

    it('defaults to horizontal layout when layout is omitted', () => {
      const { getByText } = render(
        <EtUserInfo data={defaultData}>
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      expect(getByText('Emma Collins')).toBeTruthy();
      expect(getByText('@emmacollins')).toBeTruthy();
    });

    it('renders default content from data when children are omitted', () => {
      const { getByText, getByTestId } = render(<EtUserInfo data={defaultData} />);

      expect(getByText('Emma Collins')).toBeTruthy();
      expect(getByText('@emmacollins')).toBeTruthy();
      expect(getByTestId('mock-avatar')).toBeTruthy();
    });
  });

  describe('Subcomponents', () => {
    it('has Avatar, Title and Subtitle as static properties', () => {
      expect(EtUserInfo.Avatar).toBeDefined();
      expect(EtUserInfo.Title).toBeDefined();
      expect(EtUserInfo.Subtitle).toBeDefined();
    });

    it('renders only Title when Subtitle is omitted', () => {
      const { getByText, queryByText } = render(
        <EtUserInfo
          data={{
            ...defaultData,
            subtitle: undefined,
          }}
        >
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
        </EtUserInfo>,
      );

      expect(getByText('Emma Collins')).toBeTruthy();
      expect(queryByText('@emmacollins')).toBeNull();
    });

    it('renders custom title children', () => {
      const { getByText } = render(
        <EtUserInfo data={{ avatar: defaultData.avatar }}>
          <EtUserInfo.Avatar />
          <EtUserInfo.Title>
            <Text>Custom Title</Text>
          </EtUserInfo.Title>
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      expect(getByText('Custom Title')).toBeTruthy();
    });
  });

  describe('Context', () => {
    it('useEtUserInfoContext throws when used outside EtUserInfo', () => {
      function BadComponent() {
        useEtUserInfoContext();
        return <View />;
      }

      expect(() => render(<BadComponent />)).toThrow('must be used within an EtUserInfo component');
    });
  });

  describe('Avatar validation', () => {
    it('EtUserInfo.Avatar renders null when avatar source is missing', () => {
      const { queryByTestId } = render(
        <EtUserInfo data={{ title: 'Emma Collins' }}>
          <EtUserInfo.Avatar />
        </EtUserInfo>,
      );

      expect(queryByTestId('mock-avatar')).toBeNull();
    });

    it('EtUserInfo.Avatar renders null when avatar source is empty string', () => {
      const { queryByTestId } = render(
        <EtUserInfo data={{ avatar: { source: '' } }}>
          <EtUserInfo.Avatar />
        </EtUserInfo>,
      );

      expect(queryByTestId('mock-avatar')).toBeNull();
    });
  });

  describe('Props', () => {
    it('accepts and applies custom style to root container', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <EtUserInfo data={defaultData} style={customStyle} testID="et-user-info">
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      const root = getByTestId('et-user-info');
      expect(root).toBeTruthy();
      expect(root).toHaveStyle(customStyle);
    });

    it('accepts maxWidth in horizontal layout', () => {
      const { getByTestId } = render(
        <EtUserInfo data={defaultData} layout="horizontal" maxWidth={140}>
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      const textBlock = getByTestId('et-user-info-text-block');
      expect(textBlock).toBeTruthy();
      expect(textBlock).toHaveStyle({ maxWidth: 140 });
    });

    it('accepts ellipsizeMode prop', () => {
      const { getByText } = render(
        <EtUserInfo data={defaultData} ellipsizeMode="tail">
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      const titleText = getByText('Emma Collins');
      const subtitleText = getByText('@emmacollins');
      expect(titleText).toBeTruthy();
      expect(subtitleText).toBeTruthy();
      expect(titleText.props.ellipsizeMode).toBe('tail');
      expect(subtitleText.props.ellipsizeMode).toBe('tail');
    });
  });

  describe('shrink layout', () => {
    it('applies flex shrink styles when shrink is true', () => {
      const tree = render(
        <EtUserInfo data={defaultData} layout="horizontal" shrink>
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      ).toJSON() as import('react-test-renderer').ReactTestRendererJSON;

      const rootStyle = StyleSheet.flatten(tree.props.style);
      expect(rootStyle).toEqual(expect.objectContaining({ flex: 1 }));

      type TreeNode = import('react-test-renderer').ReactTestRendererJSON;
      const viewChildren = (tree.children ?? []).filter((child): child is TreeNode => typeof child === 'object' && child?.type === 'View');
      const textBlock = viewChildren.find((child) => child.props.testID === 'et-user-info-text-block');
      expect(textBlock).toBeTruthy();
      const textBlockStyle = StyleSheet.flatten(textBlock!.props.style);
      expect(textBlockStyle).toEqual(expect.objectContaining({ flex: 1, minWidth: 0 }));
    });

    it('still ellipsizes the text block when shrink is omitted', () => {
      const tree = render(
        <EtUserInfo data={defaultData} layout="horizontal">
          <EtUserInfo.Avatar />
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      ).toJSON() as import('react-test-renderer').ReactTestRendererJSON;

      const rootStyle = StyleSheet.flatten(tree.props.style);
      expect(rootStyle.flex).toBeUndefined();
      expect(rootStyle.alignSelf).toBe('stretch');

      type TreeNode = import('react-test-renderer').ReactTestRendererJSON;
      const viewChildren = (tree.children ?? []).filter((child): child is TreeNode => typeof child === 'object' && child?.type === 'View');
      const textBlock = viewChildren.find((child) => child.props.testID === 'et-user-info-text-block');
      expect(StyleSheet.flatten(textBlock!.props.style)).toEqual(expect.objectContaining({ flex: 1, minWidth: 0 }));
    });
  });

  describe('Component structure', () => {
    it('has displayName set', () => {
      expect(EtUserInfo.displayName).toBe('EtUserInfo');
    });

    it('ignores non-compound children (only known slots are rendered)', () => {
      const { getByText, queryByText } = render(
        <EtUserInfo data={defaultData}>
          <EtUserInfo.Avatar />
          <Text>Ignored</Text>
          <EtUserInfo.Title />
          <EtUserInfo.Subtitle />
        </EtUserInfo>,
      );

      expect(getByText('Emma Collins')).toBeTruthy();
      expect(getByText('@emmacollins')).toBeTruthy();
      expect(queryByText('Ignored')).toBeNull();
    });
  });
});
