import { afterEach, describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { useLayoutDirection } from './use-layout-direction.web';

// Jest runs in a node environment — stub the global document per test.
const globalWithDocument = globalThis as unknown as { document?: { documentElement?: { dir?: string } } };
const ORIGINAL_DOCUMENT = globalWithDocument.document;

function setDocumentDir(dir: string | undefined) {
  globalWithDocument.document = { documentElement: { dir } };
}

afterEach(() => {
  globalWithDocument.document = ORIGINAL_DOCUMENT;
});

describe('useLayoutDirection (web)', () => {
  it('GIVEN the document dir is "rtl", WHEN rendered, THEN returns "rtl"', () => {
    setDocumentDir('rtl');

    const { result } = renderHook(() => useLayoutDirection());

    expect(result.current).toBe('rtl');
  });

  it('GIVEN the document dir is "ltr", WHEN rendered, THEN returns "ltr"', () => {
    setDocumentDir('ltr');

    const { result } = renderHook(() => useLayoutDirection());

    expect(result.current).toBe('ltr');
  });

  it('GIVEN the document dir is unset, WHEN rendered, THEN defaults to "ltr"', () => {
    setDocumentDir(undefined);

    const { result } = renderHook(() => useLayoutDirection());

    expect(result.current).toBe('ltr');
  });

  it('GIVEN no document at all, WHEN rendered, THEN defaults to "ltr"', () => {
    globalWithDocument.document = undefined;

    const { result } = renderHook(() => useLayoutDirection());

    expect(result.current).toBe('ltr');
  });

  it('GIVEN a mounted hook, WHEN the dir attribute changes after mount, THEN the value stays as read at mount', () => {
    setDocumentDir('ltr');
    const { result, rerender } = renderHook(() => useLayoutDirection());

    setDocumentDir('rtl');
    rerender(undefined);

    expect(result.current).toBe('ltr');
  });
});
