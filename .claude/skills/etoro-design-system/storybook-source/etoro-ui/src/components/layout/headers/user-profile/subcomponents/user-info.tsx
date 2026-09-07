import { Children } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { HALF, X3 } from '../../../../../core/styles/spacing';
import { EtText } from '../../../../../foundations/text/et-text';
import { getChildrenByType } from '../../../../../utils/elements';
import { EtIconV2 } from '../../../../et-icon-v2/et-icon-v2';
import { EtAvatar } from '../../../../social/avatar/et-avatar';
import { AvatarProps, CopiersProps } from '../api';
import { useUserProfileContext } from '../context';

/**
 * Avatar subcomponent - displays user avatar from context.
 */
export function Avatar({ alt }: AvatarProps) {
  const { user } = useUserProfileContext();

  return (
    <EtAvatar size="medium">
      <EtAvatar.Image src={user.avatar} alt={alt} />
      {/* TODO: Consider showing username initials as fallback text. */}
      <EtAvatar.Fallback>
        <View />
      </EtAvatar.Fallback>
    </EtAvatar>
  );
}
Avatar.displayName = 'UserInfo.Avatar';

/**
 * Name subcomponent - displays user display name from context.
 */
export function Name() {
  const { user } = useUserProfileContext();
  const { colors } = useEtoroTheme();

  const textStyle = {
    color: colors.textPrimaryNeutral,
  };

  return (
    <EtText variant="body-base-semibold" style={textStyle}>
      {user.displayName}
    </EtText>
  );
}
Name.displayName = 'UserInfo.Name';

/**
 * UserName subcomponent - displays username with @ prefix from context.
 */
export function UserName() {
  const { user } = useUserProfileContext();
  const { colors } = useEtoroTheme();

  const textStyle = {
    color: colors.textSecondaryNeutral,
  };
  const formattedUsername = `@${user.username}`;

  return (
    <EtText variant="body-tiny-regular" style={textStyle}>
      {formattedUsername}
    </EtText>
  );
}
UserName.displayName = 'UserInfo.UserName';

/**
 * Copiers subcomponent - displays copiers count from context.
 */
export function Copiers({ text }: CopiersProps) {
  const { colors } = useEtoroTheme();

  const textStyle = {
    color: colors.textSecondaryNeutral,
  };

  return (
    <EtText variant="body-tiny-regular" style={textStyle}>
      {text}
    </EtText>
  );
}
Copiers.displayName = 'UserInfo.Copiers';

/**
 * User information section with composable subcomponents.
 * Consumes user data from EtUserProfileHeader context.
 *
 * @example
 * ```tsx
 * <EtUserProfileHeader.UserInfo>
 *   <EtUserProfileHeader.UserInfo.Avatar alt="User's avatar" />
 *   <EtUserProfileHeader.UserInfo.Name />
 *   <EtUserProfileHeader.UserInfo.UserName />
 *   <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
 * </EtUserProfileHeader.UserInfo>
 * ```
 */
function UserInfoBase({ children, style, testID, ...viewProps }: ViewProps) {
  const { colors } = useEtoroTheme();
  const childArray = Children.toArray(children);

  const avatarChildren = getChildrenByType(childArray, Avatar);
  const nameChildren = getChildrenByType(childArray, Name);
  const userNameChildren = getChildrenByType(childArray, UserName);
  const copiersChildren = getChildrenByType(childArray, Copiers);

  const hasUserName = userNameChildren.length > 0;
  const hasCopiers = copiersChildren.length > 0;

  return (
    <View style={[styles.container, style]} testID={testID} {...viewProps}>
      {avatarChildren}
      <View style={styles.details}>
        {nameChildren}
        {(hasUserName || hasCopiers) && (
          <View style={styles.metaRow}>
            {userNameChildren}
            {hasUserName && hasCopiers && <EtIconV2 name="dot" size="xs" color={colors.textSecondaryNeutral} />}
            {copiersChildren}
          </View>
        )}
      </View>
    </View>
  );
}

export const UserInfo = Object.assign(UserInfoBase, {
  Avatar,
  Name,
  UserName,
  Copiers,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X3,
  },
  details: {
    flex: 1,
    gap: HALF,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HALF,
  },
});
