import type { Meta, StoryObj } from '@storybook/react-native';
import { EtIconV2, EtReadMoreText, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core/hooks';
import { Alert, View } from 'react-native';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

// ── Sample data ──────────────────────────────────────────────────────────

const SAMPLE_SHORT = 'This is a short text that fits within a few lines.';

const SAMPLE_POST =
  "This is something that annoys me - people complain about a lack of innovation at Apple and I have no idea why. Almost as if it's trendy or something to say it. Innovation doesn't always have to look revolutionary on the surface. Sometimes it shows up in the details, in how products age well, work seamlessly, and quietly raise the bar without making noise.";

const SAMPLE_LONG =
  "The stock market experienced significant volatility today as investors reacted to the latest economic data releases. The Federal Reserve's decision to maintain interest rates at their current level was widely anticipated, but the accompanying statement contained several hawkish signals that caught traders off guard. Technology stocks led the decline, with major indices falling by more than 2% in afternoon trading. Analysts noted that the sell-off was exacerbated by algorithmic trading systems that triggered stop-loss orders across multiple sectors. Despite the downturn, some market observers pointed to strong corporate earnings as a reason for long-term optimism. The upcoming jobs report, scheduled for release on Friday, is expected to provide further clarity on the direction of monetary policy in the coming months.";

const SAMPLE_RICH_TEXT =
  'Buy $AAPL and $TSLA! Follow @meiramar and @yaborooni for daily insights. Check out https://www.etoro.com/markets for the latest market data. The tech sector is booming.';

// ── Meta ─────────────────────────────────────────────────────────────────

const meta: Meta<typeof EtReadMoreText> = {
  title: 'eToro-UI/Foundations/Typography/EtReadMoreText',
  component: EtReadMoreText,
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic ───────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>
          The simplest usage — provide text and a maxLines limit. The "Show More" / "Show Less" action appears inline at the end of the last visible
          line. Tapping anywhere on the text toggles expansion.
        </Desc>
        <Preview>
          <EtReadMoreText maxLines={3} text={SAMPLE_POST} />
        </Preview>
        <CodeBlock
          code={`import { EtReadMoreText } from 'etoro-ui';

<EtReadMoreText maxLines={3} text={postContent} />`}
        />
      </Section>
    </Page>
  ),
};

// ─── Line Limits ─────────────────────────────────────────────────────────

export const LineLimits: Story = {
  name: 'Line Limits',
  render: () => (
    <Page>
      <Section>
        <Title>Line Limits</Title>
        <Desc>Control how many lines are visible before truncation with the maxLines prop. The default is 4 lines.</Desc>
      </Section>

      <Section>
        <Col gap={24}>
          <Col gap={8}>
            <Label>maxLines=2</Label>
            <Preview>
              <EtReadMoreText maxLines={2} text={SAMPLE_POST} />
            </Preview>
          </Col>

          <Col gap={8}>
            <Label>maxLines=3</Label>
            <Preview>
              <EtReadMoreText maxLines={3} text={SAMPLE_POST} />
            </Preview>
          </Col>

          <Col gap={8}>
            <Label>maxLines=4 (default)</Label>
            <Preview>
              <EtReadMoreText maxLines={4} text={SAMPLE_POST} />
            </Preview>
          </Col>

          <Col gap={8}>
            <Label>maxLines=6</Label>
            <Preview>
              <EtReadMoreText maxLines={6} text={SAMPLE_LONG} />
            </Preview>
          </Col>
        </Col>
      </Section>
    </Page>
  ),
};

// ─── Short Text ──────────────────────────────────────────────────────────

export const ShortText: Story = {
  name: 'Short Text',
  render: () => (
    <Page>
      <Section>
        <Title>Short Text — No Toggle</Title>
        <Desc>
          When text fits within maxLines, the "Show More" toggle is hidden automatically. The component renders as plain text with no interaction.
        </Desc>
        <Preview>
          <EtReadMoreText maxLines={4} text={SAMPLE_SHORT} />
        </Preview>
      </Section>
    </Page>
  ),
};

// ─── Custom Toggle Labels ────────────────────────────────────────────────

export const CustomToggleLabels: Story = {
  name: 'Custom Toggle Labels',
  render: () => (
    <Page>
      <Section>
        <Title>Custom Toggle Labels</Title>
        <Desc>Override the default "Show More" / "Show Less" text with custom labels using showMoreText and showLessText props.</Desc>
      </Section>

      <Section>
        <Col gap={24}>
          <Col gap={8}>
            <Label>"Read more" / "Read less"</Label>
            <Preview>
              <EtReadMoreText maxLines={3} text={SAMPLE_POST} showMoreText="Read more" showLessText="Read less" />
            </Preview>
          </Col>

          <Col gap={8}>
            <Label>"See all" / "Collapse"</Label>
            <Preview>
              <EtReadMoreText maxLines={3} text={SAMPLE_POST} showMoreText="See all" showLessText="Collapse" />
            </Preview>
          </Col>
        </Col>

        <CodeBlock
          code={`import { EtReadMoreText } from 'etoro-ui';

<EtReadMoreText
  maxLines={3}
  text={postContent}
  showMoreText="Read more"
  showLessText="Read less"
/>`}
        />
      </Section>
    </Page>
  ),
};

// ─── Custom Action Component ─────────────────────────────────────────────

export const CustomActionComponent: Story = {
  name: 'Custom Action Component',
  render: function CustomActionStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>Custom Action Component</Title>
          <Desc>
            Replace the default "Show More" / "Show Less" text with fully custom content using the customActionComponent render prop. It receives the
            current expanded state as a boolean.
          </Desc>
        </Section>

        <Section>
          <Col gap={24}>
            <Col gap={8}>
              <Label>Icon only (chevron)</Label>
              <Preview>
                <EtReadMoreText
                  maxLines={3}
                  text={SAMPLE_POST}
                  customActionComponent={(isExpanded) => (
                    <EtIconV2 name={isExpanded ? 'chevron-up' : 'chevron-down'} size="sm" color={colors.textPrimaryNeutral} />
                  )}
                />
              </Preview>
            </Col>

            <Col gap={8}>
              <Label>Text + icon combo</Label>
              <Preview>
                <EtReadMoreText
                  maxLines={3}
                  text={SAMPLE_POST}
                  customActionComponent={(isExpanded) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <EtText variant="body-secondary-semibold">{isExpanded ? 'Show less' : 'Show more'}</EtText>
                      <EtIconV2 name={isExpanded ? 'chevron-up' : 'chevron-down'} size="sm" color={colors.textPrimaryNeutral} />
                    </View>
                  )}
                />
              </Preview>
            </Col>

            <Col gap={8}>
              <Label>Fully custom action</Label>
              <Preview>
                <EtReadMoreText
                  maxLines={3}
                  text={SAMPLE_POST}
                  customActionComponent={(isExpanded) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <EtIconV2 name="arrow-right" size="sm" color={colors.actionBrandText} />
                      <EtText variant="body-secondary-medium" style={{ color: colors.actionBrandText }}>
                        {isExpanded ? 'Collapse' : 'Continue reading'}
                      </EtText>
                    </View>
                  )}
                />
              </Preview>
            </Col>
          </Col>

          <CodeBlock
            code={`import { EtReadMoreText, EtText } from 'etoro-ui';
import { EtIconV2 } from 'etoro-ui/components/et-icon-v2';

// Icon only
<EtReadMoreText
  maxLines={3}
  text={postContent}
  customActionComponent={(isExpanded) => (
    <EtIconV2
      name={isExpanded ? 'chevron-up' : 'chevron-down'}
      size="sm"
    />
  )}
/>

// Text + icon combo
<EtReadMoreText
  maxLines={3}
  text={postContent}
  customActionComponent={(isExpanded) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <EtText variant="body-secondary-semibold">
        {isExpanded ? 'Show less' : 'Show more'}
      </EtText>
      <EtIconV2
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size="sm"
      />
    </View>
  )}
/>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─── Typography Variants ─────────────────────────────────────────────────

export const TypographyVariants: Story = {
  name: 'Typography Variants',
  render: () => (
    <Page>
      <Section>
        <Title>Typography Variants</Title>
        <Desc>Customize the text and action typography with textVariant and actionTextVariant props.</Desc>
      </Section>

      <Section>
        <Col gap={24}>
          <Col gap={8}>
            <Label>Default (body-secondary-regular)</Label>
            <Preview>
              <EtReadMoreText maxLines={3} text={SAMPLE_POST} />
            </Preview>
          </Col>

          <Col gap={8}>
            <Label>body-base-regular</Label>
            <Preview>
              <EtReadMoreText maxLines={3} text={SAMPLE_POST} textVariant="body-base-regular" />
            </Preview>
          </Col>

          <Col gap={8}>
            <Label>body-tiny-regular</Label>
            <Preview>
              <EtReadMoreText maxLines={3} text={SAMPLE_POST} textVariant="body-tiny-regular" />
            </Preview>
          </Col>
        </Col>

        <CodeBlock
          code={`import { EtReadMoreText } from 'etoro-ui';

<EtReadMoreText
  textVariant="body-base-regular"
  actionTextVariant="body-base-semibold"
  maxLines={3}
  text={postContent}
/>`}
        />
      </Section>
    </Page>
  ),
};

// ─── Initially Expanded ──────────────────────────────────────────────────

export const InitiallyExpanded: Story = {
  name: 'Initially Expanded',
  render: () => (
    <Page>
      <Section>
        <Title>Initially Expanded</Title>
        <Desc>
          Render the full text on mount with a "Show Less" option visible. Use onExpandedChange to track state changes for analytics or external state
          sync.
        </Desc>
        <Preview>
          <EtReadMoreText
            maxLines={3}
            text={SAMPLE_POST}
            initialExpanded
            onExpandedChange={(expanded) => Alert.alert('State changed', expanded ? 'Expanded' : 'Collapsed')}
          />
        </Preview>
        <CodeBlock
          code={`import { EtReadMoreText } from 'etoro-ui';

<EtReadMoreText
  maxLines={3}
  text={postContent}
  initialExpanded
  onExpandedChange={(expanded) => {
    analytics.track('post_toggle', { expanded });
  }}
/>`}
        />
      </Section>
    </Page>
  ),
};

// ─── URL Auto-Detection ──────────────────────────────────────────────────

export const URLAutoDetection: Story = {
  name: 'URL Auto-Detection',
  render: () => (
    <Page>
      <Section>
        <Title>URL Auto-Detection</Title>
        <Desc>
          In string mode (no children), URLs are automatically detected and rendered as clickable inline text when onLinkPress is provided. URLs use
          the brand action color to stand out from plain text.
        </Desc>
        <Preview>
          <EtReadMoreText
            maxLines={3}
            text="Great resources for learning: https://www.investopedia.com has beginner guides, and https://www.etoro.com/academy covers everything from stocks to crypto."
            onLinkPress={(url) => Alert.alert('Link pressed', url)}
          />
        </Preview>
        <CodeBlock
          code={`import { EtReadMoreText } from 'etoro-ui';
import { Linking } from 'react-native';

<EtReadMoreText
  maxLines={3}
  text="Check out https://www.etoro.com for more info"
  onLinkPress={(url) => Linking.openURL(url)}
/>`}
        />
      </Section>
    </Page>
  ),
};

// ─── Children Mode — Rich Content ────────────────────────────────────────

export const ChildrenMode: Story = {
  name: 'Children — Rich Content',
  render: function ChildrenModeStory() {
    const { colors } = useEtoroTheme();
    const linkStyle = { color: colors.actionBrandText };

    return (
      <Page>
        <Section>
          <Title>Children Mode — Rich Content</Title>
          <Desc>
            Pass pre-built ReactNode children with interactive elements. The text prop provides the plain-text version for measurement, while children
            is used for display in both collapsed and expanded states. Use nested EtText with onPress for inline interactive text.
          </Desc>
          <Preview>
            <EtReadMoreText text={SAMPLE_RICH_TEXT} maxLines={3}>
              <EtText>Buy </EtText>
              <EtText onPress={() => Alert.alert('Tag', '$AAPL')} style={linkStyle}>
                $AAPL
              </EtText>
              <EtText> and </EtText>
              <EtText onPress={() => Alert.alert('Tag', '$TSLA')} style={linkStyle}>
                $TSLA
              </EtText>
              <EtText>! Follow </EtText>
              <EtText onPress={() => Alert.alert('Mention', '@meiramar')} style={linkStyle}>
                @meiramar
              </EtText>
              <EtText> and </EtText>
              <EtText onPress={() => Alert.alert('Mention', '@yaborooni')} style={linkStyle}>
                @yaborooni
              </EtText>
              <EtText> for daily insights. Check out </EtText>
              <EtText onPress={() => Alert.alert('Link', 'https://www.etoro.com/markets')} style={linkStyle}>
                https://www.etoro.com/markets
              </EtText>
              <EtText> for the latest market data. The tech sector is booming.</EtText>
            </EtReadMoreText>
          </Preview>
          <CodeBlock
            code={`import { EtReadMoreText, EtText } from 'etoro-ui';

const linkStyle = { color: colors.actionBrandText };

<EtReadMoreText text={plainText} maxLines={3}>
  Buy{' '}
  <EtText onPress={() => navigateToMarket('AAPL')} style={linkStyle}>
    $AAPL
  </EtText>
  ! Follow{' '}
  <EtText onPress={() => navigateToProfile('meiramar')} style={linkStyle}>
    @meiramar
  </EtText>
  {' '}at{' '}
  <EtText onPress={() => Linking.openURL(url)} style={linkStyle}>
    https://www.etoro.com
  </EtText>
</EtReadMoreText>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─── Feed Post Example ───────────────────────────────────────────────────

export const FeedPostExample: Story = {
  name: 'Feed Post Example',
  render: function FeedPostStory() {
    const { colors } = useEtoroTheme();
    const linkStyle = { color: colors.actionBrandText };

    const postText =
      'Just bought more $AAPL after the earnings call. Solid guidance from Tim Cook! Also keeping an eye on $TSLA and $GOOGL. Follow @meiramar for my full analysis at https://www.etoro.com/people/meiramar';

    return (
      <Page>
        <Section>
          <Title>Feed Post Example</Title>
          <Desc>
            A realistic social feed post combining children mode with custom toggle labels. Features $tags, @mentions, and URLs as interactive inline
            text.
          </Desc>
          <Preview>
            <EtReadMoreText text={postText} maxLines={3} showMoreText="Read more" showLessText="Read less">
              <EtText>Just bought more </EtText>
              <EtText onPress={() => Alert.alert('Market', '$AAPL')} style={linkStyle}>
                $AAPL
              </EtText>
              <EtText> after the earnings call. Solid guidance from Tim Cook! Also keeping an eye on </EtText>
              <EtText onPress={() => Alert.alert('Market', '$TSLA')} style={linkStyle}>
                $TSLA
              </EtText>
              <EtText> and </EtText>
              <EtText onPress={() => Alert.alert('Market', '$GOOGL')} style={linkStyle}>
                $GOOGL
              </EtText>
              <EtText>. Follow </EtText>
              <EtText onPress={() => Alert.alert('Profile', '@meiramar')} style={linkStyle}>
                @meiramar
              </EtText>
              <EtText> for my full analysis at </EtText>
              <EtText onPress={() => Alert.alert('Link', 'https://www.etoro.com/people/meiramar')} style={linkStyle}>
                https://www.etoro.com/people/meiramar
              </EtText>
            </EtReadMoreText>
          </Preview>
        </Section>
      </Page>
    );
  },
};

// ─── API Reference (always last) ─────────────────────────────────────────

export const APIReference: Story = {
  name: 'API Reference',
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>Content</SubTitle>
        <PropsTable
          data={[
            {
              prop: 'text',
              type: 'string',
              default: 'required',
              description:
                'Plain text content — required in both string and children modes. Used for measurement, truncation calculations, and reset detection when content changes.',
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description:
                'Rich content with pre-built interactive elements (e.g. EtText with onPress). When provided, used for rendering in both collapsed and expanded states. The text prop must still be provided as the plain-text equivalent for measurement.',
            },
            {
              prop: 'customActionComponent',
              type: '(isExpanded: boolean) => ReactNode',
              default: '-',
              description:
                'Render prop that replaces the default "Show More" / "Show Less" text. Receives the current expanded state and returns custom content (e.g. icons, badges, or styled text).',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Appearance</SubTitle>
        <PropsTable
          data={[
            {
              prop: 'maxLines',
              type: 'number',
              default: '4',
              description: 'Maximum number of lines to show when collapsed. The last line is trimmed to fit the inline action.',
            },
            {
              prop: 'textVariant',
              type: 'TextVariant',
              default: '"body-secondary-regular"',
              description: 'Typography variant for the text content.',
            },
            {
              prop: 'actionTextVariant',
              type: 'TextVariant',
              default: '"body-secondary-semibold"',
              description: 'Typography variant for the default action text (Show More / Show Less). Ignored when customActionComponent is used.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Custom style applied to the container Animated.View.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Interaction</SubTitle>
        <PropsTable
          data={[
            {
              prop: 'showMoreText',
              type: 'string',
              default: '"Show More"',
              description: 'Text for the expand action when using the default action. Ignored when customActionComponent is used.',
            },
            {
              prop: 'showLessText',
              type: 'string',
              default: '"Show Less"',
              description: 'Text for the collapse action when using the default action. Ignored when customActionComponent is used.',
            },
            {
              prop: 'onLinkPress',
              type: '(url: string) => void',
              default: '-',
              description:
                'Callback when a URL in the text is pressed. When provided, URLs are auto-detected and rendered as clickable inline text. Only applies in string mode (no children).',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>State</SubTitle>
        <PropsTable
          data={[
            {
              prop: 'initialExpanded',
              type: 'boolean',
              default: 'false',
              description: 'Whether the text starts in expanded state on mount.',
            },
            {
              prop: 'onExpandedChange',
              type: '(expanded: boolean) => void',
              default: '-',
              description: 'Callback fired when the expanded state changes. Useful for analytics or syncing external state.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Accessibility</SubTitle>
        <PropsTable
          data={[
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test identifier. Automatically suffixed for sub-elements (-measure, -text, -toggle).',
            },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: '-',
              description: 'Accessibility label for the container.',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
