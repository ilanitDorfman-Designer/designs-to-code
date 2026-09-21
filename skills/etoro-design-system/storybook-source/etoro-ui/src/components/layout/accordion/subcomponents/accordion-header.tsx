import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X1, X2, X5 } from '../../../../core/styles/spacing';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { EtAccordionHeaderProps } from '../api';
import { useAccordionItemContext } from '../context';
import { useAccordionAnimation } from '../hooks';
import { validateEtTextChildren } from '../utils';

/** Props shape for EtText children (style from React Native Text) */
interface ChildWithStyle {
  style?: React.ComponentProps<typeof Text>['style'];
}

/**
 * Applies header text color to EtText children (Figma overlay-neutral-text → textPrimaryNeutral).
 * Injected color overrides any color passed via EtText style—the accordion header enforces
 * consistent text color for all header content.
 */
function applyHeaderTextColor(children: React.ReactNode, color: string): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<ChildWithStyle>(child)) return child;
    const { style } = child.props;
    const styleProp = style !== undefined ? [style, { color }] : { color };
    return React.cloneElement(child, { style: styleProp });
  });
}

/**
 * EtAccordion.Header - Clickable header for accordion item
 *
 * Contains the question text and an animated chevron icon.
 * Clicking toggles the expanded state of the parent item.
 *
 * @throws Error if children are not EtText components
 */
export const AccordionHeader = memo(function AccordionHeader({ children, style, showChevron = true, testID }: EtAccordionHeaderProps) {
  const { colors } = useEtoroTheme();
  const { isExpanded, disabled, toggle } = useAccordionItemContext();
  const { chevronAnimatedStyle } = useAccordionAnimation({ isExpanded });

  // Validate that children are EtText components only
  validateEtTextChildren(children, 'EtAccordion.Header');

  // Figma: gap 20px collapsed, 16px expanded between header and content
  const marginBottom = isExpanded ? X1 : X5;

  // Figma: header text uses var(--overlay-neutral-text) → textPrimaryNeutral
  const headerChildren = applyHeaderTextColor(children, colors.textPrimaryNeutral);

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      style={({ pressed }) => [styles.container, { marginBottom }, style, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded, disabled }}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
    >
      <View style={styles.content}>{headerChildren}</View>
      {showChevron && (
        <Animated.View style={[styles.chevronContainer, chevronAnimatedStyle as AnimatedStyle<ViewStyle>]}>
          <EtoroIcon
            icon={{ iconName: 'chevronDown' }}
            appearance={{
              size: 'sm',
              color: disabled ? colors.textDisabledPrimaryNeutral : colors.textPrimaryNeutral,
            }}
          />
        </Animated.View>
      )}
    </Pressable>
  );
});

AccordionHeader.displayName = 'EtAccordion.Header';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    flex: 1,
    paddingRight: X2,
  },
  chevronContainer: {
    padding: X2,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
