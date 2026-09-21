import type { Meta, StoryObj } from '@storybook/react-native';
import { EtTopTraderCard } from 'etoro-ui';

import { CodeBlock, Col, Desc, Label, Page, Preview, Section, Title } from '../../../utils/storybook-template';

const HERO = {
  uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=654&h=754&fit=crop',
};

const user = {
  avatar: {
    source: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg',
    size: 'medium' as const,
    alt: 'Robert Steven',
    fallback: 'RS',
  },
  title: 'Robert Steven',
  subtitle: '@robertsteven',
};

const meta: Meta<typeof EtTopTraderCard> = {
  title: 'eToro-UI/Components/DataDisplay/EtTopTraderCard',
  component: EtTopTraderCard,
};

export default meta;

type Story = StoryObj<typeof EtTopTraderCard>;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Top Trader</Title>
        <Desc>Smart large-image person card — MediaCard content stack + EtUserInfo footer + rates (Figma 63763:418671).</Desc>
        <Preview>
          <Col gap={8}>
            <EtTopTraderCard
              user={user}
              backgroundImage={HERO}
              title="Global Markets Investor"
              description="Long-term, diversified strategy across tech, ETFs, and digital assets."
              price={204.13}
              change={0.09}
              changePercent={0.0005}
            />
            <Label>large · image · EtUserInfo + rates footer</Label>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtTopTraderCard } from 'etoro-ui';

<EtTopTraderCard
  user={{
    avatar: { source: 'https://…/avatar.jpg', size: 'medium' },
    title: 'Robert Steven',
    subtitle: '@robertsteven',
  }}
  backgroundImage={{ uri: heroUrl }}
  title="Global Markets Investor"
  description="Long-term, diversified strategy…"
  price={204.13}
  change={0.09}
  changePercent={0.0005}
/>`}
        />
      </Section>
    </Page>
  ),
};
