import React, { Children, isValidElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonGroupItemProps, EtButtonGroupProps } from './api';
import { ButtonGroupProvider } from './context';
import { ButtonGroupItem } from './subcomponents';

const GAP = 2;

/**
 * EtButtonGroup - A horizontal group of icon buttons with pill-shaped ends
 *
 * Uses compound component pattern for flexible composition.
 *
 * @example
 * ```tsx
 * <EtButtonGroup>
 *   <EtButtonGroup.Item iconName="priceAlert" onPress={handlePriceAlert} />
 *   <EtButtonGroup.Item iconName="expand" onPress={handleExpand} />
 * </EtButtonGroup>
 * ```
 */
function EtButtonGroupRoot({ children, testID }: EtButtonGroupProps) {
  const validChildren = useMemo(() => {
    const childArray = Children.toArray(children);
    return childArray.filter((child): child is React.ReactElement<ButtonGroupItemProps> => {
      if (isValidElement(child) && child.type === ButtonGroupItem) {
        return true;
      }
      throw new Error('EtButtonGroup: Invalid child passed. Only <EtButtonGroup.Item> components are valid children.');
    });
  }, [children]);

  return (
    <View style={styles.container} testID={testID}>
      {validChildren.map((child, index) => {
        const key = child.key ?? `${child.props.iconName}-${index}`;
        return (
          <ButtonGroupProvider key={key} isFirst={index === 0} isLast={index === validChildren.length - 1}>
            {child}
          </ButtonGroupProvider>
        );
      })}
    </View>
  );
}

EtButtonGroupRoot.displayName = 'EtButtonGroup';

/**
 * Export with compound components attached
 */
export const EtButtonGroup = Object.assign(React.memo(EtButtonGroupRoot), {
  Item: ButtonGroupItem,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
  },
});
