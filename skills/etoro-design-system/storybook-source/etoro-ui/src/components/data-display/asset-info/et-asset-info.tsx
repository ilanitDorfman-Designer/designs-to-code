import { StyleSheet } from 'react-native';

import { InfoBaseLayout } from '../_info-base/info-base';
import type { EtAssetInfoProps } from './api/types';
import { EtAssetInfoContext, useDefaults, useSlots } from './hooks';
import { EtAssetInfoAvatar, EtAssetInfoSubtitle, EtAssetInfoTitle } from './subcomponents';

function EtAssetInfoBase({ children, style, shrink, ...contextValueDefaults }: EtAssetInfoProps) {
  const slots = useSlots(children);
  const contextValue = useDefaults(contextValueDefaults);
  const { layout, maxWidth } = contextValue;

  return (
    <EtAssetInfoContext.Provider value={contextValue}>
      <InfoBaseLayout
        slots={slots}
        layout={layout ?? 'horizontal'}
        maxWidth={maxWidth}
        style={style}
        horizontalContainerStyle={shrink ? styles.shrinkContainer : undefined}
        textBlockStyle={shrink ? styles.shrinkTextBlock : undefined}
      />
    </EtAssetInfoContext.Provider>
  );
}

EtAssetInfoBase.displayName = 'EtAssetInfo';

export const EtAssetInfo = Object.assign(EtAssetInfoBase, {
  Avatar: EtAssetInfoAvatar,
  Title: EtAssetInfoTitle,
  Subtitle: EtAssetInfoSubtitle,
});

const styles = StyleSheet.create({
  shrinkContainer: {
    flex: 1,
  },
  shrinkTextBlock: {
    flex: 1,
    minWidth: 0,
  },
});
