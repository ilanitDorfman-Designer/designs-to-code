import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText } from 'etoro-ui';
import { EtToggleSwitch } from 'etoro-ui/components/controls/toggle-switch';
import type { ToggleSwitchSize } from 'etoro-ui/components/controls/toggle-switch/api/types';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtToggleSwitch>;

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtToggleSwitch> = {
  title: 'eToro-UI/Components/Controls/EtToggleSwitch',
  component: EtToggleSwitch,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: function BasicStory() {
    const [on, setOn] = useState(false);
    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>A simple toggle switch with controlled state.</Desc>
          <Preview>
            <Row>
              <EtToggleSwitch value={on} onValueChange={setOn} />
              <EtText variant="body-base-regular">{on ? 'On' : 'Off'}</EtText>
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtToggleSwitch } from 'etoro-ui';
import { useState } from 'react';

const [on, setOn] = useState(false);

<EtToggleSwitch value={on} onValueChange={setOn} />`}
          />
        </Section>
      </Page>
    );
  },
};

export const Sizes: Story = {
  render: function SizesStory() {
    const [smallOn, setSmallOn] = useState(false);
    const [mediumOn, setMediumOn] = useState(true);
    return (
      <Page>
        <Section>
          <Title>Sizes</Title>
          <Desc>Use the size prop to change the toggle dimensions.</Desc>
          <Preview>
            <Row>
              {(['small', 'medium'] as ToggleSwitchSize[]).map((size) => (
                <Col key={size}>
                  <EtToggleSwitch
                    value={size === 'small' ? smallOn : mediumOn}
                    onValueChange={size === 'small' ? setSmallOn : setMediumOn}
                    size={size}
                  />
                  <Label>{size}</Label>
                </Col>
              ))}
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtToggleSwitch } from 'etoro-ui';

// Small - 75% scale
<EtToggleSwitch value={on} onValueChange={setOn} size="small" />

// Medium (default) - native size (100% scale)
<EtToggleSwitch value={on} onValueChange={setOn} size="medium" />`}
          />
        </Section>
      </Page>
    );
  },
};

export const States: Story = {
  render: function StatesStory() {
    const [enabledOn, setEnabledOn] = useState(true);
    return (
      <Page>
        <Section>
          <Title>States</Title>
          <Desc>Toggle switches support enabled and disabled states.</Desc>
          <Preview>
            <Row>
              <Col>
                <EtToggleSwitch value={enabledOn} onValueChange={setEnabledOn} />
                <Label>Enabled</Label>
              </Col>
              <Col>
                <EtToggleSwitch value={true} onValueChange={() => {}} disabled />
                <Label>Disabled (on)</Label>
              </Col>
              <Col>
                <EtToggleSwitch value={false} onValueChange={() => {}} disabled />
                <Label>Disabled (off)</Label>
              </Col>
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtToggleSwitch } from 'etoro-ui';

// Enabled (interactive)
<EtToggleSwitch value={on} onValueChange={setOn} />

// Disabled
<EtToggleSwitch value={on} onValueChange={setOn} disabled />`}
          />
        </Section>
      </Page>
    );
  },
};

export const CustomColors: Story = {
  render: function CustomColorsStory() {
    const [indigo, setIndigo] = useState(true);
    const [pink, setPink] = useState(true);
    const [amber, setAmber] = useState(true);

    return (
      <Page>
        <Section>
          <Title>Custom Colors</Title>
          <Desc>Override the default theme colors when specific design requirements call for it. Use sparingly to maintain consistency.</Desc>
          <Preview>
            <Col gap={16}>
              <SubTitle>Default Theme</SubTitle>
              <Row>
                <Col>
                  <EtToggleSwitch value={false} onValueChange={() => {}} />
                  <Label>Off</Label>
                </Col>
                <Col>
                  <EtToggleSwitch value={true} onValueChange={() => {}} />
                  <Label>On (Brand Green)</Label>
                </Col>
              </Row>
            </Col>
          </Preview>
        </Section>

        <Section>
          <SubTitle>Custom Track Colors</SubTitle>
          <Preview>
            <Row>
              <Col>
                <EtToggleSwitch value={indigo} onValueChange={setIndigo} trackColor={{ true: '#6366F1', false: '#94A3B8' }} />
                <Label>Indigo</Label>
              </Col>
              <Col>
                <EtToggleSwitch value={pink} onValueChange={setPink} trackColor={{ true: '#EC4899', false: '#94A3B8' }} />
                <Label>Pink</Label>
              </Col>
              <Col>
                <EtToggleSwitch value={amber} onValueChange={setAmber} trackColor={{ true: '#F59E0B', false: '#94A3B8' }} />
                <Label>Amber</Label>
              </Col>
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtToggleSwitch } from 'etoro-ui';

// Indigo theme
<EtToggleSwitch
  value={value}
  onValueChange={setValue}
  trackColor={{ true: '#6366F1', false: '#94A3B8' }}
/>

// Pink theme
<EtToggleSwitch
  value={value}
  onValueChange={setValue}
  trackColor={{ true: '#EC4899', false: '#94A3B8' }}
/>

// Amber theme
<EtToggleSwitch
  value={value}
  onValueChange={setValue}
  trackColor={{ true: '#F59E0B', false: '#94A3B8' }}
/>`}
          />
          <Desc>
            Note: Custom colors should only be used when required by specific design needs. The default theme colors ensure consistency across the
            application.
          </Desc>
        </Section>
      </Page>
    );
  },
};

export const SettingsExample: Story = {
  render: function SettingsStory() {
    const [notifications, setNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [biometrics, setBiometrics] = useState(false);
    const { c } = useTheme();

    return (
      <Page>
        <Section>
          <Title>Settings Example</Title>
          <Desc>Common pattern for settings screens with toggle switches.</Desc>
          <Preview glow={false}>
            <View style={styles.settingsContainer}>
              <View style={styles.settingRow}>
                <View style={styles.settingText}>
                  <EtText variant="body-base-semibold">Push Notifications</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: c.textMuted }}>
                    Receive alerts for price movements
                  </EtText>
                </View>
                <EtToggleSwitch value={notifications} onValueChange={setNotifications} />
              </View>
              <View style={[styles.divider, { backgroundColor: c.borderSubtle }]} />
              <View style={styles.settingRow}>
                <View style={styles.settingText}>
                  <EtText variant="body-base-semibold">Dark Mode</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: c.textMuted }}>
                    Use dark color scheme
                  </EtText>
                </View>
                <EtToggleSwitch value={darkMode} onValueChange={setDarkMode} />
              </View>
              <View style={[styles.divider, { backgroundColor: c.borderSubtle }]} />
              <View style={styles.settingRow}>
                <View style={styles.settingText}>
                  <EtText variant="body-base-semibold">Biometric Login</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: c.textMuted }}>
                    Use Face ID or fingerprint
                  </EtText>
                </View>
                <EtToggleSwitch value={biometrics} onValueChange={setBiometrics} />
              </View>
            </View>
          </Preview>
          <CodeBlock
            code={`import { EtToggleSwitch } from 'etoro-ui';
import { EtText } from 'etoro-ui';
import { View, StyleSheet } from 'react-native';

<View style={styles.settingRow}>
  <View style={styles.settingText}>
    <EtText variant="body-base-semibold">Push Notifications</EtText>
    <EtText variant="body-secondary-regular">
      Receive alerts for price movements
    </EtText>
  </View>
  <EtToggleSwitch
    value={notifications}
    onValueChange={setNotifications}
  />
</View>

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingText: { flex: 1, marginRight: 16 },
});`}
          />
        </Section>
      </Page>
    );
  },
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtToggleSwitch</SubTitle>
        <Desc>A controlled toggle switch component that extends the native Switch API.</Desc>
        <PropsTable
          data={[
            { prop: 'value', type: 'boolean', default: '-' },
            {
              prop: 'onValueChange',
              type: '(value: boolean) => void',
              default: '-',
            },
            { prop: 'size', type: '"small" | "medium"', default: '"medium"' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            { prop: 'forceNativeSync', type: 'boolean', default: 'false' },
            {
              prop: 'trackColor',
              type: '{ false?: string; true?: string }',
              default: 'theme',
            },
            { prop: 'thumbColor', type: 'string', default: 'theme' },
            { prop: 'style', type: 'ViewStyle', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Size Variants</SubTitle>
        <Desc>Scale transforms applied to the native Switch component.</Desc>
        <PropsTable
          data={[
            { prop: 'small', type: '75% scale (compact)', default: '-' },
            {
              prop: 'medium',
              type: '100% scale (native size)',
              default: 'default',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Notes</SubTitle>
        <Desc>
          EtToggleSwitch is a controlled component - the parent manages state via value and onValueChange props. It extends native SwitchProps for
          easy migration from React Native's Switch or the deprecated EtToggle component.
        </Desc>
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  settingsContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  divider: {
    height: 1,
  },
});
