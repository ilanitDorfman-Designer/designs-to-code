import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { X6 } from '../../../../core/styles';
import { EtLink } from '../../../link';
import { PostTranslateProps } from '../api/types';

function PostTranslateBase({ linkText, loading = false, onPress, style, testID }: PostTranslateProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <EtLink variant="primary" size="small" loading={loading} onPress={onPress} testID={testID ? `${testID}-link` : undefined}>
        <EtLink.Label>{linkText}</EtLink.Label>
      </EtLink>
    </View>
  );
}

PostTranslateBase.displayName = 'EtPost.Translate';

export const PostTranslate: FC<PostTranslateProps> = React.memo(PostTranslateBase);
PostTranslate.displayName = 'EtPost.Translate';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    alignSelf: 'flex-start',
  },
});
