import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ListItemRightElementProps {
  element: React.ReactNode;
  disabled?: boolean;
}

export function ListItemRightElement({ element, disabled }: ListItemRightElementProps) {
  return <View style={[styles.rightElement, disabled && styles.disabledIcon]}>{element}</View>;
}

const styles = StyleSheet.create({
  rightElement: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  disabledIcon: {
    opacity: 0.4,
  },
});
