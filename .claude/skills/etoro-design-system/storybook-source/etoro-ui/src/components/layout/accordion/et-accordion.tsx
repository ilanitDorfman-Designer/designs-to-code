import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X5, X7 } from '../../../core/styles/spacing';
import { EtAccordionProps } from './api';
import { AccordionContext, AccordionContextValue } from './context';
import { useAccordionState } from './hooks';
import { AccordionContent, AccordionHeader, AccordionItem } from './subcomponents';

/**
 * EtAccordion - A collapsible accordion component
 *
 * Uses compound component pattern for flexible composition.
 *
 * @example Basic usage
 * ```tsx
 * <EtAccordion>
 *   <EtAccordion.Item id="1">
 *     <EtAccordion.Header>
 *       <EtText variant="body-base-semibold">Question 1?</EtText>
 *     </EtAccordion.Header>
 *     <EtAccordion.Content>
 *       <EtText variant="body-base-regular">Answer to question 1.</EtText>
 *     </EtAccordion.Content>
 *   </EtAccordion.Item>
 * </EtAccordion>
 * ```
 *
 * @example Multiple items expanded
 * ```tsx
 * <EtAccordion allowMultiple defaultExpandedIds={['1', '2']}>
 *   <EtAccordion.Item id="1">...</EtAccordion.Item>
 *   <EtAccordion.Item id="2">...</EtAccordion.Item>
 * </EtAccordion>
 * ```
 *
 * @example Controlled accordion
 * ```tsx
 * const [expanded, setExpanded] = useState(['1']);
 *
 * <EtAccordion expandedIds={expanded} onExpandedChange={setExpanded}>
 *   <EtAccordion.Item id="1">...</EtAccordion.Item>
 * </EtAccordion>
 * ```
 */
function EtAccordionBase({
  children,
  allowMultiple = false,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedChange,
  style,
  testID,
}: EtAccordionProps) {
  // Get accordion state management
  const state = useAccordionState({
    allowMultiple,
    defaultExpandedIds,
    expandedIds: controlledExpandedIds,
    onExpandedChange,
  });

  // Create context value
  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      expandedIds: state.expandedIds,
      toggleItem: state.toggleItem,
      allowMultiple: state.allowMultiple,
    }),
    [state.expandedIds, state.toggleItem, state.allowMultiple],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <View style={[styles.container, style]} testID={testID}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

EtAccordionBase.displayName = 'EtAccordion';

/**
 * Export with compound components attached
 */
export const EtAccordion = Object.assign(React.memo(EtAccordionBase), {
  Item: AccordionItem,
  Header: AccordionHeader,
  Content: AccordionContent,
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X7,
    paddingVertical: X5,
    width: '100%',
  },
});
