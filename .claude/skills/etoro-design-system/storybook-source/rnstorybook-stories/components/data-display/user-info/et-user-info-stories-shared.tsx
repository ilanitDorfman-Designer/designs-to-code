import { ThemeProvider } from '@react-navigation/core';
import type { Meta } from '@storybook/react-native';
import { EtUserInfo } from 'etoro-ui';
import { eToroLightColors } from 'etoro-ui/core/styles';
import { StyleSheet, View } from 'react-native';

export const AVATAR_URI = 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg';
export const LONG_TITLE = 'Jane Doe – Professional Investor and Strategy Consultant';
export const LONG_SUBTITLE = '@janedoe · Germany · 38K copiers';

export const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  showcase: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: eToroLightColors.colors.textPrimaryNeutral,
    marginTop: 24,
    marginBottom: 12,
  },
  ellipsizeRow: {
    maxWidth: 320,
    backgroundColor: eToroLightColors.colors.bgNeutralGreyPrimary,
  },
  rowBackground: {
    backgroundColor: eToroLightColors.colors.bgNeutralGreyPrimary,
  },
  avatarBackground: {
    backgroundColor: eToroLightColors.colors.bgNeutralGreySecondary,
  },
  title: {
    color: eToroLightColors.colors.textPrimaryNeutral,
  },
});

const BASE_TITLE = 'eToro-UI/Components/DataDisplay/EtUserInfo';

export function createMeta(subfolderName: string): Meta<typeof EtUserInfo> {
  const title = `${BASE_TITLE}/${subfolderName}`;

  return {
    title,
    component: EtUserInfo,
    parameters: {
      notes:
        'Composable user identity row: avatar (square), title, subtitle. Use for user lists and profile previews in horizontal or vertical layout.',
    },
    decorators: [
      (Story) => (
        <ThemeProvider value={eToroLightColors}>
          <View style={styles.decorator}>
            <Story />
          </View>
        </ThemeProvider>
      ),
    ],
  };
}
