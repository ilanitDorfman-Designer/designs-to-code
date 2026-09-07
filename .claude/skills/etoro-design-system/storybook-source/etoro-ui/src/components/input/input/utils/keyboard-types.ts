import { KeyboardTypeOptions } from 'react-native';

import { InputType } from '../api/types';

/**
 * Maps input type to appropriate keyboard type
 */
export function getKeyboardType(type: InputType): KeyboardTypeOptions {
  switch (type) {
    case 'email':
      return 'email-address';
    case 'number':
      return 'numeric';
    case 'phone':
      return 'phone-pad';
    default:
      return 'default';
  }
}
