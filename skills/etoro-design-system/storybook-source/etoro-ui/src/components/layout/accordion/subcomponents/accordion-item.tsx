import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X5 } from '../../../../core/styles/spacing';
import { EtAccordionItemProps } from '../api';
import { AccordionItemContext, AccordionItemContextValue, useAccordionContext } from '../context';

/**
 * EtAccordion.Item - Container for a single accordion item
 *
 * Contains EtAccordion.Header and EtAccordion.Content components.
 * Provides item-specific context to children.
 */
const AccordionItem = React.memo(function AccordionItem({ id, children, disabled = false, style, testID }: EtAccordionItemProps) {
  const { colors } = useEtoroTheme();
  const { expandedIds, toggleItem } = useAccordionContext();

  const isExpanded = expandedIds.includes(id);

  // Create item context value
  const contextValue = useMemo<AccordionItemContextValue>(
    () => ({
      id,
      isExpanded,
      disabled,
      toggle: () => {
        if (!disabled) {
          toggleItem(id);
        }
      },
    }),
    [id, isExpanded, disabled, toggleItem],
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <View style={[styles.container, style]} testID={testID}>
        {children}
        <View style={[styles.divider, { backgroundColor: colors.dividerSenary }]} />
      </View>
    </AccordionItemContext.Provider>
  );
});

AccordionItem.displayName = 'EtAccordion.Item';

export { AccordionItem };

const styles = StyleSheet.create({
  container: {
    paddingTop: X5, // Figma: pt-[20px] per Question item
    width: '100%',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
