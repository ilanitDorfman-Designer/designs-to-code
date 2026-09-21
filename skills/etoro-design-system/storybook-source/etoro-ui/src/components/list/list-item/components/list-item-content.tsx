import { StyleSheet, TextStyle, View } from 'react-native';

import { EtText } from '../../../../foundations/text';

interface ListItemContentProps {
  title: string;
  subtitle?: string;
  description?: string;
  disabled?: boolean;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export function ListItemContent({ title, subtitle, description, disabled, titleStyle, subtitleStyle, descriptionStyle }: ListItemContentProps) {
  return (
    <View style={styles.contentContainer}>
      <EtText variant="heading-compact" style={[styles.title, disabled && styles.disabledText, titleStyle]}>
        {title}
      </EtText>

      {subtitle && (
        <EtText variant="body-secondary-regular" style={[styles.subtitle, disabled && styles.disabledText, subtitleStyle]}>
          {subtitle}
        </EtText>
      )}

      {description && (
        <EtText variant="body-secondary-regular" style={[styles.description, disabled && styles.disabledText, descriptionStyle]}>
          {description}
        </EtText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    lineHeight: 20,
  },
  subtitle: {
    marginBottom: 2,
  },
  description: {
    marginTop: 2,
    lineHeight: 18,
  },
  disabledText: {
    // Opacity handled by parent container
  },
});
