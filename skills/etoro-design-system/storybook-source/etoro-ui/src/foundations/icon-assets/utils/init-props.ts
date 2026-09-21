import { EtoroIconProps } from '../api/types';

/**
 * Extract props with defaults
 * @param props props
 * @returns Initialized props with defaults
 */
export function initProps(props: EtoroIconProps): Required<EtoroIconProps> {
  return {
    icon: props.icon,
    appearance: {
      size: props.appearance?.size || 'md',
      color: props.appearance?.color,
      ...props.appearance,
    },
    style: {
      hasFill: props.style?.hasFill || false,
      fill: props.style?.fill,
      style: props.style?.style,
      ...props.style,
    },
    accessibility: {
      testID: props.accessibility?.testID,
      accessibilityLabel: props.accessibility?.accessibilityLabel,
      accessibilityHint: props.accessibility?.accessibilityHint,
      accessibilityRole: props.accessibility?.accessibilityRole || 'image',
      ...props.accessibility,
    },
    advanced: {
      svgProps: props.advanced?.svgProps,
      cache: props.advanced?.cache || true,
      ...props.advanced,
    },
  };
}
