import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { useWizardContext } from './context';
import { EtWizard } from './et-wizard';

jest.mock('../../../core/hooks/use-etoro-theme');

jest.mock('react-native-reanimated', () => {
  const { View, Animated: RNAnimated } = require('react-native');
  return {
    __esModule: true,
    default: {
      ...RNAnimated,
      View,
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: jest.fn((initial: any) => {
      const sv = { value: initial };
      return {
        get value() {
          return sv.value;
        },
        set value(v: any) {
          sv.value = v;
        },
        get: () => sv.value,
        set: (v: any) => {
          sv.value = typeof v === 'function' ? v(sv.value) : v;
        },
      };
    }),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((toValue: any, _config: any, callback: any) => {
      if (callback) callback(true);
      return toValue;
    }),
    cancelAnimation: jest.fn(),
    Easing: {
      linear: undefined,
    },
    createAnimatedComponent: (Component: any) => Component,
  };
});

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: jest.fn((fn: any) => fn()),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('expo-linear-gradient', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    LinearGradient: (props: React.PropsWithChildren<{ testID?: string }>) => React.createElement(View, { testID: 'linear-gradient', ...props }),
  };
});

jest.mock('expo-video', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    useVideoPlayer: () => ({ pause: jest.fn(), play: jest.fn() }),
    VideoView: (props: Record<string, unknown>) => React.createElement(View, { testID: 'video-view', ...props }),
  };
});

function ContextReader({ onRead }: { onRead: (ctx: ReturnType<typeof useWizardContext>) => void }) {
  const ctx = useWizardContext();
  onRead(ctx);
  return null;
}

function NextButton({ testID = 'next-btn' }: { testID?: string }) {
  const { goToNext } = useWizardContext();
  return (
    <View testID={testID} onTouchEnd={goToNext}>
      <Text>Next</Text>
    </View>
  );
}

function PrevButton({ testID = 'prev-btn' }: { testID?: string }) {
  const { goToPrevious } = useWizardContext();
  return (
    <View testID={testID} onTouchEnd={goToPrevious}>
      <Text>Back</Text>
    </View>
  );
}

describe('EtWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders the first step by default', () => {
      const { getByText, queryByText } = render(
        <EtWizard testID="wizard">
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Step 1')).toBeTruthy();
      expect(queryByText('Step 2')).toBeNull();
    });

    it('accepts testID on root container', () => {
      const { getByTestId } = render(
        <EtWizard testID="wizard">
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByTestId('wizard')).toBeTruthy();
    });

    it('renders footer when provided inside step', () => {
      const { getByText } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <Text>Footer Content</Text>
            </EtWizard.Footer>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Footer Content')).toBeTruthy();
    });

    it('renders without footer', () => {
      const { getByText, queryByText } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Step 1')).toBeTruthy();
      expect(queryByText('Footer Content')).toBeNull();
    });
  });

  describe('Compound subcomponents', () => {
    it('has all compound subcomponents as static properties', () => {
      expect(EtWizard.Step).toBeDefined();
      expect(EtWizard.Footer).toBeDefined();
      expect(EtWizard.Button).toBeDefined();
      expect(EtWizard.Title).toBeDefined();
      expect(EtWizard.Subtitle).toBeDefined();
      expect(EtWizard.Icon).toBeDefined();
      expect(EtWizard.TopbarStart).toBeDefined();
      expect(EtWizard.TopbarMiddle).toBeDefined();
      expect(EtWizard.TopbarEnd).toBeDefined();
    });

    it('has displayName set', () => {
      expect(EtWizard.displayName).toBe('EtWizard');
    });

    it('Step has correct displayName', () => {
      expect(EtWizard.Step.displayName).toBe('EtWizard.Step');
    });

    it('Footer has correct displayName', () => {
      expect(EtWizard.Footer.displayName).toBe('EtWizard.Footer');
    });

    it('TopbarStart has correct displayName', () => {
      expect(EtWizard.TopbarStart.displayName).toBe('EtWizard.TopbarStart');
    });

    it('TopbarMiddle has correct displayName', () => {
      expect(EtWizard.TopbarMiddle.displayName).toBe('EtWizard.TopbarMiddle');
    });

    it('TopbarEnd has correct displayName', () => {
      expect(EtWizard.TopbarEnd.displayName).toBe('EtWizard.TopbarEnd');
    });

    it('Button has correct displayName', () => {
      expect(EtWizard.Button.displayName).toBe('EtWizard.Button');
    });

    it('Title has correct displayName', () => {
      expect(EtWizard.Title.displayName).toBe('EtWizard.Title');
    });

    it('Subtitle has correct displayName', () => {
      expect(EtWizard.Subtitle.displayName).toBe('EtWizard.Subtitle');
    });

    it('Icon has correct displayName', () => {
      expect(EtWizard.Icon.displayName).toBe('EtWizard.Icon');
    });

    it('ignores non-compound children', () => {
      const { queryByText, getByText } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
          <Text>Ignored</Text>
        </EtWizard>,
      );

      expect(getByText('Step 1')).toBeTruthy();
      expect(queryByText('Ignored')).toBeNull();
    });
  });

  describe('Step navigation', () => {
    it('starts at initialStep', () => {
      const { getByText, queryByText } = render(
        <EtWizard initialStep={1}>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 3</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(queryByText('Step 1')).toBeNull();
      expect(getByText('Step 2')).toBeTruthy();
      expect(queryByText('Step 3')).toBeNull();
    });

    it('advances to the next step via goToNext', () => {
      const { getByText, queryByText, getByTestId } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <NextButton />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Step 1')).toBeTruthy();

      fireEvent(getByTestId('next-btn'), 'touchEnd');

      expect(queryByText('Step 1')).toBeNull();
      expect(getByText('Step 2')).toBeTruthy();
    });

    it('goes to previous step via goToPrevious', () => {
      const { getByText, queryByText, getByTestId } = render(
        <EtWizard initialStep={1}>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <PrevButton />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
            <EtWizard.Footer>
              <PrevButton />
            </EtWizard.Footer>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Step 2')).toBeTruthy();

      fireEvent(getByTestId('prev-btn'), 'touchEnd');

      expect(queryByText('Step 2')).toBeNull();
      expect(getByText('Step 1')).toBeTruthy();
    });

    it('does not go below step 0', () => {
      const { getByText, getByTestId } = render(
        <EtWizard initialStep={0}>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <PrevButton />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      fireEvent(getByTestId('prev-btn'), 'touchEnd');

      expect(getByText('Step 1')).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('calls onStepChange when step changes', () => {
      const onStepChange = jest.fn();

      const { getByTestId } = render(
        <EtWizard onStepChange={onStepChange}>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <NextButton />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      fireEvent(getByTestId('next-btn'), 'touchEnd');

      expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it('calls onComplete when advancing past last step', () => {
      const onComplete = jest.fn();

      const { getByTestId } = render(
        <EtWizard onComplete={onComplete}>
          <EtWizard.Step>
            <Text>Only Step</Text>
            <EtWizard.Footer>
              <NextButton />
            </EtWizard.Footer>
          </EtWizard.Step>
        </EtWizard>,
      );

      fireEvent(getByTestId('next-btn'), 'touchEnd');

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('does not call onComplete when not on the last step', () => {
      const onComplete = jest.fn();

      const { getByTestId } = render(
        <EtWizard onComplete={onComplete}>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <NextButton />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      fireEvent(getByTestId('next-btn'), 'touchEnd');

      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Context', () => {
    it('provides currentStep and totalSteps through context', () => {
      let captured: ReturnType<typeof useWizardContext> | null = null;

      render(
        <EtWizard>
          <EtWizard.Step>
            <ContextReader
              onRead={(ctx) => {
                captured = ctx;
              }}
            />
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(captured).not.toBeNull();
      expect(captured!.currentStep).toBe(0);
      expect(captured!.totalSteps).toBe(2);
      expect(typeof captured!.goToNext).toBe('function');
      expect(typeof captured!.goToPrevious).toBe('function');
    });

    it('useWizardContext throws when used outside EtWizard', () => {
      function BadComponent() {
        useWizardContext();
        return <View />;
      }

      expect(() => render(<BadComponent />)).toThrow('must be used within an EtWizard component');
    });
  });

  describe('Topbar slots', () => {
    it('renders TopbarEnd content', () => {
      const { getByText } = render(
        <EtWizard>
          <EtWizard.TopbarEnd>
            <Text>Close</Text>
          </EtWizard.TopbarEnd>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Close')).toBeTruthy();
    });

    it('renders TopbarStart content', () => {
      const { getByText } = render(
        <EtWizard>
          <EtWizard.TopbarStart>
            <Text>Back</Text>
          </EtWizard.TopbarStart>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Back')).toBeTruthy();
    });

    it('renders TopbarMiddle content', () => {
      const { getByText } = render(
        <EtWizard>
          <EtWizard.TopbarMiddle>
            <Text>Title</Text>
          </EtWizard.TopbarMiddle>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Title')).toBeTruthy();
    });

    it('renders all topbar slots together', () => {
      const { getByText } = render(
        <EtWizard>
          <EtWizard.TopbarStart>
            <Text>Back</Text>
          </EtWizard.TopbarStart>
          <EtWizard.TopbarMiddle>
            <Text>Title</Text>
          </EtWizard.TopbarMiddle>
          <EtWizard.TopbarEnd>
            <Text>Close</Text>
          </EtWizard.TopbarEnd>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Back')).toBeTruthy();
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Close')).toBeTruthy();
    });
  });

  describe('Tap gestures', () => {
    it('renders tap zones when tapGestures is enabled', () => {
      const { getByLabelText } = render(
        <EtWizard tapGestures accessibilityLabelLeft="Previous step" accessibilityLabelRight="Next step">
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByLabelText('Previous step')).toBeTruthy();
      expect(getByLabelText('Next step')).toBeTruthy();
    });

    it('does not render tap zones when tapGestures is disabled', () => {
      const { queryByLabelText } = render(
        <EtWizard tapGestures={false}>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(queryByLabelText('Previous step')).toBeNull();
      expect(queryByLabelText('Next step')).toBeNull();
    });
  });

  describe('WizardStep subcomponent', () => {
    it('renders children', () => {
      const { getByText } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Content</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Content')).toBeTruthy();
    });

    it('accepts testID', () => {
      const { getByTestId } = render(
        <EtWizard>
          <EtWizard.Step testID="step-1">
            <Text>Content</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByTestId('step-1')).toBeTruthy();
    });

    it('applies contentPosition bottom style', () => {
      const { getByTestId } = render(
        <EtWizard>
          <EtWizard.Step testID="step-bottom" contentPosition="bottom">
            <Text>Bottom content</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      const step = getByTestId('step-bottom');
      const flatStyle = Array.isArray(step.props.style) ? Object.assign({}, ...step.props.style.filter(Boolean)) : step.props.style;
      expect(flatStyle.justifyContent).toBe('flex-end');
    });

    it('does not apply bottom style by default', () => {
      const { getByTestId } = render(
        <EtWizard>
          <EtWizard.Step testID="step-top">
            <Text>Top content</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      const step = getByTestId('step-top');
      const flatStyle = Array.isArray(step.props.style) ? Object.assign({}, ...step.props.style.filter(Boolean)) : step.props.style;
      expect(flatStyle.justifyContent).toBeUndefined();
    });
  });

  describe('WizardFooter subcomponent', () => {
    it('renders children within footer', () => {
      const { getByText } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <Text>CTA Button</Text>
            </EtWizard.Footer>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('CTA Button')).toBeTruthy();
    });

    it('Footer accepts testID', () => {
      const { getByTestId } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer testID="wizard-footer">
              <Text>CTA</Text>
            </EtWizard.Footer>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByTestId('wizard-footer')).toBeTruthy();
    });
  });

  describe('Per-step footers', () => {
    it('renders the correct footer for each step', () => {
      const { getByText, queryByText, getByTestId } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <NextButton />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
            <EtWizard.Footer>
              <Text>Close</Text>
            </EtWizard.Footer>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Step 1')).toBeTruthy();
      expect(getByText('Next')).toBeTruthy();
      expect(queryByText('Close')).toBeNull();

      fireEvent(getByTestId('next-btn'), 'touchEnd');

      expect(getByText('Step 2')).toBeTruthy();
      expect(queryByText('Next')).toBeNull();
      expect(getByText('Close')).toBeTruthy();
    });

    it('renders no footer when step has no footer', () => {
      const { getByText, queryByText, getByTestId } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
            <EtWizard.Footer>
              <NextButton testID="next-0" />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 2</Text>
            <EtWizard.Footer>
              <NextButton testID="next-1" />
            </EtWizard.Footer>
          </EtWizard.Step>
          <EtWizard.Step>
            <Text>Step 3</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Step 1')).toBeTruthy();
      expect(getByTestId('next-0')).toBeTruthy();

      fireEvent(getByTestId('next-0'), 'touchEnd');

      expect(getByText('Step 2')).toBeTruthy();
      expect(getByTestId('next-1')).toBeTruthy();

      fireEvent(getByTestId('next-1'), 'touchEnd');

      expect(getByText('Step 3')).toBeTruthy();
      expect(queryByText('Next')).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('handles single step wizard', () => {
      const onComplete = jest.fn();

      const { getByText, getByTestId } = render(
        <EtWizard onComplete={onComplete}>
          <EtWizard.Step>
            <Text>Only step</Text>
            <EtWizard.Footer>
              <NextButton />
            </EtWizard.Footer>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(getByText('Only step')).toBeTruthy();

      fireEvent(getByTestId('next-btn'), 'touchEnd');

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('handles component unmounting gracefully', () => {
      const { unmount } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
        </EtWizard>,
      );

      expect(() => unmount()).not.toThrow();
    });

    it('renders nothing and warns in dev when no Step children are provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const onComplete = jest.fn();
      const { toJSON } = render(
        <EtWizard onComplete={onComplete}>
          <Text>Not a step</Text>
        </EtWizard>,
      );

      expect(toJSON()).toBeNull();
      expect(onComplete).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No <EtWizard.Step> children found'));

      warnSpy.mockRestore();
    });

    it('renders nothing and warns in dev when no Step children are provided with autoPlay', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const onComplete = jest.fn();
      const { toJSON } = render(
        <EtWizard autoPlay onComplete={onComplete}>
          <Text>Not a step</Text>
        </EtWizard>,
      );

      expect(toJSON()).toBeNull();
      expect(onComplete).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No <EtWizard.Step> children found'));

      warnSpy.mockRestore();
    });

    it('handles null children gracefully', () => {
      const show = false;

      const { getByText } = render(
        <EtWizard>
          <EtWizard.Step>
            <Text>Step 1</Text>
          </EtWizard.Step>
          {show && (
            <EtWizard.Step>
              <Text>Conditional</Text>
            </EtWizard.Step>
          )}
        </EtWizard>,
      );

      expect(getByText('Step 1')).toBeTruthy();
    });
  });
});
