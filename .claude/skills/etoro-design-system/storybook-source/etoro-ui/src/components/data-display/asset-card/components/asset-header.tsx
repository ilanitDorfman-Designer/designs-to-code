/* eslint-disable react-native/no-inline-styles */
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { eToroTheme } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text';
import { EtButton } from '../../../button/et-button';
import { EtIconButton } from '../../../button/et-icon-button';
import { AssetInfo } from '../api/types';

interface AssetHeaderProps {
  /** Asset information */
  asset: AssetInfo;
  /** Colors from theme */
  colors: eToroTheme['colors'];
  /** Display mode */
  compact?: boolean;
  minimal?: boolean;
  /** Close button */
  showCloseButton?: boolean;
  onClose?: () => void;
  /** Add button for minimal mode */
  showAddButton?: boolean;
  onAdd?: () => void;
  isAdded?: boolean;
  addButtonText?: string;
  addedButtonText?: string;
}

export function AssetHeader({
  asset,
  colors,
  compact = false,
  minimal = false,
  showCloseButton = false,
  onClose,
  showAddButton = false,
  onAdd,
  isAdded = false,
  addButtonText = 'Add',
  addedButtonText = 'Added',
}: AssetHeaderProps) {
  return (
    <View style={[styles.header, compact && styles.compactHeader, minimal && styles.minimalHeader]}>
      <View style={[styles.assetInfo, (compact || minimal) && styles.compactAssetInfo]}>
        <View style={styles.logoContainer}>
          <Image
            source={typeof asset.logo === 'string' ? { uri: asset.logo } : asset.logo}
            style={[styles.logo, compact && styles.compactLogo, minimal && styles.minimalLogo]}
          />
        </View>
        <View style={styles.assetDetails}>
          <EtText
            variant={compact ? 'heading-base' : 'body-base-semibold'}
            style={[{ color: colors.textPrimaryNeutral }, (compact || minimal) && { textAlign: 'center' }]}
          >
            {asset.symbol}
          </EtText>
          <EtText variant="body-tiny-regular" style={[{ color: colors.textPrimaryNeutral }, (compact || minimal) && { textAlign: 'center' }]}>
            {asset.name}
          </EtText>
        </View>
      </View>

      {showCloseButton && onClose && (
        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <EtIconButton iconName="close" size={10} onPress={onClose} />
        </Pressable>
      )}

      {showAddButton && minimal && (
        <View style={styles.addButtonContainer}>
          <EtButton variant={isAdded ? 'info-subtle' : 'primary-subtle'} size="small" onPress={onAdd}>
            <EtButton.Label>{isAdded ? addedButtonText : addButtonText}</EtButton.Label>
          </EtButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  compactHeader: {
    marginBottom: 12,
  },
  minimalHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  compactAssetInfo: {
    flexDirection: 'column',
    gap: 12,
  },
  logoContainer: {
    position: 'relative',
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 6,
  },
  compactLogo: {
    width: 35,
    height: 35,
    borderRadius: 6,
  },
  minimalLogo: {
    width: 35,
    height: 35,
    borderRadius: 6,
  },
  assetDetails: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    end: 0,
    zIndex: 1000,
  },
  addButtonContainer: {
    alignSelf: 'center',
  },
});
