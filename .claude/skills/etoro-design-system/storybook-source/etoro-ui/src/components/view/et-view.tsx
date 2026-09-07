import { memo } from 'react';
import { View } from 'react-native';

import { EtViewProps } from './api/types';
import { LoadableContent } from './loadable-content';

/**
 * `EtView` — a plain React Native `View` that can optionally show a loading
 * skeleton.
 *
 * Without a `skeleton` prop it is exactly a `View` (zero loading overhead — no
 * extra hooks run). Pass a `skeleton` to make it loading-aware: while `loading`
 * is `true` the skeleton is shown, and when it flips `false` the skeleton
 * dissolves to reveal the children (no hard cut). Content is always the children.
 *
 * Prefer placing `EtView` INSIDE a smart component so the component owns its own
 * loading visual and parents stay clean:
 *
 * ```tsx
 * function BalanceGraph({ loading, ... }: BalanceGraphProps) {
 *   return (
 *     <EtView loading={loading} skeleton={<ChartSkeleton />} style={styles.container}>
 *       <EtLineChart ... />
 *     </EtView>
 *   );
 * }
 * ```
 *
 * NOTE: this is NOT a screen container. `EtScreen` remains the screen root;
 * `EtView` is a content/region container.
 */
function EtViewComponent({ loading = false, skeleton, fill, duration, skeletonBackground, children, ...viewProps }: EtViewProps) {
  if (skeleton == null) {
    return <View {...viewProps}>{children}</View>;
  }

  return (
    <View {...viewProps}>
      <LoadableContent loading={loading} skeleton={skeleton} fill={fill} duration={duration} skeletonBackground={skeletonBackground}>
        {children}
      </LoadableContent>
    </View>
  );
}

export const EtView = memo(EtViewComponent);
EtView.displayName = 'EtView';
