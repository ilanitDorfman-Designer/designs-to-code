import type { Meta, StoryObj } from '@storybook/react-native';
import { EtUserProfileHeader } from 'etoro-ui';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../../utils/storybook-template';

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const AVATAR_URI = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

const mockUser = {
  displayName: 'Jessica Bale',
  username: 'Jessicab',
  avatar: AVATAR_URI,
  stats: {
    aum: 1800000,
    copiers: 38000,
    followers: 42500,
    following: 128,
  },
};

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtUserProfileHeader> = {
  title: 'eToro-UI/Components/Layout/Headers/EtUserProfileHeader/UserInfo',
  component: EtUserProfileHeader,
};

export default meta;

type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>
          User information row with avatar, display name, username, and copiers count. All four subcomponents are composed inside a single UserInfo
          container.
        </Desc>
        <Preview>
          <EtUserProfileHeader user={mockUser}>
            <EtUserProfileHeader.UserInfo>
              <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
              <EtUserProfileHeader.UserInfo.Name />
              <EtUserProfileHeader.UserInfo.UserName />
              <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
            </EtUserProfileHeader.UserInfo>
          </EtUserProfileHeader>
        </Preview>
        <CodeBlock
          code={`import { EtUserProfileHeader } from 'etoro-ui';

const user = {
  displayName: 'Jessica Bale',
  username: 'Jessicab',
  avatar: 'https://example.com/avatar.jpg',
  stats: { aum: 1800000, copiers: 38000, followers: 42500, following: 128 },
};

<EtUserProfileHeader user={user}>
  <EtUserProfileHeader.UserInfo>
    <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
    <EtUserProfileHeader.UserInfo.Name />
    <EtUserProfileHeader.UserInfo.UserName />
    <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
  </EtUserProfileHeader.UserInfo>
</EtUserProfileHeader>`}
        />
      </Section>
    </Page>
  ),
};

export const Compositions: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Compositions</Title>
        <Desc>
          UserInfo uses explicit slot composition — render only the subcomponents you need. The meta row (username + copiers) is only shown when at
          least one of those slots is present.
        </Desc>
      </Section>

      <Section>
        <SubTitle>Without Copiers</SubTitle>
        <Desc>Username appears alone in the meta row when Copiers is omitted.</Desc>
        <Preview>
          <EtUserProfileHeader user={mockUser}>
            <EtUserProfileHeader.UserInfo>
              <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
              <EtUserProfileHeader.UserInfo.Name />
              <EtUserProfileHeader.UserInfo.UserName />
            </EtUserProfileHeader.UserInfo>
          </EtUserProfileHeader>
        </Preview>
        <CodeBlock
          code={`<EtUserProfileHeader user={user}>
  <EtUserProfileHeader.UserInfo>
    <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
    <EtUserProfileHeader.UserInfo.Name />
    <EtUserProfileHeader.UserInfo.UserName />
  </EtUserProfileHeader.UserInfo>
</EtUserProfileHeader>`}
        />
      </Section>

      <Section>
        <SubTitle>Without UserName</SubTitle>
        <Desc>Copiers text appears alone in the meta row when UserName is omitted.</Desc>
        <Preview>
          <EtUserProfileHeader user={mockUser}>
            <EtUserProfileHeader.UserInfo>
              <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
              <EtUserProfileHeader.UserInfo.Name />
              <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
            </EtUserProfileHeader.UserInfo>
          </EtUserProfileHeader>
        </Preview>
        <CodeBlock
          code={`<EtUserProfileHeader user={user}>
  <EtUserProfileHeader.UserInfo>
    <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
    <EtUserProfileHeader.UserInfo.Name />
    <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
  </EtUserProfileHeader.UserInfo>
</EtUserProfileHeader>`}
        />
      </Section>

      <Section>
        <SubTitle>Minimal</SubTitle>
        <Desc>Avatar and display name only — the meta row is hidden entirely.</Desc>
        <Preview>
          <EtUserProfileHeader user={mockUser}>
            <EtUserProfileHeader.UserInfo>
              <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
              <EtUserProfileHeader.UserInfo.Name />
            </EtUserProfileHeader.UserInfo>
          </EtUserProfileHeader>
        </Preview>
        <CodeBlock
          code={`<EtUserProfileHeader user={user}>
  <EtUserProfileHeader.UserInfo>
    <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
    <EtUserProfileHeader.UserInfo.Name />
  </EtUserProfileHeader.UserInfo>
</EtUserProfileHeader>`}
        />
      </Section>

      <Section>
        <SubTitle>Side-by-side comparison</SubTitle>
        <Preview>
          <Col gap={16}>
            <EtUserProfileHeader user={mockUser}>
              <EtUserProfileHeader.UserInfo>
                <EtUserProfileHeader.UserInfo.Avatar alt="avatar" />
                <EtUserProfileHeader.UserInfo.Name />
                <EtUserProfileHeader.UserInfo.UserName />
                <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
              </EtUserProfileHeader.UserInfo>
            </EtUserProfileHeader>
            <Label>Full (all slots)</Label>

            <EtUserProfileHeader user={mockUser}>
              <EtUserProfileHeader.UserInfo>
                <EtUserProfileHeader.UserInfo.Avatar alt="avatar" />
                <EtUserProfileHeader.UserInfo.Name />
                <EtUserProfileHeader.UserInfo.UserName />
              </EtUserProfileHeader.UserInfo>
            </EtUserProfileHeader>
            <Label>Without Copiers</Label>

            <EtUserProfileHeader user={mockUser}>
              <EtUserProfileHeader.UserInfo>
                <EtUserProfileHeader.UserInfo.Avatar alt="avatar" />
                <EtUserProfileHeader.UserInfo.Name />
                <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
              </EtUserProfileHeader.UserInfo>
            </EtUserProfileHeader>
            <Label>Without UserName</Label>

            <EtUserProfileHeader user={mockUser}>
              <EtUserProfileHeader.UserInfo>
                <EtUserProfileHeader.UserInfo.Avatar alt="avatar" />
                <EtUserProfileHeader.UserInfo.Name />
              </EtUserProfileHeader.UserInfo>
            </EtUserProfileHeader>
            <Label>Minimal</Label>
          </Col>
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
        <SubTitle>UserInfo</SubTitle>
        <Desc>
          Root container. Reads user data from the parent EtUserProfileHeader context. Renders a horizontal row with an avatar slot and a details
          column. The meta row (UserName / Copiers) is only rendered when at least one of those slots is present. Extends ViewProps.
        </Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'ViewStyle', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>UserInfo.Avatar</SubTitle>
        <Desc>Displays the user avatar sourced from context. Uses a medium-sized EtAvatar internally.</Desc>
        <PropsTable data={[{ prop: 'alt', type: 'string', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>UserInfo.Name</SubTitle>
        <Desc>Displays the user's display name from context. No configurable props.</Desc>
        <PropsTable data={[{ prop: '—', type: 'reads from context', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>UserInfo.UserName</SubTitle>
        <Desc>Displays the username from context with an automatic @ prefix. No configurable props.</Desc>
        <PropsTable data={[{ prop: '—', type: 'reads from context', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>UserInfo.Copiers</SubTitle>
        <Desc>Displays a pre-formatted copiers label. The parent is responsible for formatting the number (e.g. "38K copiers").</Desc>
        <PropsTable data={[{ prop: 'text', type: 'string', default: '-' }]} />
      </Section>
    </Page>
  ),
};
