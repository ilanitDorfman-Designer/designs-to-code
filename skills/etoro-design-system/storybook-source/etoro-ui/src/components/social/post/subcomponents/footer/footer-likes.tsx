import React, { FC } from 'react';

import { FooterLikesProps } from '../../api/types';
import { FooterAction } from './footer-action';

function FooterLikesBase({ children, onPress, onCountPress, isActive, testID }: FooterLikesProps) {
  return (
    <FooterAction
      iconName="like"
      count={children}
      onPress={onPress}
      onCountPress={onCountPress}
      isActive={isActive}
      testID={testID}
      iconTestIDSuffix="like-icon"
      countTestIDSuffix="like-count"
    />
  );
}

FooterLikesBase.displayName = 'EtPost.Likes';

export const FooterLikes: FC<FooterLikesProps> = React.memo(FooterLikesBase);
FooterLikes.displayName = 'EtPost.Likes';
