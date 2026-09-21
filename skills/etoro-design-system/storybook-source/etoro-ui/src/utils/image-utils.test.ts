import { extractImageBackgroundColor, extractImageEncodedColors, getPreferredLogoUri, InstrumentImages } from './image-utils';

describe('extractImageEncodedColors', () => {
  it('GIVEN an svg with background and foreground hexes WHEN extracting THEN returns both colors', () => {
    expect(extractImageEncodedColors('https://cdn.example/1001_0A2240_FFFFFF.svg')).toEqual({
      background: '#0A2240',
      foreground: '#FFFFFF',
    });
  });

  it('GIVEN a filename whose only hex is followed by an extension WHEN extracting THEN still returns the background', () => {
    expect(extractImageBackgroundColor('https://cdn.example/1001_0A2240.svg')).toBe('#0A2240');
  });

  it('GIVEN a url with no encoded hex WHEN extracting THEN returns an empty object', () => {
    expect(extractImageEncodedColors('https://cdn.example/1001.svg')).toEqual({});
  });
});

describe('getPreferredLogoUri', () => {
  describe('Priority order', () => {
    it('should prefer SVG over raster images', () => {
      const images = {
        svg: { uri: 'https://example.com/logo.svg' },
        '150x150': { uri: 'https://example.com/logo-150.png' },
        '50x50': { uri: 'https://example.com/logo-50.png' },
        '35x35': { uri: 'https://example.com/logo-35.png' },
      };

      expect(getPreferredLogoUri(images)).toBe('https://example.com/logo.svg');
    });

    it('should fallback to 150x150 when SVG is not available', () => {
      const images = {
        '150x150': { uri: 'https://example.com/logo-150.png' },
        '50x50': { uri: 'https://example.com/logo-50.png' },
        '35x35': { uri: 'https://example.com/logo-35.png' },
      };

      expect(getPreferredLogoUri(images)).toBe('https://example.com/logo-150.png');
    });

    it('should fallback to 50x50 when SVG and 150x150 are not available', () => {
      const images = {
        '50x50': { uri: 'https://example.com/logo-50.png' },
        '35x35': { uri: 'https://example.com/logo-35.png' },
      };

      expect(getPreferredLogoUri(images)).toBe('https://example.com/logo-50.png');
    });

    it('should use 35x35 as last resort', () => {
      const images = {
        '35x35': { uri: 'https://example.com/logo-35.png' },
      };

      expect(getPreferredLogoUri(images)).toBe('https://example.com/logo-35.png');
    });
  });

  describe('Edge cases', () => {
    it('should return undefined when images object is not provided', () => {
      expect(getPreferredLogoUri(undefined)).toBeUndefined();
    });

    it('should return undefined when images object is empty', () => {
      expect(getPreferredLogoUri({})).toBeUndefined();
    });

    it('should return undefined when no valid image URIs exist', () => {
      const images = {
        svg: { backgroundColor: '#fff' } as any,
        '150x150': { width: 150, height: 150 } as any,
      };

      expect(getPreferredLogoUri(images)).toBeUndefined();
    });

    it('should handle images with missing uri property', () => {
      const images = {
        svg: {},
        '150x150': {},
      } as InstrumentImages;

      expect(getPreferredLogoUri(images)).toBeUndefined();
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical API response with all image sizes', () => {
      const images = {
        '35x35': {
          width: 35,
          height: 35,
          uri: 'https://etoro-cdn.etorostatic.com/market-avatars/1/35x35.png',
        },
        '50x50': {
          width: 50,
          height: 50,
          uri: 'https://etoro-cdn.etorostatic.com/market-avatars/1/50x50.png',
        },
        '150x150': {
          width: 150,
          height: 150,
          uri: 'https://etoro-cdn.etorostatic.com/market-avatars/1/150x150.png',
        },
        svg: {
          uri: 'https://etoro-cdn.etorostatic.com/market-avatars/1/logo.svg',
          backgroundColor: '#1652F0',
          textColor: '#FFFFFF',
        },
      };

      expect(getPreferredLogoUri(images)).toBe('https://etoro-cdn.etorostatic.com/market-avatars/1/logo.svg');
    });

    it('should handle API response with only raster images', () => {
      const images = {
        '35x35': {
          uri: 'https://example.com/35.png',
        },
        '50x50': {
          uri: 'https://example.com/50.png',
        },
        '150x150': {
          uri: 'https://example.com/150.png',
        },
      };

      expect(getPreferredLogoUri(images)).toBe('https://example.com/150.png');
    });

    it('should handle partial image data from degraded API response', () => {
      const images = {
        '35x35': {
          uri: 'https://example.com/35.png',
        },
      };

      expect(getPreferredLogoUri(images)).toBe('https://example.com/35.png');
    });
  });
});
