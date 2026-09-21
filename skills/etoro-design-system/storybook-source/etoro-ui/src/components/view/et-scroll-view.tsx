import { memo, useState } from 'react';
import { ScrollView } from 'react-native';

import { EtScrollViewProps } from './api/types';
import { LoadableContent } from './loadable-content';

/**
 * `EtScrollView` — a plain React Native `ScrollView` that can optionally show a
 * loading skeleton.
 *
 * Without a `skeleton` prop it is exactly a `ScrollView` (zero loading overhead).
 * Pass a `skeleton` to make it loading-aware: while `loading` is `true` the
 * skeleton is shown and scrolling is suspended, and when it flips `false` the
 * skeleton dissolves to reveal the scrollable children (no hard cut).
 *
 * NOTE: this is NOT a screen container. `EtScreen` remains the screen root;
 * `EtScrollView` is a content/region container.
 */
function EtScrollViewComponent({
  loading = false,
  skeleton,
  fill,
  duration,
  skeletonBackground,
  children,
  scrollEnabled,
  ...scrollViewProps
}: EtScrollViewProps) {
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(loading);

  if (skeleton == null) {
    return (
      <ScrollView scrollEnabled={scrollEnabled} {...scrollViewProps}>
        {children}
      </ScrollView>
    );
  }

  return (
    <ScrollView scrollEnabled={loading || isSkeletonVisible ? false : scrollEnabled} {...scrollViewProps}>
      <LoadableContent
        loading={loading}
        skeleton={skeleton}
        fill={fill}
        duration={duration}
        skeletonBackground={skeletonBackground}
        onSkeletonVisibleChange={setIsSkeletonVisible}
      >
        {children}
      </LoadableContent>
    </ScrollView>
  );
}

export const EtScrollView = memo(EtScrollViewComponent);
EtScrollView.displayName = 'EtScrollView';
