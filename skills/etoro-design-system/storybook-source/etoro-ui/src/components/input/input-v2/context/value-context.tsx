import { createContext, useContext } from 'react';

interface InputValueContextValue {
  currentValue: string;
  setValue: (value: string) => void;
}

export const InputValueContext = createContext<InputValueContextValue | null>(null);

/**
 * Access current value state (currentValue, setValue)
 * This is the "hot path" - changes on every keystroke.
 * Only use this when you actually need the current value.
 */
export function useInputValue() {
  const context = useContext(InputValueContext);
  if (!context) {
    throw new Error('Input components must be used within <Input>');
  }
  return context;
}
