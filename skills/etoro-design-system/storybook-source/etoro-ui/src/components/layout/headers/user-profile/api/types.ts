import { ViewProps } from 'react-native';

/**
 * Stats configuration for the header
 */
export interface UserProfileHeaderStats {
  /** Assets Under Management (raw number, e.g., 1800000) */
  aum: number;
  /** Number of copiers (raw number, e.g., 38000) */
  copiers: number;
  /** Followers count (raw number, e.g., 42500) */
  followers: number;
  /** Following count (raw number, e.g., 128) */
  following: number;
}

/**
 * User profile information for the header
 */
export interface UserProfileHeaderUser {
  /** User's display name */
  displayName: string;
  /** User's username (without @) */
  username: string;
  /** Avatar image URL */
  avatar: string;
  /** User stats */
  stats: UserProfileHeaderStats;
}

/**
 * Props for StatItem subcomponent
 */
export interface StatItemProps extends ViewProps {
  /** Already translated label text */
  label: string;
  /** Numeric value to display */
  value: number;
}

/**
 * Props for Avatar subcomponent
 */
export interface AvatarProps {
  /** Already translated accessibility label for the avatar */
  alt: string;
}

/**
 * Props for Copiers subcomponent
 */
export interface CopiersProps {
  /** Already translated/formatted copiers text (e.g., "38K copiers") */
  text: string;
}

/**
 * Props for EtUserProfileHeader component
 *
 * @example
 * ```tsx
 * <EtUserProfileHeader user={user}>
 *   <EtUserProfileHeader.UserInfo>
 *     <EtUserProfileHeader.UserInfo.Avatar alt="User's avatar" />
 *     <EtUserProfileHeader.UserInfo.Name />
 *     <EtUserProfileHeader.UserInfo.UserName />
 *     <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
 *   </EtUserProfileHeader.UserInfo>
 *   <EtUserProfileHeader.Stats>
 *     <EtUserProfileHeader.StatItem label="AUM" value={user.stats.aum} />
 *     <EtUserProfileHeader.StatItem label="Followers" value={user.stats.followers} />
 *     <EtUserProfileHeader.StatItem label="Following" value={user.stats.following} />
 *   </EtUserProfileHeader.Stats>
 * </EtUserProfileHeader>
 * ```
 */
export interface EtUserProfileHeaderProps extends ViewProps {
  /** User profile information with stats */
  user: UserProfileHeaderUser;
}
