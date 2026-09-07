import { StyleSheet } from 'react-native';

import { X3 } from '../../../core/styles/spacing';
import { InfoBaseLayout } from '../_info-base/info-base';
import type { EtUserInfoProps } from './api/types';
import { EtUserInfoContext, useDefaults, useSlots } from './hooks';
import { EtUserInfoAvatar, EtUserInfoSubtitle, EtUserInfoTitle } from './subcomponents';

function EtUserInfoBase({ children, style, testID, shrink, ...contextValueDefaults }: EtUserInfoProps) {
  const slots = useSlots(children);
  const contextValue = useDefaults(contextValueDefaults);
  const { layout, maxWidth, data } = contextValue;

  const hasSlots = slots.avatar || slots.title || slots.subtitle;

  const defaultSlots = hasSlots
    ? slots
    : {
        avatar: data.avatar?.source ? <EtUserInfoAvatar /> : null,
        title: <EtUserInfoTitle />,
        subtitle: <EtUserInfoSubtitle />,
      };

  const isHorizontal = (layout ?? 'horizontal') === 'horizontal';

  return (
    <EtUserInfoContext.Provider value={contextValue}>
      <InfoBaseLayout
        slots={defaultSlots}
        layout={layout ?? 'horizontal'}
        maxWidth={maxWidth}
        style={style}
        testID={testID}
        textBlockTestID="et-user-info-text-block"
        textBlockStyle={isHorizontal ? styles.textBlock : undefined}
        horizontalContainerStyle={[styles.horizontalContainer, shrink && isHorizontal ? styles.shrinkContainer : undefined]}
      />
    </EtUserInfoContext.Provider>
  );
}

EtUserInfoBase.displayName = 'EtUserInfo';

export const EtUserInfo = Object.assign(EtUserInfoBase, {
  Avatar: EtUserInfoAvatar,
  Title: EtUserInfoTitle,
  Subtitle: EtUserInfoSubtitle,
});

const styles = StyleSheet.create({
  horizontalContainer: {
    gap: X3,
    alignItems: 'center',
    // Stretch so the text block has a bounded width for ellipsis (historical default).
    alignSelf: 'stretch',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  /** When `shrink`, also fill a flex parent beside fixed-width siblings (e.g. rates). */
  shrinkContainer: {
    flex: 1,
  },
});
