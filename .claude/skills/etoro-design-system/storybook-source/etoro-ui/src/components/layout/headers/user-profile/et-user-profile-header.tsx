import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X6 } from '../../../../core/styles/spacing';
import { EtUserProfileHeaderProps } from './api';
import { UserProfileProvider } from './context';
import { StatItem, Stats, UserInfo } from './subcomponents';

// Re-export types for convenience
export type { EtUserProfileHeaderProps } from './api';

/**
 * User profile header component with compound component pattern.
 * Provides user context to all subcomponents.
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
function EtUserProfileHeaderBase({ user, children, style, ...viewProps }: EtUserProfileHeaderProps) {
  const { colors } = useEtoroTheme();

  return (
    <UserProfileProvider value={{ user }}>
      <View style={[styles.container, { backgroundColor: colors.bgNeutralSecondary }, style]} {...viewProps}>
        {children}
      </View>
    </UserProfileProvider>
  );
}

export const EtUserProfileHeader = Object.assign(EtUserProfileHeaderBase, {
  UserInfo,
  Stats,
  StatItem,
});

const styles = StyleSheet.create({
  container: {
    gap: X6,
  },
});
