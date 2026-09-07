import type { Meta, StoryObj } from '@storybook/react-native';
import { EtInput } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Code Block Component for displaying copyable code
const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = (code: string) => {
    Clipboard.setStringAsync(code);
    Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
  };

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={styles.codeHeader}>
          <Text style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
          <Pressable onPress={() => handleCopy(code)} style={styles.copyButton}>
            <Text style={[styles.copyButtonText, { color: colors.actionBrandText }]}>Copy</Text>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const IntroContent = () => {
  const { colors } = useEtoroTheme();
  const [basicValue, setBasicValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <ScrollView style={[styles.container]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>EtInput Component</Text>

      <Text style={[styles.description, { color: colors.textPrimaryNeutral }]}>
        The EtInput component is a modern, compositional input field built with a compound component pattern. It provides flexible composition with
        subcomponents for labels, fields, suffixes, and helper text, supporting various input types, states, and validation.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>✨ Features</Text>
      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Compound Component API: Flexible composition with subcomponents</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• 5 Input Types: text, password, email, number, phone</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Multiple States: normal, error, disabled, readonly</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • Adornment Support: Text and icon adornments with counter combinations
        </Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Character Counter: Built-in character counting with maxLength</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Password Toggle: Automatic visibility toggle for password inputs</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Floating Label: Animated label that floats when input has value</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Uncontrolled Mode: Uses defaultValue for better performance</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🎨 Basic Usage</Text>
      <View style={styles.exampleContainer}>
        <EtInput defaultValue={basicValue}>
          <EtInput.Label>Name</EtInput.Label>
          <EtInput.Field onChangeText={setBasicValue} placeholder="Enter your name" />
        </EtInput>
        <EtInput type="email" defaultValue={emailValue}>
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field onChangeText={setEmailValue} placeholder="Enter your email" />
        </EtInput>
        <EtInput type="password" defaultValue={passwordValue}>
          <EtInput.Label>Password</EtInput.Label>
          <EtInput.Field onChangeText={setPasswordValue} placeholder="Enter your password" />
        </EtInput>
      </View>

      <CodeBlock
        title="Basic Usage Code"
        code={`import { EtInput } from 'etoro-ui';
import { useState } from 'react';

const MyForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      {/* Basic text input */}
      <EtInput defaultValue={name}>
        <EtInput.Label>Name</EtInput.Label>
        <EtInput.Field
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </EtInput>

      {/* Email input */}
      <EtInput type="email" defaultValue={email}>
        <EtInput.Label>Email</EtInput.Label>
        <EtInput.Field
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
      </EtInput>

      {/* Password input (auto-toggle included) */}
      <EtInput type="password" defaultValue={password}>
        <EtInput.Label>Password</EtInput.Label>
        <EtInput.Field
          onChangeText={setPassword}
          placeholder="Enter your password"
        />
      </EtInput>
    </View>
  );
};`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🔴 Error States & Validation</Text>
      <View style={styles.exampleContainer}>
        <EtInput type="email" error="Please enter a valid email address" defaultValue="invalid@email">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field />
        </EtInput>
        <EtInput type="password" error="Password must be at least 8 characters" defaultValue="short">
          <EtInput.Label>Password</EtInput.Label>
          <EtInput.Field />
        </EtInput>
      </View>

      <CodeBlock
        title="Error States Code"
        code={`// Input with error state
<EtInput
  type="email"
  error="Please enter a valid email address"
  defaultValue="invalid@email"
>
  <EtInput.Label>Email</EtInput.Label>
  <EtInput.Field />
</EtInput>

// Dynamic error validation
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState<string | null>(null);

const validateEmail = (value: string) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(value)) {
    setEmailError('Please enter a valid email address');
  } else {
    setEmailError(null);
  }
};

<EtInput
  type="email"
  error={emailError}
  defaultValue={email}
>
  <EtInput.Label>Email</EtInput.Label>
  <EtInput.Field
    onChangeText={(text) => {
      setEmail(text);
      validateEmail(text);
    }}
  />
</EtInput>

// Note: Helper text is automatically rendered when error prop is provided`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🎯 Adornment & Counter Examples</Text>
      <View style={styles.exampleContainer}>
        <EtInput type="number" maxLength={10} showCharCounter defaultValue="">
          <EtInput.Label>Amount</EtInput.Label>
          <EtInput.Field placeholder="0.00" />
          <EtInput.TextAdornment>USD</EtInput.TextAdornment>
        </EtInput>
        <EtInput defaultValue="">
          <EtInput.Label>Search</EtInput.Label>
          <EtInput.Field placeholder="Search..." />
          <EtInput.IconAdornment iconName="search" />
        </EtInput>
      </View>

      <CodeBlock
        title="Adornment & Counter Code"
        code={`// Text adornment with character counter
<EtInput type="number" maxLength={10} showCharCounter defaultValue={amount}>
  <EtInput.Label>Amount</EtInput.Label>
  <EtInput.Field
    onChangeText={setAmount}
    placeholder="0.00"
  />
  <EtInput.TextAdornment>USD</EtInput.TextAdornment>
</EtInput>

// Icon adornment
<EtInput defaultValue={search}>
  <EtInput.Label>Search</EtInput.Label>
  <EtInput.Field
    onChangeText={setSearch}
    placeholder="Search..."
  />
  <EtInput.IconAdornment iconName="search" />
</EtInput>

// Character counter only
<EtInput maxLength={50} showCharCounter defaultValue={bio}>
  <EtInput.Label>Bio</EtInput.Label>
  <EtInput.Field
    onChangeText={setBio}
    placeholder="Tell us about yourself..."
  />
</EtInput>`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🚫 Disabled & Readonly States</Text>
      <View style={styles.exampleContainer}>
        <EtInput type="text" disabled defaultValue="Disabled value">
          <EtInput.Label>Disabled Field</EtInput.Label>
          <EtInput.Field />
        </EtInput>
        <EtInput type="email" readonly defaultValue="readonly@example.com">
          <EtInput.Label>Read-only Field</EtInput.Label>
          <EtInput.Field />
        </EtInput>
      </View>

      <CodeBlock
        title="Disabled & Readonly Code"
        code={`// Disabled input
<EtInput type="text" disabled defaultValue="Disabled value">
  <EtInput.Label>Account ID</EtInput.Label>
  <EtInput.Field />
</EtInput>

// Read-only input
<EtInput type="email" readonly defaultValue="user@example.com">
  <EtInput.Label>Email (Read only)</EtInput.Label>
  <EtInput.Field />
</EtInput>`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>📝 Component API</Text>
      <CodeBlock
        title="Component Structure"
        code={`// Main component (context provider)
<EtInput
  type?: 'text' | 'password' | 'email' | 'number' | 'phone'
  defaultValue?: string
  error?: string | null
  disabled?: boolean
  readonly?: boolean
  maxLength?: number
  showCharCounter?: boolean
>
  {/* Required subcomponents */}
  <EtInput.Label required?: boolean>Label Text</EtInput.Label>
  <EtInput.Field
    placeholder?: string
    onChangeText?: (text: string) => void
    // ... other TextInput props
  />
  
  {/* Optional subcomponents */}
  <EtInput.TextAdornment>Suffix</EtInput.TextAdornment>
  <EtInput.IconAdornment iconName="search" />
</EtInput>

// Important Notes:
// - defaultValue is set on EtInput root, not on Field
// - Password toggle is automatically rendered when type="password"
// - Helper text is automatically rendered when error exists or showCharCounter is true
// - Component only supports uncontrolled mode (defaultValue)
// - error prop takes precedence over showCharCounter`}
      />

      <Text
        style={[
          styles.usage,
          {
            color: colors.textPrimaryNeutral,
            backgroundColor: colors.bgNeutralPrimary,
          },
        ]}
      >
        💡 Tip: Explore the other stories to see all input types, states, and composition examples in action!
      </Text>
    </ScrollView>
  );
};

const meta = {
  title: 'eToro-UI/Components/Input/EtInput/📖 Introduction',
  component: IntroContent,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof IntroContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Introduction: Story = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  exampleContainer: {
    marginBottom: 16,
    gap: 16,
  },
  usage: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
  },
  // Code Block Styles
  codeContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
  },
});
