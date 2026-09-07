import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { ReactElement, ReactNode } from 'react';
import { Children, cloneElement, isValidElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EtTopbar } from '../../../components/topbar';
import { useEtoroTheme } from '../../../core/hooks';
import type { EtWizardProps, WizardContextValue } from './api';
import { WizardContext } from './context';
import { useStepProgressAnimation, useWizardState } from './hooks';
import {
  WizardButton,
  WizardFooter,
  WizardIcon,
  WizardStep,
  WizardSubtitle,
  WizardTapZones,
  WizardTitle,
  WizardTopbarEnd,
  WizardTopbarMiddle,
  WizardTopbarStart,
} from './subcomponents';
import type { WizardFooterProps } from './subcomponents/wizard-footer';
import type { WizardStepProps } from './subcomponents/wizard-step';
import type { WizardTopbarSlotProps } from './subcomponents/wizard-topbar-slot';

const DEFAULT_STEP_DURATION = 5000;
const SCRIM_OPACITY = 'rgba(0,0,0,0.75)';

function StepBackgroundVideo({ source, paused }: { source: string; paused?: boolean }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.muted = true;
    p.play();
  });

  useEffect(() => {
    if (paused) {
      player.pause();
    } else {
      player.play();
    }
  }, [paused, player]);

  return <VideoView player={player} style={styles.fullScreenBackground} contentFit="cover" nativeControls={false} />;
}

const TOPBAR_SLOT_NAMES = ['EtWizard.TopbarStart', 'EtWizard.TopbarMiddle', 'EtWizard.TopbarEnd'] as const;

function isStepElement(child: ReactNode): child is ReactElement<WizardStepProps> {
  return isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtWizard.Step';
}

function isFooterElement(child: ReactNode): child is ReactElement<WizardFooterProps> {
  return isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtWizard.Footer';
}

function isTopbarSlotElement(child: ReactNode): child is ReactElement<WizardTopbarSlotProps> {
  const displayName = isValidElement(child) ? (child.type as { displayName?: string }).displayName : undefined;
  return displayName != null && (TOPBAR_SLOT_NAMES as readonly string[]).includes(displayName);
}

interface ExtractedChildren {
  steps: ReactElement<WizardStepProps>[];
  footers: (ReactElement<WizardFooterProps> | null)[];
  topbarStart: ReactElement<WizardTopbarSlotProps> | null;
  topbarMiddle: ReactElement<WizardTopbarSlotProps> | null;
  topbarEnd: ReactElement<WizardTopbarSlotProps> | null;
}

function extractFooterFromStep(stepChildren: ReactNode): {
  filteredChildren: ReactNode[];
  footer: ReactElement<WizardFooterProps> | null;
} {
  const filteredChildren: ReactNode[] = [];
  let footer: ReactElement<WizardFooterProps> | null = null;

  Children.forEach(stepChildren, (child) => {
    if (!footer && isFooterElement(child)) {
      footer = child;
    } else {
      filteredChildren.push(child);
    }
  });

  return { filteredChildren, footer };
}

function useExtractChildren(children: ReactNode): ExtractedChildren {
  return useMemo(() => {
    const steps: ReactElement<WizardStepProps>[] = [];
    const footers: (ReactElement<WizardFooterProps> | null)[] = [];
    let topbarStart: ReactElement<WizardTopbarSlotProps> | null = null;
    let topbarMiddle: ReactElement<WizardTopbarSlotProps> | null = null;
    let topbarEnd: ReactElement<WizardTopbarSlotProps> | null = null;

    Children.forEach(children, (child) => {
      if (isStepElement(child)) {
        const { filteredChildren, footer } = extractFooterFromStep(child.props.children);
        footers.push(footer);
        if (footer) {
          steps.push(cloneElement(child, {}, ...filteredChildren));
        } else {
          steps.push(child);
        }
      } else if (isTopbarSlotElement(child)) {
        const displayName = (child.type as { displayName?: string }).displayName ?? '';
        if (displayName === 'EtWizard.TopbarStart') {
          if (topbarStart == null) {
            topbarStart = child;
          } else if (__DEV__) {
            console.warn('EtWizard: Duplicate <EtWizard.TopbarStart> detected. Only the first TopbarStart is rendered.');
          }
        } else if (displayName === 'EtWizard.TopbarMiddle') {
          if (topbarMiddle == null) {
            topbarMiddle = child;
          } else if (__DEV__) {
            console.warn('EtWizard: Duplicate <EtWizard.TopbarMiddle> detected. Only the first TopbarMiddle is rendered.');
          }
        } else if (displayName === 'EtWizard.TopbarEnd') {
          if (topbarEnd == null) {
            topbarEnd = child;
          } else if (__DEV__) {
            console.warn('EtWizard: Duplicate <EtWizard.TopbarEnd> detected. Only the first TopbarEnd is rendered.');
          }
        }
      }
    });

    return { steps, footers, topbarStart, topbarMiddle, topbarEnd };
  }, [children]);
}

/**
 * EtWizard - Multi-step guided flow layout.
 *
 * Features:
 * - Segmented progress bar (integrated in topbar)
 * - Animated segment fill (configurable duration, default 5s)
 * - Optional left/right tap zones for step navigation (`tapGestures`)
 * - Pause/resume on press for auto-play modes (pauses both timer and background video)
 * - Button navigation skips animation
 * - Per-step footers declared inside each Step; the wizard extracts them
 *   and renders them in a fixed footer area below the step content
 *
 * @example Per-step footers with different actions per step
 * ```tsx
 * <EtWizard onComplete={handleDone}>
 *   <EtWizard.TopbarEnd>
 *     <EtIconButton iconName="close" onPress={handleClose} />
 *   </EtWizard.TopbarEnd>
 *
 *   <EtWizard.Step>
 *     <EtWizard.Title>Welcome</EtWizard.Title>
 *     <EtWizard.Subtitle>Get started with eToro.</EtWizard.Subtitle>
 *     <EtWizard.Footer>
 *       <EtWizard.Button>
 *         <EtWizard.Button.Icon name="star" />
 *         <EtWizard.Button.Label>Next</EtWizard.Button.Label>
 *       </EtWizard.Button>
 *     </EtWizard.Footer>
 *   </EtWizard.Step>
 *
 *   <EtWizard.Step>
 *     <EtWizard.Title>All Done</EtWizard.Title>
 *     <EtWizard.Footer>
 *       <EtWizard.Button onPress={handleClose}>Close</EtWizard.Button>
 *     </EtWizard.Footer>
 *   </EtWizard.Step>
 * </EtWizard>
 * ```
 */
function EtWizardBase({
  children,
  stepDuration = DEFAULT_STEP_DURATION,
  autoPlay = false,
  tapGestures = false,
  initialStep = 0,
  onStepChange,
  onComplete,
  progressColor,
  accessibilityLabelLeft,
  accessibilityLabelRight,
  style,
  testID,
}: EtWizardProps) {
  const { colors } = useEtoroTheme();
  const insets = useSafeAreaInsets();
  const { steps, footers, topbarStart, topbarMiddle, topbarEnd } = useExtractChildren(children);
  const totalSteps = steps.length;

  const { currentStep, goToNext, goToPrevious } = useWizardState({
    totalSteps,
    initialStep,
    onStepChange,
    onComplete,
  });

  const activeStepDuration = steps[currentStep]?.props.stepDuration ?? stepDuration;

  const safeAutoPlay = autoPlay && totalSteps > 0;

  const { stepProgress, animatingStep, pause, resume } = useStepProgressAnimation({
    currentStep,
    autoPlay: safeAutoPlay,
    stepDuration: activeStepDuration,
    onSegmentComplete: goToNext,
  });

  const progressCurrentStep = safeAutoPlay ? currentStep : currentStep + 1;
  const progressStepValue = safeAutoPlay ? stepProgress : undefined;
  const progressAnimatingStep = safeAutoPlay ? animatingStep : undefined;

  const contextValue: WizardContextValue = useMemo(
    () => ({
      currentStep,
      totalSteps,
      goToNext,
      goToPrevious,
    }),
    [currentStep, totalSteps, goToNext, goToPrevious],
  );

  const [videoPaused, setVideoPaused] = useState(false);

  const handlePressIn = useCallback(() => {
    if (tapGestures && safeAutoPlay) {
      pause();
      setVideoPaused(true);
    }
  }, [tapGestures, safeAutoPlay, pause]);

  const handlePressOut = useCallback(() => {
    if (tapGestures && safeAutoPlay) {
      resume();
      setVideoPaused(false);
    }
  }, [tapGestures, safeAutoPlay, resume]);

  if (totalSteps === 0) {
    if (__DEV__) {
      console.warn('EtWizard: No <EtWizard.Step> children found. The wizard requires at least one step.');
    }
    return null;
  }

  const currentStepElement = steps[currentStep] ?? null;
  const stepProps = currentStepElement?.props;
  const bgImage = stepProps?.backgroundImage;
  const bgVideo = stepProps?.backgroundVideo;
  const hasBackground = !!(bgImage || bgVideo);
  const showScrim = stepProps?.contentPosition === 'bottom' && hasBackground;

  const activeFooter = footers[currentStep] ?? null;

  return (
    <WizardContext.Provider value={contextValue}>
      <View style={[styles.root, style]} testID={testID}>
        {bgVideo && <StepBackgroundVideo source={bgVideo} paused={videoPaused} />}
        {!bgVideo && bgImage && <Image source={bgImage} style={styles.fullScreenBackground} resizeMode="cover" />}
        {showScrim && <LinearGradient colors={[colors.transparent, SCRIM_OPACITY]} style={styles.fullScreenScrim} />}

        <View style={[styles.topbarContainer, { paddingTop: insets.top }]}>
          <EtTopbar style={hasBackground && { backgroundColor: colors.transparent }}>
            {topbarStart ? <EtTopbar.Start>{topbarStart}</EtTopbar.Start> : null}
            {topbarMiddle ? <EtTopbar.Middle>{topbarMiddle}</EtTopbar.Middle> : null}
            {topbarEnd ? <EtTopbar.End>{topbarEnd}</EtTopbar.End> : null}
            <EtTopbar.StepProgress
              steps={totalSteps}
              currentStep={progressCurrentStep}
              stepProgress={progressStepValue}
              animatingStep={progressAnimatingStep}
              color={progressColor}
            />
          </EtTopbar>
        </View>

        <View style={styles.stepContent}>{currentStepElement}</View>

        {activeFooter && (
          <View style={styles.footerContainer} pointerEvents="box-none">
            {activeFooter}
          </View>
        )}

        {tapGestures && (
          <View style={styles.tapZoneLayer} pointerEvents="box-none">
            <WizardTapZones
              onTapLeft={goToPrevious}
              onTapRight={goToNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              accessibilityLabelLeft={accessibilityLabelLeft}
              accessibilityLabelRight={accessibilityLabelRight}
            />
          </View>
        )}
      </View>
    </WizardContext.Provider>
  );
}

EtWizardBase.displayName = 'EtWizard';

export const EtWizard = Object.assign(EtWizardBase, {
  Step: WizardStep,
  Footer: WizardFooter,
  Button: WizardButton,
  Title: WizardTitle,
  Subtitle: WizardSubtitle,
  Icon: WizardIcon,
  TopbarStart: WizardTopbarStart,
  TopbarMiddle: WizardTopbarMiddle,
  TopbarEnd: WizardTopbarEnd,
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  fullScreenBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  fullScreenScrim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  topbarContainer: {
    zIndex: 10,
    width: '100%',
  },
  stepContent: {
    flex: 1,
    width: '100%',
    zIndex: 2,
  },
  footerContainer: {
    width: '100%',
    zIndex: 5,
  },
  tapZoneLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
});
