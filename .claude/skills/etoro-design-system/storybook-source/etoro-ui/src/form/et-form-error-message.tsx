import { createContext, ReactNode, useContext, useMemo, useRef } from 'react';
import type { FieldError } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../core/hooks';
import { HALF, X1 } from '../core/styles/spacing';
import { EtText } from '../foundations/text/et-text';
import type { FieldErrorEntry } from './types';

interface EtFormErrorMessageContextValue {
  errors: FieldErrorEntry[];
}

const EtFormErrorMessageContext = createContext<EtFormErrorMessageContextValue | null>(null);

function useEtFormErrorMessageContext() {
  const ctx = useContext(EtFormErrorMessageContext);
  if (!ctx) {
    throw new Error('EtFormErrorMessage sub-components must be used within <EtFormErrorMessage>');
  }
  return ctx;
}

interface EtFormErrorMessageRootProps {
  /**
   * Field names (or dot-notation paths) whose errors are aggregated.
   * e.g. ['email', 'address.city']
   */
  names: string[];
  children: ReactNode;
}

/**
 * EtFormErrorMessage.Root — groups multiple form fields under a shared error display.
 *
 * Reads errors from RHF's FormProvider context for the listed field names.
 * Requires `<FormProvider>` as an ancestor.
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <EtFormErrorMessage names={['checkbox', 'radio']}>
 *     <EtFormCheckbox name="checkbox" control={control}>
 *       <EtFormCheckbox.Control>...</EtFormCheckbox.Control>
 *     </EtFormCheckbox>
 *     <EtFormRadioGroup name="radio" control={control}>
 *       <EtFormRadioGroup.Control>...</EtFormRadioGroup.Control>
 *     </EtFormRadioGroup>
 *     <EtFormErrorMessage.Text mode="first" />
 *   </EtFormErrorMessage>
 * </FormProvider>
 * ```
 */
function EtFormErrorMessageRoot({ names, children }: EtFormErrorMessageRootProps) {
  const { formState } = useFormContext();

  // Stabilise the names reference: only update when array contents actually change.
  const stableNamesRef = useRef<string[]>(names);
  const prev = stableNamesRef.current;
  if (prev.length !== names.length || names.some((n, i) => n !== prev[i])) {
    stableNamesRef.current = names;
  }

  // RHF mutates formState.errors in-place (same object reference across renders),
  // so object identity cannot be used as a memo dep. Encode relevant error state
  // into a string; the memo derives FieldErrorEntry[] directly from that string,
  // so errorsKey is both the dep and the data source — no extra ref needed.
  const errorsKey = stableNamesRef.current
    .map((name) => {
      const parts = name.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = formState.errors;
      for (const part of parts) {
        node = node?.[part];
        if (!node) break;
      }
      const fieldError = node as FieldError | undefined;
      return `${name}:${fieldError?.message ?? ''}:${fieldError?.type ?? ''}`;
    })
    .join('\x00');

  // Parse errors directly from errorsKey so the dep array is complete and correct.
  // Format per entry: "name:message:type" joined by \x00.
  const errors = useMemo<FieldErrorEntry[]>(
    () =>
      errorsKey.split('\x00').reduce<FieldErrorEntry[]>((acc, keyPart) => {
        const firstColon = keyPart.indexOf(':');
        const lastColon = keyPart.lastIndexOf(':');
        if (firstColon === -1 || firstColon === lastColon) return acc;
        const name = keyPart.slice(0, firstColon);
        const message = keyPart.slice(firstColon + 1, lastColon);
        const type = keyPart.slice(lastColon + 1);
        if (message) {
          acc.push({ name, message, type: type || 'unknown' });
        }
        return acc;
      }, []),
    [errorsKey],
  );

  const contextValue = useMemo(() => ({ errors }), [errors]);

  return <EtFormErrorMessageContext.Provider value={contextValue}>{children}</EtFormErrorMessageContext.Provider>;
}

interface EtFormErrorMessageTextProps {
  /** 'first' shows only the first error. 'all' shows all errors stacked. Default: 'first'. */
  mode?: 'first' | 'all';
  render?: (props: { errors: FieldErrorEntry[] }) => ReactNode;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * EtFormErrorMessage.Text — renders the aggregated error text for the group.
 * Returns null when no errors exist. Place anywhere within the EtFormErrorMessage boundary.
 */
function EtFormErrorMessageText({ mode = 'first', render, style, containerStyle, testID }: EtFormErrorMessageTextProps) {
  const { errors } = useEtFormErrorMessageContext();
  const { colors } = useEtoroTheme();

  if (!errors.length) return null;

  if (render) {
    return render({ errors });
  }

  const visibleErrors = mode === 'first' ? errors.slice(0, 1) : errors;

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {visibleErrors.map((entry) => (
        <EtText key={entry.name} variant="body-tiny-regular" style={[{ color: colors.statusNegative }, styles.errorText, style]}>
          {entry.message}
        </EtText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: X1 },
  errorText: { marginBottom: HALF },
});

export const EtFormErrorMessage = Object.assign(EtFormErrorMessageRoot, {
  Text: EtFormErrorMessageText,
});
