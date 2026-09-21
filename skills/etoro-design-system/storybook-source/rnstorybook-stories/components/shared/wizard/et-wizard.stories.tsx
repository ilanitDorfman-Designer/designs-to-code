import type { Meta, StoryObj } from '@storybook/react-native';
import { EtIconButton, EtWizard } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

function StoryPreview({ backgroundColor, children }: { backgroundColor: string; children: ReactNode }) {
  return (
    <Preview glow={false}>
      <View style={[storyStyles.phoneFrame, { backgroundColor }]}>{children}</View>
    </Preview>
  );
}

const meta: Meta<typeof EtWizard> = {
  title: 'eToro-UI/Shared/Layout/EtWizard',
  component: EtWizard,
  argTypes: {
    style: { control: false },
    progressColor: { control: false },
  },
  parameters: {
    notes: 'Multi-step guided flow layout with animated segmented progress bar.',
  },
};

export default meta;

type Story = StoryObj<typeof EtWizard>;

export const Basic: Story = {
  render: function BasicStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section noPadding>
          <View style={storyStyles.sectionPadding}>
            <Title>Basic</Title>
            <Desc>Simplest wizard usage with manual step navigation via the footer button. No tap gestures, no auto-play.</Desc>
          </View>
          <StoryPreview backgroundColor={colors.bgNeutralPrimary}>
            <EtWizard>
              <EtWizard.TopbarEnd>
                <EtIconButton iconName="moreVertical" size={24} onPress={() => {}} />
              </EtWizard.TopbarEnd>
              {/* STEP 1 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Personal Info</EtWizard.Title>
                  <EtWizard.Subtitle>Enter your name and email address.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Continue</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 2 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Address</EtWizard.Title>
                  <EtWizard.Subtitle>Enter your residential address.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Continue</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 3 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Verification</EtWizard.Title>
                  <EtWizard.Subtitle>Upload a photo of your ID document.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button onPress={() => {}}>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Submit</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
            </EtWizard>
          </StoryPreview>
          <View style={storyStyles.sectionPadding}>
            <CodeBlock
              code={`import { EtWizard, EtIconButton } from 'etoro-ui';

<EtWizard>
  <EtWizard.TopbarEnd>
    <EtIconButton iconName="moreVertical" size={24} onPress={handleClose} />
  </EtWizard.TopbarEnd>

  <EtWizard.Step>
    <EtWizard.Title>Personal Info</EtWizard.Title>
    <EtWizard.Subtitle>Enter your details.</EtWizard.Subtitle>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Continue</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  <EtWizard.Step>
    <EtWizard.Title>Address</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Continue</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  <EtWizard.Step>
    <EtWizard.Title>Verification</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button onPress={handleSubmit}>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Submit</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>
</EtWizard>`}
            />
          </View>
        </Section>
      </Page>
    );
  },
};

export const PerStepFooters: Story = {
  render: function PerStepFootersStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section noPadding>
          <View style={storyStyles.sectionPadding}>
            <Title>Per-Step Footers</Title>
            <Desc>
              Each step can have its own footer. Declare an EtWizard.Footer inside each EtWizard.Step. Steps without a Footer have no footer area.
            </Desc>
          </View>
          <StoryPreview backgroundColor={colors.bgNeutralPrimary}>
            <EtWizard>
              <EtWizard.TopbarEnd>
                <EtIconButton iconName="moreVertical" size={24} onPress={() => {}} />
              </EtWizard.TopbarEnd>
              {/* STEP 1 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Welcome</EtWizard.Title>
                  <EtWizard.Subtitle>Get started with eToro in just a few steps.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Next</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 2 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Verify Identity</EtWizard.Title>
                  <EtWizard.Subtitle>Upload a photo of your ID to continue.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Label>Verify</EtWizard.Button.Label>
                    <EtWizard.Button.Icon name="chevronRight" />
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 3 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>All Done</EtWizard.Title>
                  <EtWizard.Subtitle>Your account is ready to use.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button onPress={() => {}}>Close</EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
            </EtWizard>
          </StoryPreview>
          <View style={storyStyles.sectionPadding}>
            <CodeBlock
              code={`import { EtWizard } from 'etoro-ui';

<EtWizard onComplete={handleDone}>
  {/* Step 1 - icon left of label */}
  <EtWizard.Step>
    <EtWizard.Title>Welcome</EtWizard.Title>
    <EtWizard.Subtitle>Get started with eToro in just a few steps.</EtWizard.Subtitle>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Next</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  {/* Step 2 - icon right of label */}
  <EtWizard.Step>
    <EtWizard.Title>Verify Identity</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Label>Verify</EtWizard.Button.Label>
        <EtWizard.Button.Icon name="chevronRight" />
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  {/* Step 3 - string shorthand, no icon */}
  <EtWizard.Step>
    <EtWizard.Title>All Done</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button onPress={handleClose}>Close</EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>
</EtWizard>`}
            />
          </View>
        </Section>
      </Page>
    );
  },
};

export const AutoPlay: Story = {
  render: function AutoPlayStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section noPadding>
          <View style={storyStyles.sectionPadding}>
            <Title>Auto-Play</Title>
            <Desc>
              Automatic progression (3s per step). Segments fill over time and auto-advance. Enable tapGestures to allow press-and-hold to pause.
            </Desc>
          </View>
          <StoryPreview backgroundColor={colors.bgNeutralPrimary}>
            <EtWizard autoPlay tapGestures stepDuration={3000} accessibilityLabelLeft="Previous step" accessibilityLabelRight="Next step">
              <EtWizard.TopbarEnd>
                <EtIconButton iconName="moreVertical" size={24} onPress={() => {}} />
              </EtWizard.TopbarEnd>
              {/* STEP 1 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Feature Highlight 1</EtWizard.Title>
                  <EtWizard.Subtitle>This step auto-advances in 3 seconds.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Next</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 2 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Feature Highlight 2</EtWizard.Title>
                  <EtWizard.Subtitle>Watch the progress bar fill up.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Label>Next</EtWizard.Button.Label>
                    <EtWizard.Button.Icon name="chevronRight" />
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 3 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Feature Highlight 3</EtWizard.Title>
                  <EtWizard.Subtitle>Press and hold to pause the timer.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>Next</EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 4 */}
              <EtWizard.Step>
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Get Started</EtWizard.Title>
                  <EtWizard.Subtitle>You&apos;re all set!</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button onPress={() => {}}>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Get Started</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
            </EtWizard>
          </StoryPreview>
          <View style={storyStyles.sectionPadding}>
            <CodeBlock
              code={`import { EtWizard, EtIconButton } from 'etoro-ui';

<EtWizard autoPlay tapGestures stepDuration={3000} accessibilityLabelLeft="Previous step" accessibilityLabelRight="Next step">
  <EtWizard.TopbarEnd>
    <EtIconButton iconName="moreVertical" size={24} onPress={handleClose} />
  </EtWizard.TopbarEnd>

  <EtWizard.Step>
    <EtWizard.Title>Feature Highlight 1</EtWizard.Title>
    <EtWizard.Subtitle>Auto-advances in 3 seconds.</EtWizard.Subtitle>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Next</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  <EtWizard.Step>
    <EtWizard.Title>Feature Highlight 2</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Label>Get Started</EtWizard.Button.Label>
        <EtWizard.Button.Icon name="chevronRight" />
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>
</EtWizard>`}
            />
          </View>
        </Section>
      </Page>
    );
  },
};

export const TapGestures: Story = {
  render: function TapGesturesStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section noPadding>
          <View style={storyStyles.sectionPadding}>
            <Title>Tap Gestures</Title>
            <Desc>Tap left/right halves of the screen to navigate between steps. No auto-play; manual navigation only.</Desc>
          </View>
          <StoryPreview backgroundColor={colors.bgNeutralPrimary}>
            <EtWizard tapGestures accessibilityLabelLeft="Previous step" accessibilityLabelRight="Next step">
              <EtWizard.TopbarEnd>
                <EtIconButton iconName="moreVertical" size={24} onPress={() => {}} />
              </EtWizard.TopbarEnd>
              {/* STEP 1 */}
              <EtWizard.Step contentPosition="bottom">
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Welcome to eToro</EtWizard.Title>
                  <EtWizard.Subtitle>Start your investment journey with the world&apos;s leading social trading platform.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Next</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 2 */}
              <EtWizard.Step contentPosition="bottom">
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Discover Markets</EtWizard.Title>
                  <EtWizard.Subtitle>Explore thousands of assets including stocks, crypto, and more.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Label>Next</EtWizard.Button.Label>
                    <EtWizard.Button.Icon name="chevronRight" />
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 3 */}
              <EtWizard.Step contentPosition="bottom">
                <View style={storyStyles.stepContent}>
                  <EtWizard.Title>Copy Top Traders</EtWizard.Title>
                  <EtWizard.Subtitle>Follow and automatically copy the strategies of successful traders.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button onPress={() => {}}>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Get Started</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
            </EtWizard>
          </StoryPreview>
          <View style={storyStyles.sectionPadding}>
            <CodeBlock
              code={`import { EtWizard, EtIconButton } from 'etoro-ui';

<EtWizard tapGestures accessibilityLabelLeft="Previous step" accessibilityLabelRight="Next step">
  <EtWizard.TopbarEnd>
    <EtIconButton iconName="moreVertical" size={24} onPress={openMenu} />
  </EtWizard.TopbarEnd>

  <EtWizard.Step contentPosition="bottom">
    <EtWizard.Title>Welcome</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Next</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  <EtWizard.Step contentPosition="bottom">
    <EtWizard.Title>Discover Markets</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Label>Next</EtWizard.Button.Label>
        <EtWizard.Button.Icon name="chevronRight" />
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  <EtWizard.Step contentPosition="bottom">
    <EtWizard.Title>Copy Top Traders</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Get Started</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>
</EtWizard>`}
            />
          </View>
        </Section>
      </Page>
    );
  },
};

export const StoryVariant: Story = {
  render: function StoryVariantStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section noPadding>
          <View style={storyStyles.sectionPadding}>
            <Title>Story Variant</Title>
            <Desc>
              {
                'Instagram Stories-style flow. In production this would be a Stack screen with presentation: "fullScreenModal". Auto-plays with tap gestures, white progress bar, content at the bottom, and dark background.'
              }
            </Desc>
          </View>
          <StoryPreview backgroundColor={colors.bgNeutralDark}>
            <EtWizard
              autoPlay
              tapGestures
              stepDuration={4000}
              progressColor={colors.textBright}
              accessibilityLabelLeft="Previous step"
              accessibilityLabelRight="Next step"
            >
              <EtWizard.TopbarEnd>
                <EtIconButton iconName="moreVertical" size={24} onPress={() => {}} />
              </EtWizard.TopbarEnd>
              {/* STEP 1 */}
              <EtWizard.Step contentPosition="bottom" backgroundImage={{ uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800' }}>
                <View style={storyStyles.storyStepContent}>
                  <EtWizard.Title color={colors.textBright}>Invest in Stocks</EtWizard.Title>
                  <EtWizard.Subtitle color={colors.textBright}>Buy fractional shares of your favorite companies starting from $10.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Next</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 2 */}
              <EtWizard.Step contentPosition="bottom" backgroundImage={{ uri: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800' }}>
                <View style={storyStyles.storyStepContent}>
                  <EtWizard.Title color={colors.textBright}>Copy Trading</EtWizard.Title>
                  <EtWizard.Subtitle color={colors.textBright}>Automatically replicate the strategies of top-performing traders.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button>
                    <EtWizard.Button.Label>Next</EtWizard.Button.Label>
                    <EtWizard.Button.Icon name="chevronRight" />
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
              {/* STEP 3 */}
              <EtWizard.Step
                contentPosition="bottom"
                backgroundVideo="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                stepDuration={15000}
              >
                <View style={storyStyles.storyStepContent}>
                  <EtWizard.Title color={colors.textBright}>Smart Portfolios</EtWizard.Title>
                  <EtWizard.Subtitle color={colors.textBright}>Diversified, professionally managed investment strategies.</EtWizard.Subtitle>
                </View>
                <EtWizard.Footer>
                  <EtWizard.Button onPress={() => {}}>
                    <EtWizard.Button.Icon name="star" />
                    <EtWizard.Button.Label>Get Started</EtWizard.Button.Label>
                  </EtWizard.Button>
                </EtWizard.Footer>
              </EtWizard.Step>
            </EtWizard>
          </StoryPreview>
          <View style={storyStyles.sectionPadding}>
            <CodeBlock
              code={`// Route: app/(modals)/promo-stories.tsx
// Stack.Screen options={{ presentation: 'fullScreenModal', gestureEnabled: true }}

import { EtWizard, EtIconButton } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

const { colors } = useEtoroTheme();

<EtWizard
  autoPlay
  tapGestures
  stepDuration={4000}
  progressColor={colors.textBright}
  accessibilityLabelLeft="Previous step"
  accessibilityLabelRight="Next step"
  onComplete={() => router.back()}
>
  <EtWizard.TopbarEnd>
    <EtIconButton iconName="moreVertical" size={24} onPress={openMenu} />
  </EtWizard.TopbarEnd>

  <EtWizard.Step contentPosition="bottom" backgroundImage={require('./slide1.png')}>
    <EtWizard.Title color={colors.textBright}>Invest in Stocks</EtWizard.Title>
    <EtWizard.Subtitle color={colors.textBright}>Buy fractional shares starting from $10.</EtWizard.Subtitle>
    <EtWizard.Footer>
      <EtWizard.Button>
        <EtWizard.Button.Icon name="star" />
        <EtWizard.Button.Label>Next</EtWizard.Button.Label>
      </EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>

  <EtWizard.Step contentPosition="bottom" backgroundImage={require('./slide2.png')}>
    <EtWizard.Title color={colors.textBright}>Copy Trading</EtWizard.Title>
    <EtWizard.Footer>
      <EtWizard.Button>Get Started</EtWizard.Button>
    </EtWizard.Footer>
  </EtWizard.Step>
</EtWizard>`}
            />
          </View>
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
        <SubTitle>EtWizard</SubTitle>
        <Desc>Root component managing step progression and layout.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'WizardChildren', default: '-' },
            { prop: 'stepDuration', type: 'number', default: '5000' },
            { prop: 'autoPlay', type: 'boolean', default: 'false' },
            { prop: 'tapGestures', type: 'boolean', default: 'false' },
            { prop: 'initialStep', type: 'number', default: '0' },
            { prop: 'onStepChange', type: '(step: number) => void', default: '-' },
            { prop: 'onComplete', type: '() => void', default: '-' },
            { prop: 'progressColor', type: 'string', default: 'theme-based' },
            { prop: 'accessibilityLabelLeft', type: 'string', default: '-' },
            { prop: 'accessibilityLabelRight', type: 'string', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtWizard.Title</SubTitle>
        <Desc>Step title with display-main styling by default. Provides Figma-derived typography defaults while allowing full customization.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'variant', type: 'TextVariant', default: "'display-main'" },
            { prop: 'color', type: 'string', default: 'textPrimaryNeutral' },
            { prop: 'style', type: 'StyleProp<TextStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtWizard.Subtitle</SubTitle>
        <Desc>
          Step subtitle/paragraph with body-secondary-regular styling by default. Provides Figma-derived typography defaults while allowing full
          customization.
        </Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'variant', type: 'TextVariant', default: "'body-secondary-regular'" },
            { prop: 'color', type: 'string', default: 'textPrimaryNeutral' },
            { prop: 'style', type: 'StyleProp<TextStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtWizard.Button</SubTitle>
        <Desc>
          Pre-configured CTA button for wizard footers. Compositional wrapper around EtButton with wizard defaults (large, stretch, primary-filled).
          Compose content using EtWizard.Button.Icon and EtWizard.Button.Label, or pass a string directly.
        </Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'string | EtButton.Label | EtButton.Icon | array', default: '-' },
            { prop: 'variant', type: 'ButtonVariant', default: "'primary-filled'" },
            { prop: 'size', type: 'ButtonSize', default: "'large'" },
            { prop: 'stretch', type: 'boolean', default: 'true' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'loading', type: 'boolean', default: 'false' },
            { prop: 'onPress', type: '() => void', default: 'goToNext' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtWizard.Icon</SubTitle>
        <Desc>Standalone icon subcomponent wrapping EtIconV2. Useful for decorative icons inside step content.</Desc>
        <PropsTable
          data={[
            { prop: 'name', type: 'string', default: '-' },
            { prop: 'variant', type: 'IconVariant', default: "'regular'" },
            { prop: 'size', type: 'IconSize | number', default: '24' },
            { prop: 'color', type: 'string', default: 'theme-based' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtWizard.TopbarStart</SubTitle>
        <Desc>Content rendered in the topbar&apos;s start (left) slot. Typically a back button.</Desc>
        <PropsTable data={[{ prop: 'children', type: 'ReactNode', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>EtWizard.TopbarMiddle</SubTitle>
        <Desc>Content rendered in the topbar&apos;s middle (center) slot. Typically a title.</Desc>
        <PropsTable data={[{ prop: 'children', type: 'ReactNode', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>EtWizard.TopbarEnd</SubTitle>
        <Desc>Content rendered in the topbar&apos;s end (right) slot. Typically a close button or contextual actions.</Desc>
        <PropsTable data={[{ prop: 'children', type: 'ReactNode', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>EtWizard.Step</SubTitle>
        <Desc>Defines content for a single step. Rendered based on current step index.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'backgroundImage', type: 'ImageSourcePropType', default: '-' },
            { prop: 'backgroundVideo', type: 'string', default: '-' },
            { prop: 'stepDuration', type: 'number', default: '-' },
            { prop: 'contentPosition', type: "'top' | 'bottom'", default: "'top'" },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtWizard.Footer</SubTitle>
        <Desc>
          Bottom action area, typically containing a CTA button. Declare inside an EtWizard.Step to attach a footer to that step. The wizard extracts
          the footer and renders it in a fixed area below the step content. Steps without a Footer have no footer area.
        </Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Related: EtTopbar.StepProgress</SubTitle>
        <Desc>
          Topbar subcomponent used internally by EtWizard for step progress. Documented here for reference; see EtTopbar stories for full Topbar API.
        </Desc>
        <PropsTable
          data={[
            { prop: 'steps', type: 'number', default: '-' },
            { prop: 'currentStep', type: 'number', default: '-' },
            { prop: 'stepProgress', type: 'SharedValue<number>', default: '-' },
            { prop: 'color', type: 'string', default: 'theme textPrimaryNeutral' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};

const storyStyles = StyleSheet.create({
  sectionPadding: {
    paddingHorizontal: 24,
  },
  phoneFrame: {
    width: 375,
    height: 700,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  stepContent: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  storyStepContent: {
    padding: 24,
    gap: 8,
  },
});
