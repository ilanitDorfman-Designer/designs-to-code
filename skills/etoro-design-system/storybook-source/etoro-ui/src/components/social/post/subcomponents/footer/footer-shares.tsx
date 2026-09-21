import React, { FC } from 'react';

import { FooterSharesProps } from '../../api/types';
import { FooterAction } from './footer-action';

function FooterSharesBase({ children, onPress, onCountPress, testID }: FooterSharesProps) {
  return (
    <FooterAction
      iconName="share"
      count={children}
      onPress={onPress}
      onCountPress={onCountPress}
      testID={testID}
      iconTestIDSuffix="share-icon"
      countTestIDSuffix="share-count"
    />
  );
}

FooterSharesBase.displayName = 'EtPost.Shares';

export const FooterShares: FC<FooterSharesProps> = React.memo(FooterSharesBase);
FooterShares.displayName = 'EtPost.Shares';
