import { ThemeProvider } from '@react-navigation/core';
import type { Meta } from '@storybook/react-native';
import { EtAssetInfo } from 'etoro-ui';
import { eToroLightColors } from 'etoro-ui/core/styles';
import { StyleSheet, View } from 'react-native';

export const AVATAR_URI = 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg';
export const LONG_TITLE = 'Apple Inc. – Consumer Electronics and Software Conglomerate';
export const LONG_SUBTITLE = 'NASDAQ: AAPL · Cupertino, California · Technology sector';

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

const BASE_TITLE = 'eToro-UI/Components/DataDisplay/EtAssetInfo';

export function createMeta(subfolderName: string): Meta<typeof EtAssetInfo> {
  const title = `${BASE_TITLE}/${subfolderName}`;

  return {
    title,
    component: EtAssetInfo,
    parameters: {
      notes: 'Composable asset/avatar row: image, title, subtitle. Use for Avatar list and Asset list in horizontal or vertical layout.',
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
