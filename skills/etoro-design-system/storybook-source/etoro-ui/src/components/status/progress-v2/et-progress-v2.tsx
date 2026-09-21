import { memo } from 'react';

import { EtProgressV2Props } from './api';
import { ProgressCircle, ProgressLine, ProgressLineSectioned } from './subcomponents';

/**
 * Progress indicator component with line and circle variants.
 *
 * A flexible progress indicator that visualizes completion percentage.
 * Supports two visual variants matching the Figma design system.
 *
 * @example Line variant (default)
 * ```tsx
 * <EtProgressV2 progress={0.6} />
 * ```
 *
 * @example Line variant with label
 * ```tsx
 * <EtProgressV2 progress={0.6} showLabel />
 * ```
 *
 * @example Line variant medium size
 * ```tsx
 * <EtProgressV2 progress={0.6} size="medium" showLabel />
 * ```
 *
 * @example Circle variant (shows percentage by default)
 * ```tsx
 * <EtProgressV2 variant="circle" progress={0.6} />
 * ```
 *
 * @example Circle variant with custom content
 * ```tsx
 * <EtProgressV2 variant="circle" progress={0.6} size="large">
 *   <EtText variant="body-tiny-regular">$186</EtText>
 * </EtProgressV2>
 * ```
 *
 * @example Sectioned Line variant
 * ```tsx
 * <EtProgressV2 variant="line-sectioned" progress={0.5} sections={4} />
 * ```
 *
 * @example Neutral color scheme
 * ```tsx
 * <EtProgressV2 progress={0.6} color="neutral" />
 * ```
 */
function EtProgressV2Base(props: EtProgressV2Props) {
  const { progress, variant = 'line', color = 'positive', showBackground = false, style, testID, fillEntering, customColor } = props;

  if (variant === 'circle') {
    const { size = 'medium', children } = props as Extract<EtProgressV2Props, { variant: 'circle' }>;

    return (
      <ProgressCircle
        progress={progress}
        size={size}
        color={color}
        showBackground={showBackground}
        customColor={customColor}
        style={style}
        testID={testID}
      >
        {children}
      </ProgressCircle>
    );
  }

  if (variant === 'line-sectioned') {
    const { sections, gap, size = 'small' } = props as Extract<EtProgressV2Props, { variant: 'line-sectioned' }>;

    return (
      <ProgressLineSectioned
        progress={progress}
        sections={sections}
        gap={gap}
        size={size}
        color={color}
        showBackground={showBackground}
        customColor={customColor}
        style={style}
        testID={testID}
        fillEntering={fillEntering}
      />
    );
  }

  // Line variant (default)
  const { size = 'small', showLabel = false, labelText } = props as Extract<EtProgressV2Props, { variant?: 'line' }>;

  return (
    <ProgressLine
      progress={progress}
      size={size}
      color={color}
      showBackground={showBackground}
      showLabel={showLabel}
      labelText={labelText}
      customColor={customColor}
      style={style}
      testID={testID}
      fillEntering={fillEntering}
    />
  );
}

EtProgressV2Base.displayName = 'EtProgressV2';

export const EtProgressV2 = memo(EtProgressV2Base);
