import { ReactNode } from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { EtTextProps } from '../../../../../foundations/text/api/types';

/**
 * Props for EtBottomSheet.Header
 *
 * A compound component that provides Title and Action subcomponents
 * for building bottom sheet headers.
 *
 * ## Compound API
 *
 * ```tsx
 * <EtBottomSheet.Header>
 *   <EtBottomSheet.Header.Title>Settings</EtBottomSheet.Header.Title>
 *   <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
 *     <EtoroIcon icon={{ iconName: 'close' }} />
 *   </EtBottomSheet.Header.Action>
 * </EtBottomSheet.Header>
 * ```
 *
 * ## Custom content
 *
 * ```tsx
 * <EtBottomSheet.Header>
 *   <YourCustomHeaderComponent />
 * </EtBottomSheet.Header>
 * ```
 */
export interface EtBottomSheetHeaderProps {
  children?: ReactNode;

  /** Custom style override for the header container. */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing purposes. */
  testID?: string;
}

/**
 * Props for EtBottomSheet.Header.Title
 *
 * Renders centered title text inside the header.
 * Extends EtTextProps so consumers can override variant, style, etc.
 *
 * @example
 * ```tsx
 * <EtBottomSheet.Header.Title>Settings</EtBottomSheet.Header.Title>
 * ```
 */
export type EtBottomSheetHeaderTitleProps = EtTextProps;

/**
 * Props for EtBottomSheet.Header.Action
 *
 * A pressable action button positioned at the trailing edge of the header.
 * Mirrors the TopbarAction API (PressableProps with accessibilityRole="button" and hitSlop=10).
 *
 * @example
 * ```tsx
 * <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
 *   <EtoroIcon icon={{ iconName: 'close' }} />
 * </EtBottomSheet.Header.Action>
 * ```
 */
export type EtBottomSheetHeaderActionProps = PressableProps;
