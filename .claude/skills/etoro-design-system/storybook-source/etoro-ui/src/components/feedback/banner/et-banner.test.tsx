import { fireEvent, render, screen } from '@testing-library/react-native';
import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { EtBanner } from './et-banner';

jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    dark: false,
    colors: {
      cardDefault: 'rgba(27,30,33,0.04)',
      textPrimaryNeutral: '#1b1e21',
      carbon300: '#e0e0e0',
      carbon400: '#b2b2b2',
    },
  }),
}));

jest.mock('../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => ({
    colors: {
      cardDefault: 'rgba(27,30,33,0.04)',
      textPrimaryNeutral: '#1b1e21',
      carbon300: '#e0e0e0',
      carbon400: '#b2b2b2',
    },
    dark: false,
  }),
}));

jest.mock('../../et-icon-v2', () => {
  const { Text: MockText } = require('react-native');
  return {
    EtIconV2: ({ name, testID }: { name: string; testID?: string }) => <MockText testID={testID ?? `icon-${name}`}>{name}</MockText>,
  };
});

jest.mock('../../../foundations/text/et-text', () => {
  const { Text: MockText } = require('react-native');
  return {
    EtText: ({ children, testID }: { children: ReactNode; testID?: string }) => <MockText testID={testID}>{children}</MockText>,
  };
});

describe('EtBanner', () => {
  it('renders title and description', () => {
    render(
      <EtBanner testID="banner">
        <EtBanner.Title>Title</EtBanner.Title>
        <EtBanner.Description>Body copy</EtBanner.Description>
      </EtBanner>,
    );

    expect(screen.getByTestId('banner')).toBeTruthy();
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body copy')).toBeTruthy();
  });

  it('renders close control when onClose is provided and calls it', () => {
    const onClose = jest.fn();
    render(
      <EtBanner testID="banner" onClose={onClose}>
        <EtBanner.Title>Title</EtBanner.Title>
        <EtBanner.Description>Body</EtBanner.Description>
      </EtBanner>,
    );

    fireEvent.press(screen.getByTestId('banner-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close when onClose is omitted', () => {
    render(
      <EtBanner testID="banner">
        <EtBanner.Title>Title</EtBanner.Title>
        <EtBanner.Description>Body</EtBanner.Description>
      </EtBanner>,
    );

    expect(screen.queryByTestId('banner-close')).toBeNull();
  });

  it('renders actions and illustration slots', () => {
    render(
      <EtBanner testID="banner" onClose={() => undefined}>
        <EtBanner.Title>Title</EtBanner.Title>
        <EtBanner.Description>Body</EtBanner.Description>
        <EtBanner.Actions testID="banner-actions">
          <Text>CTA</Text>
        </EtBanner.Actions>
        <EtBanner.Illustration testID="banner-illustration" size="large">
          <Text>Art</Text>
        </EtBanner.Illustration>
      </EtBanner>,
    );

    expect(screen.getByTestId('banner-actions')).toBeTruthy();
    expect(screen.getByText('CTA')).toBeTruthy();
    expect(screen.getByTestId('banner-illustration')).toBeTruthy();
    expect(screen.getByText('Art')).toBeTruthy();
  });

  it('does not render illustration chrome when children are omitted', () => {
    render(
      <EtBanner testID="banner">
        <EtBanner.Title>Title</EtBanner.Title>
        <EtBanner.Description>Body</EtBanner.Description>
        <EtBanner.Illustration testID="banner-illustration" size="medium" />
      </EtBanner>,
    );

    expect(screen.queryByTestId('banner-illustration')).toBeNull();
  });

  it('resolves slots by displayName regardless of JSX order', () => {
    render(
      <EtBanner testID="banner">
        <EtBanner.Illustration testID="banner-illustration">
          <View />
        </EtBanner.Illustration>
        <EtBanner.Actions testID="banner-actions">
          <Text>CTA</Text>
        </EtBanner.Actions>
        <EtBanner.Description>Body</EtBanner.Description>
        <EtBanner.Title>Title</EtBanner.Title>
      </EtBanner>,
    );

    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByTestId('banner-actions')).toBeTruthy();
    expect(screen.getByTestId('banner-illustration')).toBeTruthy();
  });
});
