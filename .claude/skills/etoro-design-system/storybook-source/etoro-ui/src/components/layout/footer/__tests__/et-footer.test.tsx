import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { EtFooter } from '../et-footer';
import { FooterLink, FooterScrollable, FooterSection } from '../subcomponents';

// Mock useEtoroTheme hook
jest.mock('etoro-ui/core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

describe('EtFooter', () => {
  describe('Compound Components', () => {
    it('should have Section compound component', () => {
      expect(EtFooter.Section).toBeDefined();
      expect(EtFooter.Section).toBe(FooterSection);
    });

    it('should have Scrollable compound component', () => {
      expect(EtFooter.Scrollable).toBeDefined();
      expect(EtFooter.Scrollable).toBe(FooterScrollable);
    });

    it('should have Link compound component', () => {
      expect(EtFooter.Link).toBeDefined();
      expect(EtFooter.Link).toBe(FooterLink);
    });
  });

  describe('Component Structure', () => {
    it('should be a valid memoized React component', () => {
      expect(EtFooter).toBeDefined();
      expect(EtFooter.$$typeof).toBeDefined();
    });

    it('should have all compound components attached', () => {
      expect(EtFooter.Section).toBeDefined();
      expect(EtFooter.Scrollable).toBeDefined();
      expect(EtFooter.Link).toBeDefined();
    });
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      expect(() =>
        render(
          <EtFooter>
            <Text>Content</Text>
          </EtFooter>,
        ),
      ).not.toThrow();
    });

    it('should render with testID', () => {
      const { getByTestId } = render(
        <EtFooter testID="test-footer">
          <Text>Content</Text>
        </EtFooter>,
      );
      expect(getByTestId('test-footer')).toBeTruthy();
    });

    it('should render with Scrollable subcomponent', () => {
      expect(() =>
        render(
          <EtFooter>
            <EtFooter.Scrollable>
              <Text>Scrollable Content</Text>
            </EtFooter.Scrollable>
          </EtFooter>,
        ),
      ).not.toThrow();
    });

    it('should render children', () => {
      const { getByText } = render(
        <EtFooter>
          <Text>Test Content</Text>
        </EtFooter>,
      );
      expect(getByText('Test Content')).toBeTruthy();
    });
  });
});

describe('FooterSection', () => {
  it('should render without crashing', () => {
    expect(() =>
      render(
        <FooterSection>
          <Text>Content</Text>
        </FooterSection>,
      ),
    ).not.toThrow();
  });

  it('should render children', () => {
    const { getByText } = render(
      <FooterSection>
        <Text>Test Content</Text>
      </FooterSection>,
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = render(
      <FooterSection testID="footer-section">
        <Text>Content</Text>
      </FooterSection>,
    );
    expect(getByTestId('footer-section')).toBeTruthy();
  });

  it('should have correct displayName', () => {
    expect(FooterSection.displayName).toBe('EtFooter.Section');
  });
});

describe('FooterScrollable', () => {
  describe('Vertical mode (default)', () => {
    it('should render without crashing', () => {
      expect(() =>
        render(
          <FooterScrollable>
            <Text>Content</Text>
          </FooterScrollable>,
        ),
      ).not.toThrow();
    });

    it('should render children', () => {
      const { getByText } = render(
        <FooterScrollable>
          <Text>Scrollable Content</Text>
        </FooterScrollable>,
      );
      expect(getByText('Scrollable Content')).toBeTruthy();
    });

    it('should accept testID prop', () => {
      const { getByTestId } = render(
        <FooterScrollable testID="footer-scrollable">
          <Text>Content</Text>
        </FooterScrollable>,
      );
      expect(getByTestId('footer-scrollable')).toBeTruthy();
    });

    it('should have correct displayName', () => {
      expect(FooterScrollable.displayName).toBe('EtFooter.Scrollable');
    });

    it('should render with explicit vertical direction', () => {
      expect(() =>
        render(
          <FooterScrollable direction="vertical">
            <Text>Content</Text>
          </FooterScrollable>,
        ),
      ).not.toThrow();
    });
  });

  describe('Horizontal mode', () => {
    it('should render without crashing', () => {
      expect(() =>
        render(
          <FooterScrollable direction="horizontal">
            <FooterSection>
              <Text>Page 1</Text>
            </FooterSection>
          </FooterScrollable>,
        ),
      ).not.toThrow();
    });

    it('should accept testID prop', () => {
      const { getByTestId } = render(
        <FooterScrollable direction="horizontal" testID="footer-horizontal">
          <FooterSection>
            <Text>Content</Text>
          </FooterSection>
        </FooterScrollable>,
      );
      expect(getByTestId('footer-horizontal')).toBeTruthy();
    });

    it('should render multiple children for pagination', () => {
      // Horizontal mode requires layout measurement before rendering content
      // It returns empty View initially, so we just verify it renders without error
      expect(() =>
        render(
          <FooterScrollable direction="horizontal">
            <FooterSection>
              <Text>Page 1</Text>
            </FooterSection>
            <FooterSection>
              <Text>Page 2</Text>
            </FooterSection>
          </FooterScrollable>,
        ),
      ).not.toThrow();
    });
  });
});

describe('FooterLink', () => {
  it('should render without crashing', () => {
    expect(() => render(<FooterLink>Terms</FooterLink>)).not.toThrow();
  });

  it('should render children text', () => {
    const { getByText } = render(<FooterLink>Terms</FooterLink>);
    expect(getByText('Terms')).toBeTruthy();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = render(<FooterLink testID="footer-link">Terms</FooterLink>);
    expect(getByTestId('footer-link')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<FooterLink onPress={onPressMock}>Terms</FooterLink>);
    fireEvent.press(getByText('Terms'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should have correct displayName', () => {
    expect(FooterLink.displayName).toBe('EtFooter.Link');
  });

  it('should handle empty string as children', () => {
    expect(() => render(<FooterLink>{''}</FooterLink>)).not.toThrow();
  });
});

describe('Integration', () => {
  const linksRowStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    gap: 8,
  };

  it('should render complete footer with all subcomponents', () => {
    const { getByText, getByTestId } = render(
      <EtFooter testID="full-footer">
        <EtFooter.Section>
          <Text>Disclaimer text</Text>
        </EtFooter.Section>
        <EtFooter.Section>
          <Text>Button placeholder</Text>
        </EtFooter.Section>
        <EtFooter.Section style={linksRowStyle}>
          <EtFooter.Link>Terms</EtFooter.Link>
          <EtFooter.Link>Privacy</EtFooter.Link>
        </EtFooter.Section>
      </EtFooter>,
    );

    expect(getByTestId('full-footer')).toBeTruthy();
    expect(getByText('Disclaimer text')).toBeTruthy();
    expect(getByText('Terms')).toBeTruthy();
    expect(getByText('Privacy')).toBeTruthy();
  });

  it('should render footer with horizontal scrollable content', () => {
    expect(() =>
      render(
        <EtFooter>
          <EtFooter.Scrollable direction="horizontal">
            <EtFooter.Section>
              <Text>Page 1</Text>
            </EtFooter.Section>
            <EtFooter.Section>
              <Text>Page 2</Text>
            </EtFooter.Section>
          </EtFooter.Scrollable>
        </EtFooter>,
      ),
    ).not.toThrow();
  });

  it('should render footer with vertical scrollable content', () => {
    expect(() =>
      render(
        <EtFooter>
          <EtFooter.Scrollable>
            <EtFooter.Section>
              <Text>Long content...</Text>
            </EtFooter.Section>
          </EtFooter.Scrollable>
        </EtFooter>,
      ),
    ).not.toThrow();
  });

  it('should handle link press in full footer', () => {
    const onTermsPress = jest.fn();
    const onPrivacyPress = jest.fn();

    const { getByText } = render(
      <EtFooter>
        <EtFooter.Section style={linksRowStyle}>
          <EtFooter.Link onPress={onTermsPress}>Terms</EtFooter.Link>
          <EtFooter.Link onPress={onPrivacyPress}>Privacy</EtFooter.Link>
        </EtFooter.Section>
      </EtFooter>,
    );

    fireEvent.press(getByText('Terms'));
    fireEvent.press(getByText('Privacy'));

    expect(onTermsPress).toHaveBeenCalledTimes(1);
    expect(onPrivacyPress).toHaveBeenCalledTimes(1);
  });
});
