import { render } from '@testing-library/react-native';
import React from 'react';

import { EtMediaCard } from '../et-media-card';

const mockAvatarProps: Array<{ variant?: string; imageBackgroundColor?: string }> = [];
const mockAvatarImageProps: Array<{ src?: string; source?: unknown }> = [];

jest.mock('../../social/avatar', () => {
  const { View, Text } = require('react-native');
  const Image = (props: { src?: string; source?: unknown }) => {
    mockAvatarImageProps.push({ src: props.src, source: props.source });
    return <View testID="avatar-image" />;
  };
  const Fallback = ({ children }: { children?: React.ReactNode }) => <Text testID="avatar-fallback">{children}</Text>;
  const Root = (props: { children?: React.ReactNode; variant?: string; imageBackgroundColor?: string }) => {
    mockAvatarProps.push({ variant: props.variant, imageBackgroundColor: props.imageBackgroundColor });
    return <View testID="avatar-root">{props.children}</View>;
  };
  return { EtAvatar: Object.assign(Root, { Image, Fallback }) };
});

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      carbonStatic050: '#FFFFFF',
      carbonStatic900: '#1B1E21',
      bgNeutralSecondary: '#F2F3F7',
      bgDarkSurface: '#333333',
      dividerQuinary: '#E5E5E5',
      bgTransparentPrimaryBright: '#FFFFFF25',
      bgGreyTransparentSecondary: '#CCCCCC30',
    },
    isDarkMode: false,
  }),
}));

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return { Image: (props: object) => <View testID="expo-image" {...props} /> };
});

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: (props: object) => <View testID="BlurView" {...props} /> };
});

describe('EtMediaCard.Logo', () => {
  beforeEach(() => {
    mockAvatarProps.length = 0;
    mockAvatarImageProps.length = 0;
  });

  it('renders the boxed instrument avatar (brand fill) by default', () => {
    render(
      <EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914">
        <EtMediaCard.Logo source={{ uri: 'https://example.com/logo.svg' }} placement="background" backgroundColor="#CC2914" fallback="TS" />
      </EtMediaCard>,
    );

    const last = mockAvatarProps.at(-1);
    expect(last).toEqual({ variant: 'instrument', imageBackgroundColor: '#CC2914' });
  });

  it('renders just the logo mark with no background box when boxed={false}', () => {
    render(
      <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
        <EtMediaCard.Logo source={{ uri: 'https://example.com/logo.svg' }} boxed={false} backgroundColor="#CC2914" fallback="TS" />
      </EtMediaCard>,
    );

    const last = mockAvatarProps.at(-1);
    expect(last).toEqual({ variant: 'default', imageBackgroundColor: undefined });
  });

  it('GIVEN a remote URI WHEN rendering THEN passes src to EtAvatar.Image', () => {
    render(
      <EtMediaCard size="medium">
        <EtMediaCard.Logo source={{ uri: 'https://example.com/logo.svg' }} fallback="TS" />
      </EtMediaCard>,
    );

    expect(mockAvatarImageProps.at(-1)).toEqual({ src: 'https://example.com/logo.svg', source: undefined });
  });

  it('GIVEN a bundled require() asset id WHEN rendering THEN passes it as Image source', () => {
    const bundledAssetId = 42;
    render(
      <EtMediaCard size="medium">
        <EtMediaCard.Logo source={bundledAssetId} fallback="TS" />
      </EtMediaCard>,
    );

    expect(mockAvatarImageProps.at(-1)).toEqual({ src: undefined, source: bundledAssetId });
  });
});
