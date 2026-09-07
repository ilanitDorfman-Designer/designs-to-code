import { render } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Text } from 'react-native';

import { colorsMock } from '../../hooks/__mocks__/colors-mock';
import { eToroDarkColors, eToroLightColors } from '../colors';
import { resolveSurface } from './resolve-surface';
import { SurfaceRoleProvider, useSurfaceColor, useSurfaceRole } from './surface-role.context';

jest.mock('../../hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../hooks/__mocks__/colors-mock');
  return { useEtoroTheme: () => mockColors };
});

function Probe({ role }: { role?: 'base' | 'elevated' } = {}) {
  return <Text testID="probe">{`${useSurfaceRole()}|${useSurfaceColor(role)}`}</Text>;
}

function readProbe(ui: React.ReactElement): { role: string; color: string } {
  const [role, color] = render(ui).getByTestId('probe').props.children.split('|');
  return { role, color };
}

describe('resolveSurface', () => {
  it('GIVEN each role WHEN resolved THEN returns that role’s surface token', () => {
    const { colors } = eToroDarkColors;
    expect(resolveSurface('base', colors)).toBe(colors.backgroundBase);
    expect(resolveSurface('elevated', colors)).toBe(colors.backgroundElevated);
  });

  // Asserted here as the contract, and nowhere restated as a literal.
  it('GIVEN the light theme WHEN the elevated role is resolved THEN it paints the light background', () => {
    expect(resolveSurface('elevated', eToroLightColors.colors)).toBe(resolveSurface('base', eToroLightColors.colors));
  });

  it('GIVEN the dark theme WHEN the elevated role is resolved THEN it is a distinct, raised plane', () => {
    expect(resolveSurface('elevated', eToroDarkColors.colors)).not.toBe(resolveSurface('base', eToroDarkColors.colors));
  });
});

describe('useSurfaceColor', () => {
  // The native default-equivalence guarantee: with no provider anywhere — every native render —
  // the hook returns exactly the literal the painters used before the role layer existed.
  it('GIVEN no provider WHEN read THEN the role is base and the colour is backgroundBase', () => {
    expect(readProbe(<Probe />)).toEqual({ role: 'base', color: colorsMock.colors.backgroundBase });
  });

  it('GIVEN an elevated region WHEN read THEN the colour follows the region', () => {
    expect(
      readProbe(
        <SurfaceRoleProvider role="elevated">
          <Probe />
        </SurfaceRoleProvider>,
      ),
    ).toEqual({ role: 'elevated', color: colorsMock.colors.backgroundElevated });
  });

  it('GIVEN an explicit role WHEN read inside another region THEN the explicit role wins', () => {
    expect(
      readProbe(
        <SurfaceRoleProvider role="elevated">
          <Probe role="base" />
        </SurfaceRoleProvider>,
      ),
    ).toEqual({ role: 'elevated', color: colorsMock.colors.backgroundBase });
  });

  /*
   * The property the app frame depends on: it must always render the provider and toggle the ROLE,
   * never mount and unmount the provider. A conditional wrapper changes the element type at that
   * position, so React tears down everything below it — which under the frame is the whole protected
   * navigator, its DI scopes and every bootstrap effect.
   */
  it('GIVEN the role changes WHEN re-rendered THEN the subtree below is NOT rebuilt', () => {
    let mounts = 0;
    function CountsMounts() {
      useEffect(() => {
        mounts += 1;
      }, []);
      return null;
    }

    const { rerender } = render(
      <SurfaceRoleProvider role="base">
        <CountsMounts />
      </SurfaceRoleProvider>,
    );
    rerender(
      <SurfaceRoleProvider role="elevated">
        <CountsMounts />
      </SurfaceRoleProvider>,
    );
    rerender(
      <SurfaceRoleProvider role="base">
        <CountsMounts />
      </SurfaceRoleProvider>,
    );

    expect(mounts).toBe(1);
  });

  it('GIVEN nested regions WHEN read THEN the innermost region wins', () => {
    expect(
      readProbe(
        <SurfaceRoleProvider role="elevated">
          <SurfaceRoleProvider role="base">
            <Probe />
          </SurfaceRoleProvider>
        </SurfaceRoleProvider>,
      ),
    ).toEqual({ role: 'base', color: colorsMock.colors.backgroundBase });
  });
});
