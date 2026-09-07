import type { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import type { InfoAvatarSize, InfoDataBase, InfoEllipsizeMode, InfoLayoutType } from '../../_info-base/types';

/** Layout direction for the user row. Re-exports InfoLayoutType for component-specific naming. */
export type EtUserInfoLayoutType = InfoLayoutType;

/** Avatar size; maps to avatar/list conventions. Re-exports InfoAvatarSize for component-specific naming. */
export type EtUserInfoAvatarSize = InfoAvatarSize;

export interface EtUserInfoProps {
  /** Data object containing the user information. Required prop. */
  data: EtUserData;

  /** Layout direction. @default 'horizontal' */
  layout?: EtUserInfoLayoutType;

  /** Ellipsize mode for text truncation: can be 'head', 'middle', 'tail' or 'clip'. @default 'tail' */
  ellipsizeMode?: InfoEllipsizeMode;

  /**
   * Maximum width for the text block in horizontal layout, to ensure proper ellipsizing.
   * When omitted, the text block is not constrained. In vertical layout, this prop is ignored.
   */
  maxWidth?: number;

  /**
   * When true, also fills a flex parent (`flex: 1`) beside fixed-width siblings (e.g. rates).
   * Horizontal layout always stretches and ellipsizes the text block by default.
   * @default false
   */
  shrink?: boolean;

  /** Compound children (EtUserInfo.Avatar, .Title, .Subtitle). Optional prop. */
  children?: ReactNode | ReactNode[];

  /** Styles applied to the root container */
  style?: StyleProp<ViewStyle>;

  /** Test identifier for the root container */
  testID?: string;
}

/** Data object containing the user information. Re-exports InfoDataBase for component-specific naming. */
export type EtUserData = InfoDataBase;

/** Input type for useDefaults - accepts optional layout/ellipsizeMode before resolution. */
export type EtUserDefaultsInput = Pick<EtUserInfoProps, 'data' | 'layout' | 'ellipsizeMode' | 'maxWidth'>;

/**
 * Resolved context value from useDefaults. layout and ellipsizeMode are always set.
 */
export type EtUserDefaults = EtUserDefaultsInput & {
  layout: EtUserInfoLayoutType;
  ellipsizeMode: InfoEllipsizeMode;
};
