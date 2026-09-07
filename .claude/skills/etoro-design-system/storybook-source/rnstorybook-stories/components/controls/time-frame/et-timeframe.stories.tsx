import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EtText, TimeFrameSelector } from 'etoro-ui';
import { TimeFrame } from '@etoro/common/types';

type Story = StoryObj<typeof TimeFrameSelector>;

const meta: Meta<typeof TimeFrameSelector> = {
  title: 'eToro-UI/Components/Controls/TimeFrameSelector',
  component: TimeFrameSelector,
  parameters: {
    notes: 'Animated time frame selector component for switching between different time periods.',
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

export const Interactive: Story = {
  render: (args) => {
    const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>(args.selectedTimeFrame || '1M');

    return <TimeFrameSelector {...args} selectedTimeFrame={selectedTimeFrame} onTimeFrameChange={setSelectedTimeFrame} />;
  },
  args: {
    selectedTimeFrame: '1M',
    onTimeFrameChange: () => {},
    fontSize: 14,
  },
  argTypes: {
    selectedTimeFrame: {
      control: 'select',
      options: ['1W', '1M', '3M', '6M', '1Y'],
    },
    fontSize: {
      control: { type: 'range', min: 10, max: 24, step: 1 },
    },
  },
};

export const FontSizes: Story = {
  render: () => {
    const [selectedSmall, setSelectedSmall] = useState<TimeFrame>('1W');
    const [selectedMedium, setSelectedMedium] = useState<TimeFrame>('3M');
    const [selectedLarge, setSelectedLarge] = useState<TimeFrame>('1Y');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Font Sizes
        </EtText>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            Small (12px)
          </EtText>
          <TimeFrameSelector
            timeFrames={['1W', '1M', '3M', '6M', '1Y']}
            selectedTimeFrame={selectedSmall}
            onTimeFrameChange={setSelectedSmall}
            fontSize={12}
          />
        </View>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            Medium (14px)
          </EtText>
          <TimeFrameSelector
            timeFrames={['1W', '1M', '3M', '6M', '1Y']}
            selectedTimeFrame={selectedMedium}
            onTimeFrameChange={setSelectedMedium}
            fontSize={14}
          />
        </View>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            Large (18px)
          </EtText>
          <TimeFrameSelector
            timeFrames={['1W', '1M', '3M', '6M', '1Y']}
            selectedTimeFrame={selectedLarge}
            onTimeFrameChange={setSelectedLarge}
            fontSize={18}
          />
        </View>
      </View>
    );
  },
};

export const AllSelections: Story = {
  render: () => {
    const [selected1W, setSelected1W] = useState<TimeFrame>('1W');
    const [selected1M, setSelected1M] = useState<TimeFrame>('1M');
    const [selected3M, setSelected3M] = useState<TimeFrame>('3M');
    const [selected6M, setSelected6M] = useState<TimeFrame>('6M');
    const [selected1Y, setSelected1Y] = useState<TimeFrame>('1Y');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          All Time Frame States
        </EtText>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            1W Selected
          </EtText>
          <TimeFrameSelector timeFrames={['1W', '1M', '3M', '6M', '1Y']} selectedTimeFrame={selected1W} onTimeFrameChange={setSelected1W} />
        </View>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            1M Selected
          </EtText>
          <TimeFrameSelector timeFrames={['1W', '1M', '3M', '6M', '1Y']} selectedTimeFrame={selected1M} onTimeFrameChange={setSelected1M} />
        </View>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            3M Selected
          </EtText>
          <TimeFrameSelector timeFrames={['1W', '1M', '3M', '6M', '1Y']} selectedTimeFrame={selected3M} onTimeFrameChange={setSelected3M} />
        </View>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            6M Selected
          </EtText>
          <TimeFrameSelector timeFrames={['1W', '1M', '3M', '6M', '1Y']} selectedTimeFrame={selected6M} onTimeFrameChange={setSelected6M} />
        </View>

        <View style={styles.selectorContainer}>
          <EtText variant="body-base-medium" style={styles.selectorTitle}>
            1Y Selected
          </EtText>
          <TimeFrameSelector timeFrames={['1W', '1M', '3M', '6M', '1Y']} selectedTimeFrame={selected1Y} onTimeFrameChange={setSelected1Y} />
        </View>
      </View>
    );
  },
};

export const TradingInterface: Story = {
  render: () => {
    const [chartTimeFrame, setChartTimeFrame] = useState<TimeFrame>('3M');
    const [portfolioTimeFrame, setPortfolioTimeFrame] = useState<TimeFrame>('1Y');
    const [stockTimeFrame, setStockTimeFrame] = useState<TimeFrame>('1M');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Trading Interface
        </EtText>

        <View style={styles.tradingExample}>
          <View style={styles.chartSection}>
            <EtText variant="heading-compact" style={styles.sectionTitle}>
              Main Chart View
            </EtText>
            <TimeFrameSelector
              timeFrames={['1W', '1M', '3M', '6M', '1Y']}
              selectedTimeFrame={chartTimeFrame}
              onTimeFrameChange={setChartTimeFrame}
              fontSize={16}
            />
          </View>

          <View style={styles.chartSection}>
            <EtText variant="heading-compact" style={styles.sectionTitle}>
              Portfolio Performance
            </EtText>
            <TimeFrameSelector
              timeFrames={['1W', '1M', '3M', '6M', '1Y']}
              selectedTimeFrame={portfolioTimeFrame}
              onTimeFrameChange={setPortfolioTimeFrame}
              fontSize={14}
            />
          </View>

          <View style={styles.chartSection}>
            <EtText variant="heading-compact" style={styles.sectionTitle}>
              Individual Stock
            </EtText>
            <TimeFrameSelector
              timeFrames={['1W', '1M', '3M', '6M', '1Y']}
              selectedTimeFrame={stockTimeFrame}
              onTimeFrameChange={setStockTimeFrame}
              fontSize={14}
            />
          </View>
        </View>
      </View>
    );
  },
};

export const AnimationShowcase: Story = {
  render: () => {
    const [currentSelection, setCurrentSelection] = useState<TimeFrame>('1M');
    const timeFrames: TimeFrame[] = ['1W', '1M', '3M', '6M', '1Y'];
    const currentIndexRef = React.useRef(1); // Start at index 1 since initial state is '1M'

    // Auto-cycle through selections to demonstrate animations
    React.useEffect(() => {
      const interval = setInterval(() => {
        currentIndexRef.current = (currentIndexRef.current + 1) % timeFrames.length;
        setCurrentSelection(timeFrames[currentIndexRef.current]);
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Animation Demo
        </EtText>
        <EtText style={styles.subtitle}>Auto-cycles every 2 seconds</EtText>

        <View style={styles.animationDemo}>
          <TimeFrameSelector
            timeFrames={['1W', '1M', '3M', '6M', '1Y']}
            selectedTimeFrame={currentSelection}
            onTimeFrameChange={setCurrentSelection}
          />
        </View>

        <EtText style={styles.currentSelection}>Current: {currentSelection}</EtText>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  showcase: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 8,
  },
  selectorContainer: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  selectorTitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  tradingExample: {
    width: '100%',
    gap: 24,
  },
  chartSection: {
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    textAlign: 'center',
  },
  animationDemo: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#666',
  },
  currentSelection: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.8,
  },
});
