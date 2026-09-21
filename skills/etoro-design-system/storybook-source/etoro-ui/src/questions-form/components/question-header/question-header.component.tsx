import { Image } from 'expo-image';
import { View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text/et-text';
import { useResolveText } from '../../contexts';
import { createStyles } from './question-header.styles';

/**
 * Props for the QuestionHeader component.
 * All props are optional; the component returns null if none are provided.
 */
export interface QuestionHeaderProps {
  /** Main description text */
  text?: string;
  /** Secondary/subtitle text */
  subText?: string;
  /** Image URI to display */
  img?: string;
  /** Title heading */
  title?: string;
}

/**
 * Renders optional title, description text, and image.
 * Display strings are resolved with `useResolveText()` (i18n keys when `QuestionsFormTextProvider` is used).
 * Returns null if no props are provided.
 */
export function QuestionHeader({ text, subText, img, title }: QuestionHeaderProps) {
  const resolveText = useResolveText();
  const { colors } = useEtoroTheme();
  const styles = createStyles(colors);
  const hasContent = Boolean(text ?? subText ?? img ?? title);
  if (!hasContent) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title ? (
        <EtText variant="heading-base" style={styles.title}>
          {resolveText(title)}
        </EtText>
      ) : null}
      {img ? <Image source={{ uri: img }} style={styles.image} contentFit="cover" /> : null}
      {text ? (
        <EtText variant="body-base-regular" style={{ color: colors.textPrimaryNeutral }}>
          {resolveText(text)}
        </EtText>
      ) : null}
      {subText ? (
        <EtText variant="body-base-regular" style={[styles.subText, { color: colors.textPrimaryNeutral }]}>
          {resolveText(subText)}
        </EtText>
      ) : null}
    </View>
  );
}
