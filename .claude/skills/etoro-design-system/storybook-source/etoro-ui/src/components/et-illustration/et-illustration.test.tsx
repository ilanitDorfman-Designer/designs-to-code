import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { EtIllustration } from './et-illustration';
import { ILLUSTRATION_META, ILLUSTRATION_SIZE_PX, resolveIllustrationSize } from './illustration-gallery';
import { getIllustrationFileName, getIllustrationUrl, ILLUSTRATIONS_CDN_BASE_URL } from './utils/get-illustration-url';

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: (props: Record<string, unknown>) => <View testID="mock-illustration-image" {...props} />,
  };
});

jest.mock('../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: jest.fn(() => ({ dark: false, colors: {} })),
}));

const { useEtoroTheme } = jest.requireMock('../../core/hooks/use-etoro-theme') as {
  useEtoroTheme: jest.Mock;
};

describe('EtIllustration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useEtoroTheme.mockReturnValue({ dark: false, colors: {} });
  });

  it('resolves the light CDN URL by name/theme, using the Figma default size', () => {
    // `error` has no explicit size → resolves to its Figma default ("m").
    const { getByLabelText, getByTestId } = render(<EtIllustration name="error" testID="illust" />);
    expect(getByLabelText('error')).toBeTruthy();
    expect(getByLabelText('error').props.accessibilityRole).toBe('image');
    expect(getByTestId('illust')).toBeTruthy();
    const uri = `${ILLUSTRATIONS_CDN_BASE_URL}/error_m_light.png`;
    expect(getByTestId('mock-illustration-image').props.source.uri).toBe(uri);
    expect(getByTestId('mock-illustration-image').props.recyclingKey).toBe(uri);
  });

  it('uses the dark asset when app theme is dark', () => {
    useEtoroTheme.mockReturnValue({ dark: true, colors: {} });
    const { getByTestId } = render(<EtIllustration name="success" size="m" />);
    expect(getByTestId('mock-illustration-image').props.source.uri).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/success_m_dark.png`);
  });

  it('respects an explicit theme override (and mixed per-theme formats)', () => {
    // paper_plane ships light as SVG, dark as PNG.
    const { getByTestId, rerender } = render(<EtIllustration name="paper_plane" size="xxl" theme="light" />);
    expect(getByTestId('mock-illustration-image').props.source.uri).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/paper_plane_xxl_light.svg`);
    rerender(<EtIllustration name="paper_plane" size="xxl" theme="dark" />);
    expect(getByTestId('mock-illustration-image').props.source.uri).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/paper_plane_xxl_dark.png`);
  });

  it('requests the size-specific variant URL when size="xl" is passed', () => {
    const { getByTestId } = render(<EtIllustration name="error" size="xl" theme="dark" />);
    expect(getByTestId('mock-illustration-image').props.source.uri).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/error_xl_dark.png`);
  });

  it('renders a size-specific variant at its own intrinsic dimensions', () => {
    // A dedicated variant is drawn for that size in Figma, so it renders natively
    // (not re-fit into the token box). `error` ships a wide XL banner variant.
    const variant = ILLUSTRATION_META.error.variants?.xl;
    expect(variant).toBeDefined();
    const { getByTestId } = render(<EtIllustration name="error" size="xl" />);
    const image = getByTestId('mock-illustration-image');
    expect(image.props.style.width).toBe(variant?.width);
    expect(image.props.style.height).toBe(variant?.height);
  });

  it('scales a square illustration to fit a non-square size token box (keeps aspect)', () => {
    // magnifying_glass is intrinsically 152×152. At xxl (375×230) it must FIT the box: scale to
    // the limiting (height) side → 230×230 — NOT stretched to 375 wide. No xxl variant exists, so
    // the URL falls back to the base (default-size m) asset.
    const { getByTestId } = render(<EtIllustration name="magnifying_glass" size="xxl" />);
    const image = getByTestId('mock-illustration-image');
    expect(image.props.style.height).toBe(ILLUSTRATION_SIZE_PX.xxl.height); // 230 — limiting dimension
    expect(image.props.style.width).toBe(image.props.style.height); // square aspect preserved
    expect(image.props.style.width).toBeLessThan(ILLUSTRATION_SIZE_PX.xxl.width); // not stretched to 375
    expect(image.props.source.uri).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/magnifying_glass_m_light.png`);
  });

  it('preserves aspect ratio for a width-only override (FR-008)', () => {
    // warning base is 183×160; width=366 → height scales to 366 * 160 / 183 = 320.
    const { getByTestId } = render(<EtIllustration name="warning" width={366} />);
    const image = getByTestId('mock-illustration-image');
    expect(image.props.style.width).toBe(366);
    expect(image.props.style.height).toBe(320);
  });

  it('preserves aspect ratio for a height-only override (FR-008)', () => {
    // warning base is 183×160; height=320 → width scales to 320 * 183 / 160 = 366.
    const { getByTestId } = render(<EtIllustration name="warning" height={320} />);
    const image = getByTestId('mock-illustration-image');
    expect(image.props.style.height).toBe(320);
    expect(image.props.style.width).toBe(366);
  });

  it('resolveIllustrationSize returns the requested size or the Figma default', () => {
    expect(resolveIllustrationSize('error', 'xxl')).toBe('xxl');
    expect(resolveIllustrationSize('error')).toBe('m');
    expect(resolveIllustrationSize('coupon')).toBe('s');
    expect(resolveIllustrationSize('assets')).toBe('xxl');
  });

  it('getIllustrationUrl builds flat name_size_theme paths and resolves format per asset', () => {
    // coupon defaults to size `s` (PNG both themes)
    expect(getIllustrationUrl('coupon', 'light')).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/coupon_s_light.png`);
    // dedicated xl variant
    expect(getIllustrationUrl('error', 'dark', 'xl')).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/error_xl_dark.png`);
    // no xxl variant for card → falls back to the base (default m) asset (SVG)
    expect(getIllustrationUrl('card', 'light', 'xxl')).toBe(`${ILLUSTRATIONS_CDN_BASE_URL}/card_m_light.svg`);
    expect(getIllustrationFileName('calendar', 'light', 'xxl')).toBe('calendar_xxl_light.svg');
    expect(getIllustrationFileName('calendar', 'dark', 'xxl')).toBe('calendar_xxl_dark.png');
  });
});
