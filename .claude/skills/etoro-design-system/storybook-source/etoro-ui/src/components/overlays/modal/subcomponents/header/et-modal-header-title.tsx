import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../../foundations/text/et-text';
import { EtModalHeaderTitleProps } from '../../api';

function EtModalHeaderTitleBase({ children }: EtModalHeaderTitleProps): React.JSX.Element {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="label-primary-semibold" style={[styles.title, { color: colors.textPrimaryNeutral }]} numberOfLines={1}>
      {children}
    </EtText>
  );
}

export const EtModalHeaderTitle = memo(EtModalHeaderTitleBase);
EtModalHeaderTitle.displayName = 'EtModal.Header.Title';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});
