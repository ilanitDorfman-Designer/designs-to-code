import React, { FC } from 'react';

import { FooterCommentsProps } from '../../api/types';
import { FooterAction } from './footer-action';

function FooterCommentsBase({ children, onPress, onCountPress, testID }: FooterCommentsProps) {
  return (
    <FooterAction
      iconName="comment"
      count={children}
      onPress={onPress}
      onCountPress={onCountPress}
      testID={testID}
      iconTestIDSuffix="comment"
      countTestIDSuffix="comment-count"
    />
  );
}

FooterCommentsBase.displayName = 'EtPost.Comments';

export const FooterComments: FC<FooterCommentsProps> = React.memo(FooterCommentsBase);
FooterComments.displayName = 'EtPost.Comments';
