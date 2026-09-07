import { View } from 'react-native';

import { EtIconV2 } from '../../../components/et-icon-v2';
import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text/et-text';
import { useResolveNode } from '../../contexts/questions-form-text.context';
import type { QuestionMessage, QuestionMessageType } from '../../interfaces';
import { createStyles } from './question-message-box.styles';

/**
 * Props for the QuestionMessageBox component.
 */
export interface QuestionMessageBoxProps {
  /** The message to display (text, type, icon, border) */
  message: QuestionMessage;
  /** Centers only the message text when needed by the parent layout */
  centered?: boolean;
}

function getBorderColor(type: QuestionMessageType | undefined, colors: ReturnType<typeof useEtoroTheme>['colors']): string {
  const borderByType: Record<string, string> = {
    warning: colors.statusOrange,
    error: colors.statusNegative,
  };
  return borderByType[type ?? 'default'] ?? 'transparent';
}

function getContentColor(type: QuestionMessageType | undefined, showBorder: boolean, colors: ReturnType<typeof useEtoroTheme>['colors']): string {
  if (showBorder) {
    return colors.textPrimaryNeutral;
  }

  const colorByType: Record<string, string> = {
    warning: colors.statusOrange,
    error: colors.statusNegative,
  };

  return colorByType[type ?? 'default'] ?? colors.textPrimaryNeutral;
}

/**
 * Renders info/warning/error message box with type-based color, optional border and icon.
 */
export function QuestionMessageBox({ message, centered = false }: QuestionMessageBoxProps) {
  const { colors } = useEtoroTheme();
  const resolveNode = useResolveNode();
  const styles = createStyles(colors);
  const msgType = message?.type ?? 'default';
  const showBorder = message?.border === true;
  const borderColor = getBorderColor(msgType, colors);
  const textColor = getContentColor(msgType, showBorder, colors);
  const iconName = message?.icon;

  return (
    <View
      style={[
        styles.container,
        showBorder && styles.bordered,
        !showBorder && styles.containerNoPadH,
        { borderColor: showBorder ? borderColor : undefined },
      ]}
    >
      {iconName ? (
        <View style={styles.iconContainer}>
          <EtIconV2 name={iconName} size="sm" color={textColor} />
        </View>
      ) : null}
      <EtText
        variant="body-secondary-regular"
        style={[
          styles.messageText,
          { color: textColor },
          centered ? styles.messageTextCentered : undefined,
          iconName ? styles.messageTextWithIcon : undefined,
        ]}
      >
        {resolveNode(message?.message)}
      </EtText>
    </View>
  );
}
