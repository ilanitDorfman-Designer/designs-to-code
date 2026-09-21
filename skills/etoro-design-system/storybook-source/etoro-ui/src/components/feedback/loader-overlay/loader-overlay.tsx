import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { EtLoader } from '../../status/loader';

const BACKDROP_OPACITY = 0.4;

interface LoaderOverlayProps {
  visible: boolean;
}

function LoaderOverlayBase({ visible }: LoaderOverlayProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <EtLoader size="large" />
      </View>
    </Modal>
  );
}

LoaderOverlayBase.displayName = 'LoaderOverlay';

export const LoaderOverlay = React.memo(LoaderOverlayBase);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(0, 0, 0, ${BACKDROP_OPACITY})`,
  },
});
