import { StyleSheet } from 'react-native';

import { X3, X6, X8 } from '../../../core/styles/spacing';

export const styles = StyleSheet.create({
  content: {
    marginTop: X3,
    gap: X8,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    marginTop: X6,
  },
  submitButtonWrap: {
    alignSelf: 'stretch',
  },
  messages: {
    paddingHorizontal: X6,
  },
});
