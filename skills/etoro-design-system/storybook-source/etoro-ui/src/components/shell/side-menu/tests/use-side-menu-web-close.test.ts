import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import type { RefObject } from 'react';
import type { View } from 'react-native';

import type { SideMenuFocusHandle } from '../api/types';
import { useSideMenuWebClose } from '../hooks/use-side-menu-web-close.web';

// Jest runs in a node environment — stub the global document per test
// (use-dismissable precedent).
const globalWithDocument = globalThis as unknown as { document?: unknown };
const ORIGINAL_DOCUMENT = globalWithDocument.document;

beforeEach(() => {
  globalWithDocument.document = { activeElement: null, body: {} };
});

afterEach(() => {
  globalWithDocument.document = ORIGINAL_DOCUMENT;
});

const makeSurface = () => ({
  focus: jest.fn(),
  contains: jest.fn(() => true),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

const asSurfaceRef = (surface: ReturnType<typeof makeSurface>) => ({ current: surface }) as unknown as RefObject<View | null>;

describe('useSideMenuWebClose — initial focus on open', () => {
  it('focuses the registered initial target (the Header toggle), not the surface', () => {
    const surface = makeSurface();
    const toggle = { focus: jest.fn() };

    renderHook(() =>
      useSideMenuWebClose({
        expanded: true,
        surfaceRef: asSurfaceRef(surface),
        requestClose: jest.fn(),
        initialFocusRef: { current: toggle as SideMenuFocusHandle },
      }),
    );

    expect(toggle.focus).toHaveBeenCalledTimes(1);
    expect(surface.focus).not.toHaveBeenCalled();
  });

  // A menu composed WITHOUT a Header registers no initial focus target —
  // focus must still enter the panel (the focusout close only works from
  // inside), so the hook falls back to the surface (tabIndex -1).
  it('header-less: falls back to focusing the surface itself', () => {
    const surface = makeSurface();

    renderHook(() =>
      useSideMenuWebClose({
        expanded: true,
        surfaceRef: asSurfaceRef(surface),
        requestClose: jest.fn(),
        initialFocusRef: { current: null },
      }),
    );

    expect(surface.focus).toHaveBeenCalledTimes(1);
  });

  it('moves no focus while collapsed', () => {
    const surface = makeSurface();

    renderHook(() =>
      useSideMenuWebClose({
        expanded: false,
        surfaceRef: asSurfaceRef(surface),
        requestClose: jest.fn(),
        initialFocusRef: { current: null },
      }),
    );

    expect(surface.focus).not.toHaveBeenCalled();
  });
});
