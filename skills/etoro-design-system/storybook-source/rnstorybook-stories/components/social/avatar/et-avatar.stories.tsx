import type { Meta, StoryObj } from '@storybook/react-native';
import { EtIconV2, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { EtAvatar } from '../../../../../libs/etoro-ui/src/components/social/avatar/et-avatar';
import type { AvatarShape, AvatarSize, AvatarVariant } from '../../../../../libs/etoro-ui/src/components/social/avatar/utils/types';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtAvatar>;

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const AVATARS = [
  'https://etoro-cdn.etorostatic.com/avatars/150X150/918269/10.jpg',
  'https://etoro-cdn.etorostatic.com/avatars/150X150/9412304/1.jpg',
  'https://etoro-cdn.etorostatic.com/avatars/150X150/149.jpg',
];

const INSTRUMENT = 'https://etoro-cdn.etorostatic.com/market-avatars/7999/150x150.png';

const INSTRUMENT_AVATARS = {
  AAPL: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg',
  GOOG: 'https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_3183FF_F7F7F7.svg',
  META: 'https://etoro-cdn.etorostatic.com/market-avatars/1003/1003_F7F7F7_2C2C2C.svg',
} as const;

const PORTFOLIO_INSTRUMENTS = [
  { id: 'aapl', symbol: 'AAPL', logoUrl: INSTRUMENT_AVATARS.AAPL },
  { id: 'goog', symbol: 'GOOG', logoUrl: INSTRUMENT_AVATARS.GOOG },
  { id: 'meta', symbol: 'META', logoUrl: INSTRUMENT_AVATARS.META },
] as const;

const AVATAR_GROUP_OVERLAP = -8;

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtAvatar> = {
  title: 'eToro-UI/Components/Social/EtAvatar',
  component: EtAvatar,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>A basic avatar with an image</Desc>
        <Preview>
          <EtAvatar>
            <EtAvatar.Image src={AVATARS[0]} />
          </EtAvatar>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

<EtAvatar>
  <EtAvatar.Image src="https://example.com/avatar.jpg" />
</EtAvatar>`}
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
        <Desc>Use the size prop to change the avatar size.</Desc>
        <Preview>
          <Row>
            {(['small', 'medium', 'large'] as AvatarSize[]).map((size) => (
              <Col key={size}>
                <EtAvatar size={size}>
                  <EtAvatar.Image src={AVATARS[0]} />
                </EtAvatar>
                <Label>{size}</Label>
              </Col>
            ))}
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

// Small - 24px
<EtAvatar size="small">
  <EtAvatar.Image src={avatarUrl} />
</EtAvatar>

// Medium - 36px (default)
<EtAvatar size="medium">
  <EtAvatar.Image src={avatarUrl} />
</EtAvatar>

// Large - 48px
<EtAvatar size="large">
  <EtAvatar.Image src={avatarUrl} />
</EtAvatar>`}
        />
      </Section>
    </Page>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Shapes</Title>
        <Desc>Use the shape prop for circle or square avatars.</Desc>
        <Preview>
          <Row>
            {(['circle', 'square'] as AvatarShape[]).map((shape) => (
              <Col key={shape}>
                <EtAvatar size="large" shape={shape}>
                  <EtAvatar.Image src={AVATARS[0]} />
                </EtAvatar>
                <Label>{shape}</Label>
              </Col>
            ))}
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

// Circle (for users)
<EtAvatar size="large" shape="circle">
  <EtAvatar.Image src={avatarUrl} />
</EtAvatar>

// Square with rounded corners
<EtAvatar size="large" shape="square">
  <EtAvatar.Image src={avatarUrl} />
</EtAvatar>`}
        />
      </Section>
    </Page>
  ),
};

export const WithBadge: Story = {
  render: function BadgeStory() {
    const { c } = useTheme();
    return (
      <Page>
        <Section>
          <Title>Badge</Title>
          <Desc>Add a status indicator at any corner.</Desc>
          <Preview>
            <EtAvatar size="large">
              <EtAvatar.Image src={AVATARS[0]} />
              <EtAvatar.Badge position="bottomRight">
                <View style={[styles.dot, { backgroundColor: c.accent, borderColor: c.bgMuted }]} />
              </EtAvatar.Badge>
            </EtAvatar>
          </Preview>
          <CodeBlock
            code={`import { EtAvatar } from 'etoro-ui';
import { View, StyleSheet } from 'react-native';

<EtAvatar size="large">
  <EtAvatar.Image src={avatarUrl} />
  <EtAvatar.Badge position="bottomRight">
    <View style={styles.onlineDot} />
  </EtAvatar.Badge>
</EtAvatar>

const styles = StyleSheet.create({
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0EB12E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});`}
          />
        </Section>

        <Section>
          <SubTitle>All Positions</SubTitle>
          <Preview>
            <Row>
              {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((pos) => (
                <Col key={pos}>
                  <EtAvatar size="large" shape="square">
                    <EtAvatar.Image src={AVATARS[0]} />
                    <EtAvatar.Badge position={pos}>
                      <View style={[styles.dot, { backgroundColor: c.accent, borderColor: c.bgMuted }]} />
                    </EtAvatar.Badge>
                  </EtAvatar>
                  <Label>{pos}</Label>
                </Col>
              ))}
            </Row>
          </Preview>
          <CodeBlock
            code={`// Available positions
<EtAvatar.Badge position="topLeft">...</EtAvatar.Badge>
<EtAvatar.Badge position="topRight">...</EtAvatar.Badge>
<EtAvatar.Badge position="bottomLeft">...</EtAvatar.Badge>
<EtAvatar.Badge position="bottomRight">...</EtAvatar.Badge>`}
          />
        </Section>

        <Section>
          <SubTitle>Circle Shape</SubTitle>
          <Preview>
            <Row>
              {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((pos) => (
                <Col key={pos}>
                  <EtAvatar size="large" shape="circle">
                    <EtAvatar.Image src={AVATARS[0]} />
                    <EtAvatar.Badge position={pos}>
                      <View style={[styles.dot, { backgroundColor: c.accent, borderColor: c.bgMuted }]} />
                    </EtAvatar.Badge>
                  </EtAvatar>
                  <Label>{pos}</Label>
                </Col>
              ))}
            </Row>
          </Preview>
          <CodeBlock
            code={`// Available positions
<EtAvatar.Badge position="topLeft">...</EtAvatar.Badge>
<EtAvatar.Badge position="topRight">...</EtAvatar.Badge>
<EtAvatar.Badge position="bottomLeft">...</EtAvatar.Badge>
<EtAvatar.Badge position="bottomRight">...</EtAvatar.Badge>`}
          />
        </Section>
      </Page>
    );
  },
};

export const Fallback: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Fallback</Title>
        <Desc>Shown when the image fails to load.</Desc>
        <Preview>
          <Row>
            <Col>
              <EtAvatar size="large" shape="circle">
                <EtAvatar.Image src="invalid" />
                <EtAvatar.Fallback>JD</EtAvatar.Fallback>
              </EtAvatar>
              <Label>Initials</Label>
            </Col>
            <Col>
              <EtAvatar size="large" shape="circle">
                <EtAvatar.Image src="invalid" />
                <EtAvatar.Fallback>
                  <EtText variant="label-primary-semibold">👤</EtText>
                </EtAvatar.Fallback>
              </EtAvatar>
              <Label>Custom</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

// String fallback - displays initials
<EtAvatar size="large" shape="circle">
  <EtAvatar.Image src={avatarUrl} />
  <EtAvatar.Fallback>JD</EtAvatar.Fallback>
</EtAvatar>

// Custom fallback - any React element
<EtAvatar size="large" shape="circle">
  <EtAvatar.Image src={avatarUrl} />
  <EtAvatar.Fallback>
    <MyCustomIcon />
  </EtAvatar.Fallback>
</EtAvatar>`}
        />
      </Section>
    </Page>
  ),
};

export const InstrumentVariant: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Instrument Variant</Title>
        <Desc>Use for stock/crypto logos with gradient overlay.</Desc>
        <Preview>
          <Row>
            {(['small', 'medium', 'large'] as AvatarSize[]).map((size) => (
              <Col key={size}>
                <EtAvatar size={size} variant="instrument">
                  <EtAvatar.Image src={INSTRUMENT} />
                </EtAvatar>
                <Label>{size}</Label>
              </Col>
            ))}
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

<EtAvatar size="medium" variant="instrument">
  <EtAvatar.Image src={stockLogoUrl} />
</EtAvatar>`}
        />
      </Section>
    </Page>
  ),
};

export const Variants: Story = {
  render: () => {
    const variants: { variant: AvatarVariant; label: string; src: string }[] = [
      { variant: 'user', label: 'user', src: AVATARS[0] },
      { variant: 'instrument', label: 'instrument', src: INSTRUMENT },
    ];

    return (
      <Page>
        <Section>
          <Title>Variants</Title>
          <Desc>
            The instrument variant receives a gradient overlay and extracts background color from SVG URLs. The user variant has no overlay.
          </Desc>
          <Preview>
            <Row>
              {variants.map(({ variant, label, src }) => (
                <Col key={variant}>
                  <EtAvatar size="large" shape="square" variant={variant}>
                    <EtAvatar.Image src={src} />
                  </EtAvatar>
                  <Label>{label}</Label>
                </Col>
              ))}
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtAvatar } from 'etoro-ui';

// User avatar (no overlay)
<EtAvatar variant="user" shape="circle">
  <EtAvatar.Image src={userAvatarUrl} />
</EtAvatar>

// Instrument (gradient overlay + SVG bg extraction)
<EtAvatar variant="instrument" shape="square">
  <EtAvatar.Image src={stockLogoUrl} />
</EtAvatar>`}
          />
        </Section>
      </Page>
    );
  },
};

export const IconBadge: Story = {
  render: function IconBadgeStory() {
    const { colors } = useEtoroTheme();
    return (
      <Page>
        <Section>
          <Title>Icon Badge</Title>
          <Desc>
            Pass an icon prop to Badge for a styled circular badge with a themed background. The icon badge is RTL-aware and automatically flips its
            horizontal position in RTL layouts.
          </Desc>
          <Preview>
            <Row>
              {(['small', 'medium', 'large'] as AvatarSize[]).map((size) => (
                <Col key={size}>
                  <EtAvatar size={size} shape="square" variant="instrument">
                    <EtAvatar.Image src={INSTRUMENT} />
                    <EtAvatar.Badge icon={<EtIconV2 name="star" size="xs" color={colors.carbon900} />} />
                  </EtAvatar>
                  <Label>{size}</Label>
                </Col>
              ))}
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtAvatar, EtIconV2 } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

const { colors } = useEtoroTheme();

<EtAvatar size="medium" shape="square" variant="instrument">
  <EtAvatar.Image src={instrumentLogoUrl} />
  <EtAvatar.Badge
    icon={<EtIconV2 name="star" size="xs" color={colors.carbonStatic050} />}
  />
</EtAvatar>`}
          />
        </Section>
      </Page>
    );
  },
};

export const MarketOpen: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Market Status Dot</Title>
        <Desc>
          Status dot indicator positioned at a corner (default bottomRight). Green when market is open (status="open", default), red when closed
          (status="closed").
        </Desc>
        <Preview>
          <Row>
            <Col>
              <EtAvatar size="large" shape="square" variant="instrument">
                <EtAvatar.Image src={INSTRUMENT} />
                <EtAvatar.MarketOpen />
              </EtAvatar>
              <Label>Open (default)</Label>
            </Col>
            <Col>
              <EtAvatar size="large" shape="square" variant="instrument">
                <EtAvatar.Image src={INSTRUMENT} />
                <EtAvatar.MarketOpen status="closed" />
              </EtAvatar>
              <Label>Closed (red)</Label>
            </Col>
            <Col>
              <EtAvatar size="large" shape="circle">
                <EtAvatar.Image src={AVATARS[0]} />
                <EtAvatar.MarketOpen position="bottomRight" />
              </EtAvatar>
              <Label>Circle + open</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

// Green dot (market open — default)
<EtAvatar size="medium" shape="square" variant="instrument">
  <EtAvatar.Image src={instrumentLogoUrl} />
  <EtAvatar.MarketOpen position="bottomRight" />
</EtAvatar>

// Red dot (market closed)
<EtAvatar size="medium" shape="square" variant="instrument">
  <EtAvatar.Image src={instrumentLogoUrl} />
  <EtAvatar.MarketOpen position="bottomRight" status="closed" />
</EtAvatar>`}
        />
      </Section>

      <Section>
        <SubTitle>All Positions</SubTitle>
        <Preview>
          <Row>
            {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((pos) => (
              <Col key={pos}>
                <EtAvatar size="large" shape="square" variant="instrument">
                  <EtAvatar.Image src={INSTRUMENT} />
                  <EtAvatar.MarketOpen position={pos} />
                </EtAvatar>
                <Label>{pos}</Label>
              </Col>
            ))}
          </Row>
        </Preview>
        <CodeBlock
          code={`<EtAvatar.MarketOpen position="topLeft" />
<EtAvatar.MarketOpen position="topRight" />
<EtAvatar.MarketOpen position="bottomLeft" />
<EtAvatar.MarketOpen position="bottomRight" />  // default`}
        />
      </Section>
    </Page>
  ),
};

export const Group: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Avatar Group</Title>
        <Desc>
          Display multiple avatars with overlap. Avatars inside a group automatically render at the group size — default `medium` — unless a child
          sets its own `size`. Pass `size="xsmall"` for the 16px stacked-logo pattern.
        </Desc>
        <Preview>
          <EtAvatar.Group>
            <EtAvatar shape="circle">
              <EtAvatar.Image src={AVATARS[0]} />
            </EtAvatar>
            <EtAvatar shape="circle">
              <EtAvatar.Image src={AVATARS[1]} />
            </EtAvatar>
            <EtAvatar shape="circle">
              <EtAvatar.Image src={AVATARS[2]} />
            </EtAvatar>
            <EtAvatar shape="circle">
              <EtAvatar.Image src="invalid" />
              <EtAvatar.Fallback>JD</EtAvatar.Fallback>
            </EtAvatar>
          </EtAvatar.Group>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

<EtAvatar.Group>
  <EtAvatar shape="circle">
    <EtAvatar.Image src={user1Avatar} />
  </EtAvatar>
  <EtAvatar shape="circle">
    <EtAvatar.Image src={user2Avatar} />
  </EtAvatar>
  <EtAvatar shape="circle">
    <EtAvatar.Image src={user3Avatar} />
  </EtAvatar>
  <EtAvatar shape="circle">
    <EtAvatar.Image src="invalid" />
    <EtAvatar.Fallback>JD</EtAvatar.Fallback>
  </EtAvatar>
</EtAvatar.Group>`}
        />
      </Section>

      <Section>
        <SubTitle>With Count</SubTitle>
        <Desc>
          Show overflow count for additional avatars. The `+N` badge is a grow-to-fit pill, so it stays legible even at the 16px group default and
          expands for larger numbers.
        </Desc>
        <Preview>
          <EtAvatar.Group>
            <EtAvatar shape="circle">
              <EtAvatar.Image src={AVATARS[0]} />
            </EtAvatar>
            <EtAvatar shape="circle">
              <EtAvatar.Image src={AVATARS[1]} />
            </EtAvatar>
            <EtAvatar shape="circle">
              <EtAvatar.Image src={AVATARS[2]} />
            </EtAvatar>
            <EtAvatar.GroupCount>+5</EtAvatar.GroupCount>
          </EtAvatar.Group>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

<EtAvatar.Group>
  <EtAvatar shape="circle">
    <EtAvatar.Image src={user1Avatar} />
  </EtAvatar>
  <EtAvatar shape="circle">
    <EtAvatar.Image src={user2Avatar} />
  </EtAvatar>
  <EtAvatar shape="circle">
    <EtAvatar.Image src={user3Avatar} />
  </EtAvatar>
  <EtAvatar.GroupCount>+5</EtAvatar.GroupCount>
</EtAvatar.Group>`}
        />
      </Section>

      <Section>
        <SubTitle>Counts by Size</SubTitle>
        <Desc>The count bubble scales and stays centered across every avatar size, and widens to fit larger numbers.</Desc>
        <Preview>
          <Col gap={16}>
            {(['xsmall', 'small', 'medium', 'large'] as AvatarSize[]).map((groupSize) => (
              <Row key={groupSize}>
                <Col>
                  <EtAvatar.Group size={groupSize}>
                    {PORTFOLIO_INSTRUMENTS.map((instrument) => (
                      <EtAvatar key={instrument.id} shape="square" variant="instrument">
                        <EtAvatar.Image src={instrument.logoUrl} />
                        <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
                      </EtAvatar>
                    ))}
                    <EtAvatar.GroupCount>+5</EtAvatar.GroupCount>
                  </EtAvatar.Group>
                  <Label>{groupSize} · +5</Label>
                </Col>
                <Col>
                  <EtAvatar.Group size={groupSize}>
                    {PORTFOLIO_INSTRUMENTS.map((instrument) => (
                      <EtAvatar key={instrument.id} shape="square" variant="instrument">
                        <EtAvatar.Image src={instrument.logoUrl} />
                        <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
                      </EtAvatar>
                    ))}
                    <EtAvatar.GroupCount>+120</EtAvatar.GroupCount>
                  </EtAvatar.Group>
                  <Label>{groupSize} · +120</Label>
                </Col>
              </Row>
            ))}
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

// The count bubble adapts to the group size and grows for bigger numbers
<EtAvatar.Group size="medium">
  {/* ...avatars... */}
  <EtAvatar.GroupCount>+120</EtAvatar.GroupCount>
</EtAvatar.Group>`}
        />
      </Section>

      <Section>
        <SubTitle>Instrument Group (16px)</SubTitle>
        <Desc>
          Square instrument avatars inside a group. Pass `size="xsmall"` on the group; children inherit it and the count bubble matches automatically.
        </Desc>
        <Preview>
          <EtAvatar.Group size="xsmall">
            {PORTFOLIO_INSTRUMENTS.map((instrument) => (
              <EtAvatar key={instrument.id} shape="square" variant="instrument">
                <EtAvatar.Image src={instrument.logoUrl} />
                <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
              </EtAvatar>
            ))}
          </EtAvatar.Group>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

// Children inherit the group's 16px size
<EtAvatar.Group size="xsmall">
  {instruments.map((instrument) => (
    <EtAvatar key={instrument.id} shape="square" variant="instrument">
      <EtAvatar.Image src={instrument.logoUrl} />
      <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
    </EtAvatar>
  ))}
</EtAvatar.Group>`}
        />
      </Section>

      <Section>
        <SubTitle>Size Override</SubTitle>
        <Desc>
          Pass `size` to the group to change the shared size, or set `size` on an individual child to override just that one (explicit child size
          wins).
        </Desc>
        <Preview>
          <Row>
            <Col>
              <EtAvatar.Group size="small">
                {PORTFOLIO_INSTRUMENTS.map((instrument) => (
                  <EtAvatar key={instrument.id} shape="square" variant="instrument">
                    <EtAvatar.Image src={instrument.logoUrl} />
                    <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
                  </EtAvatar>
                ))}
                <EtAvatar.GroupCount>+5</EtAvatar.GroupCount>
              </EtAvatar.Group>
              <Label>group size=&quot;small&quot;</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';

// Group-level override — all children become 24px
<EtAvatar.Group size="small">
  {/* ...avatars... */}
</EtAvatar.Group>

// Per-child override — this avatar stays 24px while siblings are 16px
<EtAvatar.Group>
  <EtAvatar size="small" shape="square" variant="instrument">
    <EtAvatar.Image src={logo} />
  </EtAvatar>
</EtAvatar.Group>`}
        />
      </Section>

      <Section>
        <SubTitle>Overlapping Only</SubTitle>
        <Desc>
          For a plain overlapping stack with no pill background and no count badge, skip EtAvatar.Group. Lay out EtAvatar children in a row and apply
          a negative margin to each avatar after the first.
        </Desc>
        <Preview>
          <OverlappingAssetAvatarsExample size="small" overlap={assetGroupStyles.overlap} />
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';
import { StyleSheet, View } from 'react-native';

const AVATAR_OVERLAP = -8;

<View style={styles.stack}>
  {instruments.map((instrument, index) => (
    <View
      key={instrument.id}
      style={[index > 0 && { marginLeft: AVATAR_OVERLAP }, { zIndex: index + 1 }]}
    >
      <EtAvatar size="small" shape="square" variant="instrument">
        <EtAvatar.Image src={instrument.logoUrl} />
        <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
      </EtAvatar>
    </View>
  ))}
</View>`}
        />
      </Section>

      <Section>
        <SubTitle>Overlapping Only (XS · 16px)</SubTitle>
        <Desc>
          The same plain overlapping stack at the `xsmall` (16px) size — matching `EtAvatar.Group size="xsmall"` — with a tighter -4px overlap.
        </Desc>
        <Preview>
          <OverlappingAssetAvatarsExample size="xsmall" overlap={assetGroupStyles.overlapXs} />
        </Preview>
        <CodeBlock
          code={`import { EtAvatar } from 'etoro-ui';
import { StyleSheet, View } from 'react-native';

const AVATAR_OVERLAP = -4;

<View style={styles.stack}>
  {instruments.map((instrument, index) => (
    <View
      key={instrument.id}
      style={[index > 0 && { marginLeft: AVATAR_OVERLAP }, { zIndex: index + 1 }]}
    >
      <EtAvatar size="xsmall" shape="square" variant="instrument">
        <EtAvatar.Image src={instrument.logoUrl} />
        <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
      </EtAvatar>
    </View>
  ))}
</View>`}
        />
      </Section>
    </Page>
  ),
};

function OverlappingAssetAvatarsExample({ size = 'small', overlap = assetGroupStyles.overlap }: { size?: AvatarSize; overlap?: ViewStyle }) {
  return (
    <View style={assetGroupStyles.stack}>
      {PORTFOLIO_INSTRUMENTS.map((instrument, index) => (
        <View key={instrument.id} style={[index > 0 && overlap, { zIndex: index + 1 }]}>
          <EtAvatar size={size} shape="square" variant="instrument">
            <EtAvatar.Image src={instrument.logoUrl} />
            <EtAvatar.Fallback>{instrument.symbol.charAt(0)}</EtAvatar.Fallback>
          </EtAvatar>
        </View>
      ))}
    </View>
  );
}

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtAvatar</SubTitle>
        <Desc>Root component that provides context.</Desc>
        <PropsTable
          data={[
            {
              prop: 'size',
              type: '"xsmall" | "small" | "medium" | "large"',
              default: '"medium"',
              description: 'xsmall (16px) is the stacked-logo size; pass it on EtAvatar.Group when that is the intended geometry.',
            },
            {
              prop: 'shape',
              type: '"circle" | "square"',
              default: '"square"',
            },
            {
              prop: 'variant',
              type: '"default" | "user" | "instrument"',
              default: '"default"',
            },
            { prop: 'style', type: 'ViewStyle', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAvatar.Image</SubTitle>
        <Desc>
          Displays the avatar image. Use accessibilityLabel for accessibility support. Props are defined in AvatarImageProps which extends
          expo-image's ImageProps.
        </Desc>
        <PropsTable
          data={[
            { prop: 'src', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            {
              prop: 'onLoad',
              type: '(event: ImageLoadEventData) => void',
              default: '-',
              description: 'Callback when image loads. Event type from expo-image. See AvatarImageProps in EtAvatar.Image.',
            },
            {
              prop: 'onError',
              type: '(event: ImageErrorEventData) => void',
              default: '-',
              description: 'Callback when image fails to load. Event type from expo-image. See AvatarImageProps in EtAvatar.Image.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAvatar.Fallback</SubTitle>
        <Desc>Shown when image fails to load.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'string | ReactNode', default: '-' },
            { prop: 'style', type: 'ViewStyle', default: '-' },
            { prop: 'delayMs', type: 'number', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAvatar.Badge</SubTitle>
        <Desc>
          Positioned indicator overlay. Supports two modes: generic (children) for arbitrary content, or icon mode (icon prop) for a styled circular
          badge with themed background. When icon is provided, children is ignored. Icon mode is RTL-aware.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'position',
              type: '"topLeft" | "topRight" | "bottomLeft" | "bottomRight"',
              default: '"bottomRight"',
            },
            { prop: 'children', type: 'ReactNode', default: '-' },
            {
              prop: 'icon',
              type: 'ReactElement',
              default: '-',
              description: 'When provided, renders a styled circular badge with this icon. RTL-aware. Takes precedence over children.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAvatar.MarketOpen</SubTitle>
        <Desc>Green dot indicator for market-open status. Fixed X3 (12px) dot with border. No children.</Desc>
        <PropsTable
          data={[
            {
              prop: 'position',
              type: '"topLeft" | "topRight" | "bottomLeft" | "bottomRight"',
              default: '"bottomRight"',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAvatar.Group</SubTitle>
        <Desc>Container for overlapping avatars. Cascades its size to children that don&apos;t set their own.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            {
              prop: 'size',
              type: '"xsmall" | "small" | "medium" | "large"',
              default: '"medium"',
              description: 'Size applied to grouped avatars without an explicit size. Pass "xsmall" for 16px stacked logos.',
            },
            { prop: 'style', type: 'ViewStyle', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAvatar.GroupCount</SubTitle>
        <Desc>Overflow count indicator.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'string | ReactNode', default: '-' },
            { prop: 'size', type: 'AvatarSize', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});

const assetGroupStyles = StyleSheet.create({
  stack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlap: {
    marginLeft: AVATAR_GROUP_OVERLAP,
  },
  overlapXs: {
    marginLeft: -4,
  },
});
