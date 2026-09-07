import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { EtModalContentProps } from '../../api';
import { CONTENT_LOADING_MIN_HEIGHT, CONTENT_PADDING_HORIZONTAL, CONTENT_PADDING_VERTICAL } from '../../constants';
import { useModalState } from '../../context';

/**
 * EtModal.Content - Main content area for the modal
 *
 * Matches the API and styling of EtBottomSheetV2.Content.
 */
export function EtModalContent({ children, style, scrollable = false, loadingPlaceholder }: EtModalContentProps) {
  const { isLoading } = useModalState();

  if (isLoading) {
    return <View style={[styles.content, styles.loadingContainer, style]}>{loadingPlaceholder ?? <ActivityIndicator size="large" />}</View>;
  }

  if (scrollable) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, style]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.content, style]}>{children}</View>;
}

EtModalContent.displayName = 'EtModal.Content';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
    paddingVertical: CONTENT_PADDING_VERTICAL,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  loadingContainer: {
    minHeight: CONTENT_LOADING_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
