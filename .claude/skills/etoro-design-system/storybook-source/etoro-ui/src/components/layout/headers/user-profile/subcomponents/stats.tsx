import React, { Children } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { X2 } from '../../../../../core/styles/spacing';

/**
 * Stats section container. Renders StatItem children with dividers.
 *
 * @example
 * ```tsx
 * <EtUserProfileHeader.Stats>
 *   <EtUserProfileHeader.StatItem label="AUM" value={user.stats.aum} />
 *   <EtUserProfileHeader.StatItem label="Followers" value={user.stats.followers} />
 *   <EtUserProfileHeader.StatItem label="Following" value={user.stats.following} />
 * </EtUserProfileHeader.Stats>
 * ```
 */
export function Stats({ children, style, ...viewProps }: ViewProps) {
  const { colors } = useEtoroTheme();
  const items = Children.toArray(children);

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <View style={[styles.divider, { backgroundColor: colors.dividerQuinarySecondary }]} />}
          {item}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    paddingTop: X2,
  },
  divider: {
    width: 1,
  },
});
