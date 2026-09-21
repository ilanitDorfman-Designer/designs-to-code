import type { Meta, StoryObj } from '@storybook/react-native';
import { EtMediaCard, EtText } from 'etoro-ui';
import { View } from 'react-native';

import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

const LOGO_URI = 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg';

const meta: Meta<typeof EtMediaCard> = {
  title: 'eToro-UI/Components/DataDisplay/EtMediaCard',
  component: EtMediaCard,
};

export default meta;

type Story = StoryObj<typeof EtMediaCard>;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>Small asset card — logo, title, and subtitle on a brand background.</Desc>
        <Preview>
          <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
            <EtMediaCard.Logo source={{ uri: LOGO_URI }} />
            <EtMediaCard.Title>186.79</EtMediaCard.Title>
            <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
          </EtMediaCard>
        </Preview>
        <CodeBlock
          code={`import { EtMediaCard } from 'etoro-ui';

<EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
  <EtMediaCard.Logo source={{ uri: logoUrl }} />
  <EtMediaCard.Title>186.79</EtMediaCard.Title>
  <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
</EtMediaCard>`}
        />
      </Section>
    </Page>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Sizes</Title>
        <Desc>Figma DS sizes: small 128×164, medium 327×230, large 327×377.</Desc>
        <Preview>
          <Col gap={16}>
            <Row gap={16} wrap>
              <Col gap={8}>
                <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
                  <EtMediaCard.Logo source={{ uri: LOGO_URI }} />
                  <EtMediaCard.Title>186.79</EtMediaCard.Title>
                  <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
                </EtMediaCard>
                <Label>small</Label>
              </Col>
            </Row>
            <Col gap={8}>
              <EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914">
                <EtMediaCard.Logo source={{ uri: LOGO_URI }} placement="background" />
                <EtMediaCard.Header>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>
                    <EtText variant="body-tiny-medium" style={{ color: '#fff' }}>
                      Label
                    </EtText>
                  </View>
                </EtMediaCard.Header>
                <EtMediaCard.Content>
                  <EtText variant="body-tiny-medium" style={{ color: '#fff' }}>
                    Tesla experienced a significant sales slump in early 2026.
                  </EtText>
                </EtMediaCard.Content>
                <EtMediaCard.Footer>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <EtText variant="label-primary-semibold" style={{ color: '#fff' }}>
                        TSLA
                      </EtText>
                      <EtText variant="label-tertiary-regular" style={{ color: '#fff' }}>
                        Subtitle
                      </EtText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <EtText variant="num-ml-medium" style={{ color: '#fff' }}>
                        $186.79
                      </EtText>
                      <EtText variant="label-tertiary-regular" style={{ color: '#fff' }}>
                        Subtitle
                      </EtText>
                    </View>
                  </View>
                </EtMediaCard.Footer>
              </EtMediaCard>
              <Label>medium</Label>
            </Col>
            <Col gap={8}>
              <EtMediaCard size="large" variant="dark">
                <EtMediaCard.Header>
                  <EtText variant="body-tiny-medium" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Trending Stock
                  </EtText>
                </EtMediaCard.Header>
                <EtMediaCard.Content>
                  <EtText variant="label-primary-semibold" style={{ color: '#fff' }}>
                    Global Markets Investor
                  </EtText>
                  <EtText variant="body-tiny-regular" style={{ color: '#fff', marginTop: 8 }}>
                    Short subtitle explaining the section.
                  </EtText>
                </EtMediaCard.Content>
                <EtMediaCard.Footer>
                  <EtText variant="label-primary-semibold" style={{ color: '#fff' }}>
                    Footer content
                  </EtText>
                </EtMediaCard.Footer>
              </EtMediaCard>
              <Label>large</Label>
            </Col>
          </Col>
        </Preview>
      </Section>
    </Page>
  ),
};

export const Variants: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Variants</Title>
        <Desc>Standard (brand), bright (light + border), and dark backgrounds.</Desc>
        <Preview>
          <Row gap={16} wrap>
            <Col gap={8}>
              <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
                <EtMediaCard.Logo source={{ uri: LOGO_URI }} />
                <EtMediaCard.Title>186.79</EtMediaCard.Title>
                <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
              </EtMediaCard>
              <Label>standard</Label>
            </Col>
            <Col gap={8}>
              <EtMediaCard size="small" variant="bright">
                <EtMediaCard.Logo source={{ uri: LOGO_URI }} />
                <EtMediaCard.Title>186.79</EtMediaCard.Title>
                <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
              </EtMediaCard>
              <Label>bright</Label>
            </Col>
            <Col gap={8}>
              <EtMediaCard size="small" variant="dark">
                <EtMediaCard.Logo source={{ uri: LOGO_URI }} />
                <EtMediaCard.Title>186.79</EtMediaCard.Title>
                <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
              </EtMediaCard>
              <Label>dark</Label>
            </Col>
          </Row>
        </Preview>
      </Section>
    </Page>
  ),
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>
      <Section>
        <SubTitle>EtMediaCard</SubTitle>
        <Desc>Root media / asset card. Separate from EtCard.</Desc>
        <PropsTable
          data={[
            { prop: 'size', type: '"small" | "medium" | "large"', default: '"medium"' },
            { prop: 'variant', type: '"standard" | "bright" | "dark"', default: '"standard"' },
            { prop: 'backgroundColor', type: 'string', default: '-' },
            { prop: 'backgroundImage', type: 'ImageSourcePropType', default: '-' },
            { prop: 'backgroundVideo', type: 'string', default: '-' },
            { prop: 'onPress', type: '() => void', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>
      <Section>
        <SubTitle>Subcomponents</SubTitle>
        <Desc>Logo, Title, Subtitle (small). Header, Content, Footer (medium / large — all optional).</Desc>
        <PropsTable
          data={[
            { prop: 'EtMediaCard.Logo', type: 'source, size?, placement?', default: 'placement="inline"' },
            { prop: 'EtMediaCard.Title', type: 'children', default: '-' },
            { prop: 'EtMediaCard.Subtitle', type: 'children', default: '-' },
            { prop: 'EtMediaCard.Header', type: 'children', default: '-' },
            { prop: 'EtMediaCard.Content', type: 'children', default: '-' },
            { prop: 'EtMediaCard.Footer', type: 'children', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
