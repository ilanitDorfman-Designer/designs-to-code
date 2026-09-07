import { StyleSheet, View } from 'react-native';

import { eToroTheme } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text';
import { CategoryBadge } from '../api/types';

interface CategoryBadgesProps {
  /** Array of category badges to display */
  categories: CategoryBadge[];
  /** Colors from theme */
  colors: eToroTheme['colors'];
}

export function CategoryBadges({ categories, colors }: CategoryBadgesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <View style={styles.categoriesContainer}>
      {categories.map((category, index) => (
        <View
          key={index}
          style={[
            styles.categoryBadge,
            {
              backgroundColor: category.backgroundColor || colors.actionBrandText,
            },
          ]}
        >
          <EtText variant="body-tiny-medium" style={{ color: category.color || colors.actionBrandText }}>
            {category.label}
          </EtText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 16,
  },
});
