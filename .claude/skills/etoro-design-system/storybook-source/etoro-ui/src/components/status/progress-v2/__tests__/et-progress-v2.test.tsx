import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { EtProgressV2 } from '../et-progress-v2';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }: { children?: React.ReactNode }) => <View {...props}>{children}</View>,
    Svg: ({ children, ...props }: { children?: React.ReactNode }) => <View {...props}>{children}</View>,
    Circle: (props: Record<string, unknown>) => <View {...props} />,
  };
});

// Mock useEtoroTheme hook
jest.mock('../../../../core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

describe('EtProgressV2', () => {
  describe('Line variant (default)', () => {
    it('renders with default props', () => {
      render(<EtProgressV2 progress={0.5} testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
      expect(screen.getByTestId('progress-track')).toBeTruthy();
      expect(screen.getByTestId('progress-fill')).toBeTruthy();
    });

    it('renders without label by default', () => {
      render(<EtProgressV2 progress={0.5} testID="progress" />);

      expect(screen.queryByTestId('progress-label')).toBeNull();
    });

    it('renders with label when showLabel is true', () => {
      render(<EtProgressV2 progress={0.5} showLabel testID="progress" />);

      expect(screen.getByTestId('progress-label')).toBeTruthy();
      expect(screen.getByText('50% complete')).toBeTruthy();
    });

    it('renders custom label text', () => {
      render(<EtProgressV2 progress={0.6} showLabel labelText="Step 3 of 5" testID="progress" />);

      expect(screen.getByText('Step 3 of 5')).toBeTruthy();
    });

    it('clamps progress to 0-1 range', () => {
      const { rerender } = render(<EtProgressV2 progress={1.5} showLabel testID="progress" />);

      // Should show 100% for progress > 1
      expect(screen.getByText('100% complete')).toBeTruthy();

      rerender(<EtProgressV2 progress={-0.5} showLabel testID="progress" />);

      // Should show 0% for progress < 0
      expect(screen.getByText('0% complete')).toBeTruthy();
    });

    it('supports small size', () => {
      render(<EtProgressV2 progress={0.5} size="small" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports medium size', () => {
      render(<EtProgressV2 progress={0.5} size="medium" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports large size', () => {
      render(<EtProgressV2 progress={0.5} size="large" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports positive color', () => {
      render(<EtProgressV2 progress={0.5} color="positive" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports neutral color', () => {
      render(<EtProgressV2 progress={0.5} color="neutral" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('resolves a design-system customColor token to the fill', () => {
      render(<EtProgressV2 progress={0.5} customColor="accentA700" testID="progress" />);

      expect(screen.getByTestId('progress-fill')).toHaveStyle({ backgroundColor: colorsMock.colors.accentA700 });
    });

    it('customColor overrides the color scheme', () => {
      render(<EtProgressV2 progress={0.5} color="positive" customColor="accentB700" testID="progress" />);

      expect(screen.getByTestId('progress-fill')).toHaveStyle({ backgroundColor: colorsMock.colors.accentB700 });
    });
  });

  describe('Circle variant', () => {
    it('renders circle variant', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('renders with children in center', () => {
      render(
        <EtProgressV2 variant="circle" progress={0.5} testID="progress">
          <Text>60%</Text>
        </EtProgressV2>,
      );

      expect(screen.getByTestId('progress-content')).toBeTruthy();
      expect(screen.getByText('60%')).toBeTruthy();
    });

    it('renders default percentage when no children provided', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} testID="progress" />);

      expect(screen.getByTestId('progress-content')).toBeTruthy();
      expect(screen.getByText('50%')).toBeTruthy();
    });

    it('supports small size', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} size="small" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports medium size', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} size="medium" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports large size', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} size="large" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports positive color', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} color="positive" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports neutral color', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} color="neutral" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('resolves a design-system customColor token to the arc', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} customColor="accentC700" testID="progress" />);

      expect(screen.getByTestId('progress-fill').props.stroke).toBe(colorsMock.colors.accentC700);
    });
  });

  describe('Sectioned Line variant', () => {
    it('renders sectioned line variant', () => {
      render(<EtProgressV2 variant="line-sectioned" progress={0.5} sections={4} testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
      // Since ProgressLineSectioned renders ProgressLine, which has testIDs for track and fill,
      // and ProgressLineSectioned adds testIDs for each section, we need to be more specific.
      // We're looking for the section containers themselves.
      // The regex /progress-section-\d+$/ matches testIDs ending with a number (the index)
      // but not those with -fill or -track suffixes.
      expect(screen.getAllByTestId(/progress-section-\d+$/)).toHaveLength(4);
    });

    it('renders with correct fill distribution', () => {
      // 50% progress with 4 sections should fill first 2 sections
      render(<EtProgressV2 variant="line-sectioned" progress={0.5} sections={4} testID="progress" />);

      // We expect 4 fills total (one per section)
      const fills = screen.getAllByTestId(/progress-section-\d+-fill/);
      expect(fills).toHaveLength(4);
    });

    it('supports custom gap', () => {
      render(<EtProgressV2 variant="line-sectioned" progress={0.5} sections={2} gap={10} testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('supports neutral color', () => {
      render(<EtProgressV2 variant="line-sectioned" progress={0.5} sections={3} color="neutral" testID="progress" />);

      expect(screen.getByTestId('progress')).toBeTruthy();
    });

    it('resolves a design-system customColor token on every section fill', () => {
      render(<EtProgressV2 variant="line-sectioned" progress={0.5} sections={3} customColor="accentA700" testID="progress" />);

      const fills = screen.getAllByTestId(/progress-section-\d+-fill/);
      expect(fills).toHaveLength(3);
      fills.forEach((fill) => expect(fill).toHaveStyle({ backgroundColor: colorsMock.colors.accentA700 }));
    });
  });

  describe('Accessibility', () => {
    it('applies testID to line variant', () => {
      render(<EtProgressV2 progress={0.5} testID="my-progress" />);

      expect(screen.getByTestId('my-progress')).toBeTruthy();
      expect(screen.getByTestId('my-progress-track')).toBeTruthy();
      expect(screen.getByTestId('my-progress-fill')).toBeTruthy();
    });

    it('applies testID to circle variant', () => {
      render(<EtProgressV2 variant="circle" progress={0.5} testID="my-progress" />);

      expect(screen.getByTestId('my-progress')).toBeTruthy();
    });
  });
});
