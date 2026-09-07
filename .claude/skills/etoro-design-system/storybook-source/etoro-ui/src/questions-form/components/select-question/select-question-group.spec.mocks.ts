/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#FFFFFF',
      textBrandPrimary: '#00D395',
      textBright: '#FFFFFF',
      bgGreyTertiary: '#333333',
    },
  }),
}));

jest.mock('../../../foundations/text/et-text', () => {
  const React = jest.requireActual('react');
  const { Text } = jest.requireActual('react-native');
  return {
    EtText: function MockEtText({ children, ...rest }: { children?: React.ReactNode }) {
      return React.createElement(Text, rest, children);
    },
  };
});

jest.mock('../../../components/et-icon-v2', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  return {
    EtIconV2: function MockEtIconV2({ name, testID }: { name: string; testID?: string }) {
      return React.createElement(View, {
        testID: testID ?? `icon-${name}`,
        accessibilityLabel: `icon-${name}`,
      });
    },
  };
});

jest.mock('expo-image', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  return {
    Image: function MockImage({ testID, ...rest }: { source?: { uri?: string }; testID?: string }) {
      return React.createElement(View, { testID: testID ?? 'mock-image', ...rest });
    },
  };
});

jest.mock('../question-message-box', () => ({
  QuestionMessageBox: function MockQuestionMessageBox() {
    return null;
  },
}));

jest.mock('../autocomplete-question', () => ({
  AutocompleteQuestion: function MockAutocompleteQuestion() {
    return null;
  },
}));

jest.mock('../../../components/input/input-v2/et-input', () => {
  const React = jest.requireActual('react');
  const { View, Text, TextInput } = jest.requireActual('react-native');

  const InputContext = React.createContext(null);

  function EtInputRoot({ defaultValue, children }: any) {
    const [value, setValue] = React.useState(typeof defaultValue === 'string' ? defaultValue : '');
    return React.createElement(InputContext.Provider, { value: { value, setValue } }, React.createElement(View, null, children));
  }

  function EtInputLabel({ children }: any) {
    return React.createElement(Text, null, children);
  }

  function EtInputField({ onChangeText, ...props }: any) {
    const ctx = React.useContext(InputContext);
    return React.createElement(TextInput, {
      testID: 'input-field',
      ...props,
      value: ctx?.value ?? '',
      onChangeText: (text: string) => {
        ctx?.setValue(text);
        onChangeText?.(text);
      },
    });
  }

  const EtInput = Object.assign(EtInputRoot, { Label: EtInputLabel, Field: EtInputField });

  return { EtInput };
});

jest.mock('../../../components/controls/toggle-switch', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  return {
    EtToggleSwitch: function MockEtToggleSwitch({ value, testID }: { value?: boolean; testID?: string }) {
      return React.createElement(View, { testID: testID ?? 'mock-toggle-switch', accessibilityState: { checked: value } });
    },
  };
});

jest.mock('../../../components/controls/chips-group-v2', () => {
  const React = jest.requireActual('react');
  const { View, Text, Pressable } = jest.requireActual('react-native');

  function EtChipsGroupV2Base({ items, selectionMode, value, onChange, testID }: any) {
    const selectedIds = new Set(selectionMode === 'single' ? (value ? [value] : []) : selectionMode === 'multi' ? (value ?? []) : []);

    const handleSelect = (id: string) => {
      if (selectionMode === 'none' || !onChange) return;
      if (selectionMode === 'single') {
        onChange(selectedIds.has(id) ? null : id);
      } else {
        const current = (value ?? []) as string[];
        onChange(selectedIds.has(id) ? current.filter((v: string) => v !== id) : [...current, id]);
      }
    };

    return React.createElement(
      View,
      { testID },
      ...(items ?? []).map((item: any) =>
        React.createElement(
          Pressable,
          {
            key: item.id,
            onPress: () => handleSelect(item.id),
            accessibilityRole: 'checkbox',
            accessibilityState: { checked: selectedIds.has(item.id) },
          },
          React.createElement(Text, null, item.label),
        ),
      ),
    );
  }

  return { EtChipsGroupV2: React.memo(EtChipsGroupV2Base) };
});

jest.mock('../../../foundations/icon-assets', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  return {
    EtoroIcon: function MockEtoroIcon({ icon }: any) {
      return React.createElement(View, { testID: `etoro-icon-${icon?.iconName}` });
    },
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

jest.mock('../../../components/controls/selection-tile-group/subcomponents/selection-tile-option', () => {
  const React = jest.requireActual('react');
  const { Pressable: RNPressable, Text: RNText, View: RNView } = jest.requireActual('react-native');
  const { useSelectionTileGroupContext } = jest.requireActual(
    '../../../components/controls/selection-tile-group/context/selection-tile-group-context',
  );

  function MockSelectionTileOption({ value, children, subtitle, disabled, testID, accessibilityLabel }: Record<string, unknown>) {
    const { value: selectedValue, onSelect, disabled: groupDisabled, variant } = useSelectionTileGroupContext();
    const isSelected = Array.isArray(selectedValue) ? selectedValue.includes(value as string) : selectedValue === value;
    const isDisabled = groupDisabled || disabled;

    const handlePress = () => {
      if (isDisabled) return;
      if (isSelected && variant !== 'toggle' && variant !== 'toggleInput') return;
      onSelect(value);
    };

    return React.createElement(
      RNPressable,
      {
        onPress: handlePress,
        disabled: isDisabled,
        testID,
        accessibilityRole: 'radio',
        accessibilityLabel: accessibilityLabel || children,
        accessibilityState: { selected: isSelected, disabled: !!isDisabled },
      },
      React.createElement(RNView, null, React.createElement(RNText, null, children), subtitle ? React.createElement(RNText, null, subtitle) : null),
    );
  }

  return { SelectionTileOption: MockSelectionTileOption };
});

jest.mock('react-native-reanimated', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  const AnimatedView = React.forwardRef(function AnimatedViewInner(props: unknown, ref: unknown) {
    return React.createElement(View, { ...(props as object), ref });
  });
  AnimatedView.displayName = 'Animated.View';
  const noop = () => ({});
  const createSharedValue = (initial: unknown) => ({
    value: initial,
    get() {
      return this.value;
    },
    set(next: any) {
      this.value = typeof next === 'function' ? next(this.value) : next;
    },
  });
  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: createSharedValue,
    useAnimatedStyle: (fn: () => unknown) => fn(),
    withTiming: (v: unknown) => v,
    interpolate: () => 0,
    interpolateColor: () => 'transparent',
    Easing: {
      bezier: () => noop,
      out: (easing: (t: number) => number) => easing,
      cubic: (t: number) => t * t * (3 - 2 * t),
    },
    FadeIn: { duration: () => ({}) },
    FadeOut: { duration: () => ({}) },
    FadeInUp: { delay: () => ({ duration: () => ({}) }), duration: () => ({}) },
    FadeOutDown: { duration: () => ({}) },
  };
});

jest.mock('../../../form', () => {
  const React = jest.requireActual('react');
  const { useController } = jest.requireActual('react-hook-form');
  const { View: RNView, TextInput: RNTextInput, Pressable: RNPressable, Text: RNText } = jest.requireActual('react-native');

  const FieldContext = React.createContext(null);

  function EtFormInputRoot({ name, control, rules, children }: any) {
    const { field } = useController({ name, control, rules });
    return React.createElement(FieldContext.Provider, { value: field }, children);
  }
  EtFormInputRoot.displayName = 'EtFormInput.Root';

  function EtFormInputControl({ readonly, style, children }: any) {
    const field = React.useContext(FieldContext);
    const fieldChild = React.Children.toArray(children).find((c: any) => c?.type?.displayName === 'EtFormInput.Field');
    const fieldProps = (fieldChild as any)?.props ?? {};
    const editable = fieldProps.editable ?? !readonly;
    return React.createElement(
      RNView,
      { testID: 'input-control', style },
      React.createElement(RNTextInput, {
        testID: 'input-field',
        value: field?.value ?? '',
        onChangeText: field?.onChange,
        onBlur: field?.onBlur,
        placeholder: fieldProps.placeholder,
        multiline: fieldProps.multiline,
        keyboardType: fieldProps.keyboardType,
        editable,
      }),
    );
  }
  EtFormInputControl.displayName = 'EtFormInput.Control';

  function EtFormInputField(props: any) {
    return React.createElement(RNTextInput, props);
  }
  EtFormInputField.displayName = 'EtFormInput.Field';

  function EtFormInputErrorMessage() {
    return null;
  }
  EtFormInputErrorMessage.displayName = 'EtFormInput.ErrorMessage';

  const EtFormInput = Object.assign(EtFormInputRoot, {
    Control: EtFormInputControl,
    Field: EtFormInputField,
    ErrorMessage: EtFormInputErrorMessage,
  });

  const RadioGroupContext = React.createContext(null);

  function EtFormRadioGroupRoot({ name, control, rules, children }: any) {
    const { field, fieldState } = useController({ name, control, rules });
    return React.createElement(RadioGroupContext.Provider, { value: { field, error: fieldState.error } }, children);
  }

  function EtFormRadioGroupControl({ children, disabled }: any) {
    return React.createElement(
      RNView,
      { testID: 'radio-group-control', accessibilityRole: 'radiogroup', pointerEvents: disabled ? 'none' : 'auto' },
      children,
    );
  }

  function EtFormRadioGroupOption({ value, children, disabled }: any) {
    const ctx = React.useContext(RadioGroupContext);
    const isSelected = ctx?.field?.value === value;
    const handlePress = () => {
      if (!disabled && ctx?.field?.onChange) ctx.field.onChange(value);
    };
    return React.createElement(
      RNPressable,
      { onPress: handlePress, disabled, accessibilityRole: 'radio', accessibilityState: { selected: isSelected, disabled: !!disabled } },
      React.createElement(RNText, null, children),
    );
  }

  function EtFormRadioGroupErrorMessage() {
    return null;
  }

  const EtFormRadioGroup = Object.assign(EtFormRadioGroupRoot, {
    Control: EtFormRadioGroupControl,
    Option: EtFormRadioGroupOption,
    ErrorMessage: EtFormRadioGroupErrorMessage,
  });

  const EtFormRadioContext = React.createContext(null);

  function EtFormRadioRoot({ name, control, rules, children }: any) {
    const { field, fieldState } = useController({ name, control, rules });
    const selected = Boolean(field.value);
    return React.createElement(EtFormRadioContext.Provider, { value: { selected, error: fieldState.error } }, children);
  }

  function EtFormRadioControl({ disabled }: any) {
    const ctx = React.useContext(EtFormRadioContext);
    return React.createElement(RNView, {
      testID: 'radio-indicator',
      accessibilityLabel: 'radio-indicator',
      accessibilityState: { selected: ctx?.selected, disabled: !!disabled },
    });
  }

  const EtFormRadio = Object.assign(EtFormRadioRoot, {
    Control: EtFormRadioControl,
    ErrorMessage: function MockRadioErrorMessage() {
      return null;
    },
  });

  const EtFormToggleSwitchContext = React.createContext(null);

  function EtFormToggleSwitchRoot({ name, control, rules, children }: any) {
    const { field, fieldState } = useController({ name, control, rules });
    const value = Boolean(field.value);
    return React.createElement(EtFormToggleSwitchContext.Provider, { value: { value, error: fieldState.error } }, children);
  }

  function EtFormToggleSwitchControl({ disabled }: any) {
    const ctx = React.useContext(EtFormToggleSwitchContext);
    return React.createElement(RNView, {
      testID: 'toggle-switch',
      accessibilityLabel: 'toggle-switch',
      accessibilityState: { checked: ctx?.value, disabled: !!disabled },
    });
  }

  const EtFormToggleSwitch = Object.assign(EtFormToggleSwitchRoot, {
    Control: EtFormToggleSwitchControl,
    ErrorMessage: function MockToggleSwitchErrorMessage() {
      return null;
    },
  });

  const ChipGroupContext = React.createContext(null);

  function EtFormChipGroupRoot({ name, control, rules, children }: any) {
    const { field, fieldState } = useController({ name, control, rules });
    const raw = field.value;
    const value = Array.isArray(raw) ? raw : raw != null && raw !== '' ? [String(raw)] : [];

    const replace = (values: string[]) => field.onChange(values.length ? values : null);

    return React.createElement(ChipGroupContext.Provider, { value: { replace, value, error: fieldState.error } }, children);
  }

  function EtFormChipGroupControl({ items, disabled }: any) {
    const ctx = React.useContext(ChipGroupContext);
    const chips = (items ?? []).map((item: any) => {
      const isSelected = ctx?.value?.includes(item.id);
      const handlePress = () => {
        if (disabled || !ctx) return;
        const next = isSelected ? ctx.value.filter((v: string) => v !== item.id) : [...ctx.value, item.id];
        ctx.replace(next);
      };
      return React.createElement(
        RNPressable,
        { key: item.id, onPress: handlePress, disabled, accessibilityRole: 'checkbox', accessibilityState: { checked: isSelected } },
        React.createElement(RNText, null, item.label),
      );
    });
    return React.createElement(RNView, { testID: 'chip-group-control', pointerEvents: disabled ? 'none' : 'auto' }, ...chips);
  }

  const EtFormChipGroup = Object.assign(EtFormChipGroupRoot, {
    Control: EtFormChipGroupControl,
    ErrorMessage: function MockChipGroupErrorMessage() {
      return null;
    },
  });

  const useEtFormChipGroupContext = () => React.useContext(ChipGroupContext);

  const ToggleSwitchGroupContext = React.createContext(null);

  function EtFormToggleSwitchGroupRoot({ name, control, rules, children }: any) {
    const { field, fieldState } = useController({ name, control, rules });
    const raw = field.value;
    const value = Array.isArray(raw) ? raw : raw != null && raw !== '' ? [String(raw)] : [];

    const toggle = (optionValue: string) => {
      const next = value.includes(optionValue) ? value.filter((v: string) => v !== optionValue) : [...value, optionValue];
      field.onChange(next.length ? next : null);
    };
    const replace = (values: string[]) => field.onChange(values.length ? values : null);

    return React.createElement(ToggleSwitchGroupContext.Provider, { value: { toggle, replace, value, error: fieldState.error } }, children);
  }

  function EtFormToggleSwitchGroupControl({ children, disabled }: any) {
    return React.createElement(RNView, { testID: 'toggle-group-control', pointerEvents: disabled ? 'none' : 'auto' }, children);
  }

  function EtFormToggleSwitchGroupOption({ value, children, disabled, onPress: customOnPress }: any) {
    const ctx = React.useContext(ToggleSwitchGroupContext);
    const isSelected = ctx?.value?.includes(value);
    const handlePress = () => {
      if (disabled) return;
      customOnPress ? customOnPress() : ctx?.toggle(value);
    };
    return React.createElement(
      RNPressable,
      { onPress: handlePress, disabled, accessibilityRole: 'checkbox', accessibilityState: { checked: isSelected } },
      React.createElement(RNText, null, children),
    );
  }

  const EtFormToggleSwitchGroup = Object.assign(EtFormToggleSwitchGroupRoot, {
    Control: EtFormToggleSwitchGroupControl,
    Option: EtFormToggleSwitchGroupOption,
    ErrorMessage: function MockToggleSwitchGroupErrorMessage() {
      return null;
    },
  });

  const useEtFormToggleSwitchGroupContext = () => React.useContext(ToggleSwitchGroupContext);

  function FormField({ name, control, rules, children }: any) {
    const {
      field,
      fieldState: { error },
    } = useController({ name, control, rules });

    return children(
      {
        value: field.value,
        onChange: field.onChange,
        onBlur: field.onBlur,
        disabled: !!field.disabled,
      },
      error,
    );
  }

  return {
    FormField,
    EtFormInput,
    EtFormRadio,
    EtFormRadioGroup,
    EtFormChipGroup,
    useEtFormChipGroupContext,
    EtFormToggleSwitch,
    EtFormToggleSwitchGroup,
    useEtFormToggleSwitchGroupContext,
  };
});
