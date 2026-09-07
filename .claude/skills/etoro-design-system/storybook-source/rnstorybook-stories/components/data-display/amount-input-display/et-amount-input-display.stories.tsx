import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAmountInputDisplay } from 'etoro-ui';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CodeBlock, Desc, Page, Preview, Section, Title } from '../../../utils/storybook-template';

const meta: Meta<typeof EtAmountInputDisplay> = {
  title: 'eToro-UI/Components/DataDisplay/EtAmountInputDisplay',
  component: EtAmountInputDisplay,
};

export default meta;

type Story = StoryObj<typeof EtAmountInputDisplay>;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

function InteractiveAmount() {
  const [value, setValue] = useState('0');

  const handlePress = (key: string) => {
    setValue((prev) => {
      if (key === '⌫') {
        const next = prev.slice(0, -1);
        return next.length === 0 ? '0' : next;
      }
      if (key === '.') {
        return prev.includes('.') ? prev : `${prev}.`;
      }
      return prev === '0' ? key : `${prev}${key}`;
    });
  };

  return (
    <View style={styles.interactive}>
      <EtAmountInputDisplay value={value} currencySymbol="$" unitLabel="Shares" showCursor />
      <View style={styles.keypad}>
        {KEYS.map((key) => (
          <Pressable key={key} style={styles.key} onPress={() => handlePress(key)}>
            <View pointerEvents="none">
              <EtAmountInputDisplay value={key} autoScale={false} fontSize={20} digitHeight={26} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export const Basic: Story = {
  render: () => (
    <Page>
      <Title>EtAmountInputDisplay</Title>
      <Desc>
        Plug-and-play amount display for entry flows: currency + animated number + unit that progressively shrink together as the value grows and
        always fit their container.
      </Desc>

      <Section>
        <Title>Props API (zero setup)</Title>
        <Preview>
          <EtAmountInputDisplay value="1,234.56" currencySymbol="$" unitLabel="Shares" />
        </Preview>
        <CodeBlock code={`<EtAmountInputDisplay value="1,234.56" currencySymbol="$" unitLabel="Shares" />`} />
      </Section>

      <Section>
        <Title>Progressive shrink</Title>
        <Desc>The whole row scales down from the 6th digit so large numbers never blow out.</Desc>
        <Preview>
          <EtAmountInputDisplay value="1" currencySymbol="$" />
          <EtAmountInputDisplay value="12,345" currencySymbol="$" />
          <EtAmountInputDisplay value="1,234,567" currencySymbol="$" />
        </Preview>
      </Section>

      <Section>
        <Title>Compound API</Title>
        <Preview>
          <EtAmountInputDisplay value="42">
            <EtAmountInputDisplay.Currency>€</EtAmountInputDisplay.Currency>
            <EtAmountInputDisplay.Value />
            <EtAmountInputDisplay.Unit>Units</EtAmountInputDisplay.Unit>
          </EtAmountInputDisplay>
        </Preview>
        <CodeBlock
          code={`<EtAmountInputDisplay value="42">
  <EtAmountInputDisplay.Currency>€</EtAmountInputDisplay.Currency>
  <EtAmountInputDisplay.Value />
  <EtAmountInputDisplay.Unit>Units</EtAmountInputDisplay.Unit>
</EtAmountInputDisplay>`}
        />
      </Section>

      <Section>
        <Title>Interactive</Title>
        <InteractiveAmount />
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  interactive: {
    gap: 16,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: '33%',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
