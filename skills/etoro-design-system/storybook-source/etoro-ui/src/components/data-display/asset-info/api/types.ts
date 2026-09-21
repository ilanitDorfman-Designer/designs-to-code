import type { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import type { InfoAvatarShape, InfoAvatarSize, InfoDataBase, InfoEllipsizeMode, InfoLayoutType } from '../../_info-base/types';

/** Layout direction for the asset row/card. Re-exports InfoLayoutType for component-specific naming. */
export type EtAssetInfoLayoutType = InfoLayoutType;

/** Avatar size; maps to avatar/list conventions. Re-exports InfoAvatarSize for component-specific naming. */
export type EtAssetInfoAvatarSize = InfoAvatarSize;

/** Avatar shape; circle for avatars, square for asset logos. Re-exports InfoAvatarShape. */
export type EtAssetInfoAvatarShape = InfoAvatarShape;

export interface EtAssetInfoProps {
  /** Data object containing the asset information. Required prop. */
  data: EtAssetData;

  /** Layout direction. @default 'horizontal' */
  layout?: EtAssetInfoLayoutType;

  /** Ellipsize mode for text truncation: can be 'head', 'middle', 'tail' or 'clip'. @default 'tail' */
  ellipsizeMode?: InfoEllipsizeMode;

  /**
   * Maximum width for the text block in horizontal layout, to ensure proper ellipsizing.
   * When omitted, the text block is not constrained. In vertical layout, this prop is ignored.
   */
  maxWidth?: number;

  /**
   * When true, the asset info fills its flex parent and the text block shrinks to enable proper ellipsis truncation.
   * Use when the parent is a flex row with siblings (e.g. price) that should keep their natural width.
   * @default false
   */
  shrink?: boolean;

  /** Compound children (EtAssetInfo.Avatar, .Title, .Subtitle). Optional prop. */
  children?: ReactNode | ReactNode[];

  /** Styles applied to the root container */
  style?: StyleProp<ViewStyle>;
}

/** Data object containing the asset information. Re-exports InfoDataBase for component-specific naming. */
export type EtAssetData = InfoDataBase;

/** Input type for useDefaults - accepts optional layout/ellipsizeMode before resolution. */
export type EtAssetDefaultsInput = Pick<EtAssetInfoProps, 'data' | 'layout' | 'ellipsizeMode' | 'maxWidth'>;

/**
 * Resolved context value from useDefaults. layout and ellipsizeMode are always set.
 */
export type EtAssetDefaults = EtAssetDefaultsInput & {
  layout: InfoLayoutType;
  ellipsizeMode: InfoEllipsizeMode;
};
