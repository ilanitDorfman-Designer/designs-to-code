import type { Meta, StoryObj } from '@storybook/react-native';
import { EtPoll } from 'etoro-ui';
import { useState } from 'react';
import { CodeBlock, Col, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtPoll>;

const meta: Meta<typeof EtPoll> = {
  title: 'eToro-UI/Components/Social/EtPoll',
  component: EtPoll,
};

export default meta;

const mockAnswers = [
  { id: 'a1', value: 'Long-term', votes: 120 },
  { id: 'a2', value: 'Short-term', votes: 60 },
  { id: 'a3', value: 'Day trading', votes: 30 },
];

const avatarUrls = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
];

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic - Before Voting</Title>
        <Desc>Poll in the voting state with simple pill buttons. Users can select an option to vote.</Desc>
        <Preview>
          <EtPoll answers={mockAnswers} voteCount={210}>
            <EtPoll.Frame>
              <EtPoll.Question>What's your investing style?</EtPoll.Question>
              <EtPoll.OptionsList>
                {mockAnswers.map((answer) => (
                  <EtPoll.VotableOption key={answer.id} answerId={answer.id} />
                ))}
              </EtPoll.OptionsList>
              <EtPoll.FooterContent>
                <EtPoll.VoteCount />
              </EtPoll.FooterContent>
            </EtPoll.Frame>
          </EtPoll>
        </Preview>
        <CodeBlock
          code={`import { EtPoll } from 'etoro-ui';

const answers = [
  { id: 'a1', value: 'Long-term', votes: 120 },
  { id: 'a2', value: 'Short-term', votes: 60 },
  { id: 'a3', value: 'Day trading', votes: 30 },
];

<EtPoll answers={answers} voteCount={210}>
  <EtPoll.Frame>
    <EtPoll.Question>What's your investing style?</EtPoll.Question>
    <EtPoll.OptionsList>
      {answers.map((answer) => (
        <EtPoll.VotableOption key={answer.id} answerId={answer.id} />
      ))}
    </EtPoll.OptionsList>
    <EtPoll.FooterContent>
      <EtPoll.VoteCount />
    </EtPoll.FooterContent>
  </EtPoll.Frame>
</EtPoll>`}
        />
      </Section>
    </Page>
  ),
};

export const AfterVoting: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>After Voting - With Results</Title>
        <Desc>
          Poll showing results with animated progress fills (`scaleX` 0 → vote share, growing from the leading edge), integer percentages, and voter
          avatars. The selected option uses a `primary600` fill with the label on `carbon050` (white in light, dark in dark) and the percentage on
          `verdictPositive600`; unselected options use a translucent {'`${carbon900}14`'} fill with `carbon900` text. No checkmark — selection is
          communicated by fill color alone. `Undo` lands on the trailing edge via `FooterContent`'s space-between layout (no right padding on the
          button itself).
        </Desc>
        <Preview>
          <EtPoll
            answers={mockAnswers}
            voteCount={210}
            selectedId="a1"
            avatarUrls={avatarUrls}
            additionalVotersCount={207}
            onUndo={() => console.log('Undo')}
          >
            <EtPoll.Frame>
              <EtPoll.Question>What's your investing style?</EtPoll.Question>
              <EtPoll.OptionsList>
                {mockAnswers.map((answer) => (
                  <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
                ))}
              </EtPoll.OptionsList>
              <EtPoll.FooterContent>
                <EtPoll.VoterAvatars />
                <EtPoll.UndoButton />
              </EtPoll.FooterContent>
            </EtPoll.Frame>
          </EtPoll>
        </Preview>
        <CodeBlock
          code={`import { EtPoll } from 'etoro-ui';

<EtPoll
  answers={answers}
  voteCount={210}
  selectedId="a1"
  avatarUrls={avatarUrls}
  additionalVotersCount={207}
  onUndo={() => handleUndo()}
>
  <EtPoll.Frame>
    <EtPoll.Question>What's your investing style?</EtPoll.Question>
    <EtPoll.OptionsList>
      {answers.map((answer) => (
        <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
      ))}
    </EtPoll.OptionsList>
    <EtPoll.FooterContent>
      <EtPoll.VoterAvatars />
      <EtPoll.UndoButton />
    </EtPoll.FooterContent>
  </EtPoll.Frame>
</EtPoll>`}
        />
      </Section>
    </Page>
  ),
};

export const Interactive: Story = {
  render: function InteractivePoll() {
    const [selectedId, setSelectedId] = useState<string | undefined>();

    return (
      <Page>
        <Section>
          <Title>Interactive Poll</Title>
          <Desc>Fully interactive poll with controlled state. Click to vote, then click Undo to reset.</Desc>
          <Preview>
            <EtPoll
              answers={mockAnswers}
              voteCount={210}
              selectedId={selectedId}
              onVote={setSelectedId}
              onUndo={() => setSelectedId(undefined)}
              avatarUrls={avatarUrls}
              additionalVotersCount={207}
            >
              <EtPoll.Frame>
                <EtPoll.Question>What's your investing style?</EtPoll.Question>
                <EtPoll.OptionsList>
                  {selectedId
                    ? mockAnswers.map((answer) => <EtPoll.ResultOption key={answer.id} answerId={answer.id} />)
                    : mockAnswers.map((answer) => <EtPoll.VotableOption key={answer.id} answerId={answer.id} />)}
                </EtPoll.OptionsList>
                <EtPoll.FooterContent>
                  {selectedId ? (
                    <>
                      <EtPoll.VoterAvatars />
                      <EtPoll.UndoButton />
                    </>
                  ) : (
                    <EtPoll.VoteCount />
                  )}
                </EtPoll.FooterContent>
              </EtPoll.Frame>
            </EtPoll>
          </Preview>
          <CodeBlock
            code={`import { EtPoll } from 'etoro-ui';
import { useState } from 'react';

function MyComponent() {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  return (
    <EtPoll
      answers={answers}
      voteCount={210}
      selectedId={selectedId}
      onVote={setSelectedId}
      onUndo={() => setSelectedId(undefined)}
      avatarUrls={avatarUrls}
      additionalVotersCount={207}
    >
      <EtPoll.Frame>
        <EtPoll.Question>What's your investing style?</EtPoll.Question>
        <EtPoll.OptionsList>
          {selectedId
            ? answers.map((a) => (
                <EtPoll.ResultOption key={a.id} answerId={a.id} />
              ))
            : answers.map((a) => (
                <EtPoll.VotableOption key={a.id} answerId={a.id} />
              ))}
        </EtPoll.OptionsList>
        <EtPoll.FooterContent>
          {selectedId ? (
            <>
              <EtPoll.VoterAvatars />
              <EtPoll.UndoButton />
            </>
          ) : (
            <EtPoll.VoteCount />
          )}
        </EtPoll.FooterContent>
      </EtPoll.Frame>
    </EtPoll>
  );
}`}
          />
        </Section>
      </Page>
    );
  },
};

export const ManyOptions: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Many Options</Title>
        <Desc>Poll with 5 answer options showing result distribution.</Desc>
        <Preview>
          <EtPoll
            answers={[
              { id: 'c1', value: 'Stocks', votes: 450 },
              { id: 'c2', value: 'Crypto', votes: 390 },
              { id: 'c3', value: 'Commodities', votes: 260 },
              { id: 'c4', value: 'Currencies', votes: 130 },
              { id: 'c5', value: 'ETFs', votes: 65 },
            ]}
            voteCount={1295}
            selectedId="c1"
            avatarUrls={avatarUrls}
            additionalVotersCount={1292}
            onUndo={() => console.log('Undo')}
          >
            <EtPoll.Frame>
              <EtPoll.Question>Which asset class interests you most?</EtPoll.Question>
              <EtPoll.OptionsList>
                {[
                  { id: 'c1', value: 'Stocks' },
                  { id: 'c2', value: 'Crypto' },
                  { id: 'c3', value: 'Commodities' },
                  { id: 'c4', value: 'Currencies' },
                  { id: 'c5', value: 'ETFs' },
                ].map((answer) => (
                  <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
                ))}
              </EtPoll.OptionsList>
              <EtPoll.FooterContent>
                <EtPoll.VoterAvatars />
                <EtPoll.UndoButton />
              </EtPoll.FooterContent>
            </EtPoll.Frame>
          </EtPoll>
        </Preview>
      </Section>
    </Page>
  ),
};

export const CustomLayout: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Custom Layout</Title>
        <Desc>
          The canonical Feed 2026 layout (PE-904) omits the footer divider. `EtPoll.FooterDivider` is still exported as opt-in for compositions that
          explicitly need a separator. Use it sparingly — most layouts should drop it.
        </Desc>
        <Preview>
          <Col gap={16}>
            {/* Minimal poll - no footer at all */}
            <EtPoll answers={mockAnswers} voteCount={50}>
              <EtPoll.Frame>
                <EtPoll.Question>Quick poll</EtPoll.Question>
                <EtPoll.OptionsList>
                  {mockAnswers.map((answer) => (
                    <EtPoll.VotableOption key={answer.id} answerId={answer.id} />
                  ))}
                </EtPoll.OptionsList>
              </EtPoll.Frame>
            </EtPoll>

            {/* Opt-in divider - rare, only when design explicitly calls for it */}
            <EtPoll answers={mockAnswers} voteCount={100}>
              <EtPoll.Frame>
                <EtPoll.Question>With opt-in divider</EtPoll.Question>
                <EtPoll.OptionsList>
                  {mockAnswers.map((answer) => (
                    <EtPoll.VotableOption key={answer.id} answerId={answer.id} />
                  ))}
                </EtPoll.OptionsList>
                <EtPoll.FooterDivider />
                <EtPoll.FooterContent>
                  <EtPoll.VoteCount />
                </EtPoll.FooterContent>
              </EtPoll.Frame>
            </EtPoll>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtPoll } from 'etoro-ui';

// Minimal - no footer at all
<EtPoll answers={answers} voteCount={50}>
  <EtPoll.Frame>
    <EtPoll.Question>Quick poll</EtPoll.Question>
    <EtPoll.OptionsList>
      {answers.map((a) => (
        <EtPoll.VotableOption key={a.id} answerId={a.id} />
      ))}
    </EtPoll.OptionsList>
  </EtPoll.Frame>
</EtPoll>

// Opt-in divider - only when design explicitly calls for it
<EtPoll answers={answers} voteCount={100}>
  <EtPoll.Frame>
    <EtPoll.Question>With opt-in divider</EtPoll.Question>
    <EtPoll.OptionsList>
      {answers.map((a) => (
        <EtPoll.VotableOption key={a.id} answerId={a.id} />
      ))}
    </EtPoll.OptionsList>
    <EtPoll.FooterDivider />
    <EtPoll.FooterContent>
      <EtPoll.VoteCount />
    </EtPoll.FooterContent>
  </EtPoll.Frame>
</EtPoll>`}
        />
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
        <SubTitle>EtPoll (Provider)</SubTitle>
        <Desc>Root component that provides context to all subcomponents and manages poll state.</Desc>
        <PropsTable
          data={[
            {
              prop: 'answers',
              type: 'PollAnswer[]',
              default: '[]',
              description: 'Array of poll answer options (required)',
            },
            {
              prop: 'voteCount',
              type: 'number',
              default: '0',
              description: 'Total vote count',
            },
            {
              prop: 'selectedId',
              type: 'string',
              default: '-',
              description: 'Currently selected answer ID (controlled)',
            },
            {
              prop: 'onVote',
              type: '(answerId: string) => void',
              default: '-',
              description: 'Callback when answer is selected',
            },
            {
              prop: 'onUndo',
              type: '() => void',
              default: '-',
              description: 'Callback when undo is pressed',
            },
            {
              prop: 'avatarUrls',
              type: 'string[]',
              default: '[]',
              description: 'Array of avatar URLs (max 3 shown)',
            },
            {
              prop: 'additionalVotersCount',
              type: 'number',
              default: '0',
              description: 'Count of additional voters not shown',
            },
            {
              prop: 'question',
              type: 'string',
              default: '-',
              description: 'Question text (if not using EtPoll.Question)',
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Compound components (required)',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPoll.Frame</SubTitle>
        <Desc>Container with card styling: flat translucent `cardDefault` overlay, `X4` rounded corners, `X5` padding/gap. No shadow per Figma.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Poll content',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Optional style override',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test identifier',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPoll.Question</SubTitle>
        <Desc>
          Displays the poll question. Wrapped in `EtReadMoreText` so long questions are truncated with a Show More/Less affordance. Uses
          `label-primary-semibold` typography (Figma "Label/Primary/Semi-bold", 16/600/20).
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Question text (string)',
            },
            {
              prop: 'maxLines',
              type: 'number',
              default: '4',
              description: 'Max visible lines before "Show more" truncation',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPoll.OptionsList</SubTitle>
        <Desc>Container for poll options with proper spacing (gap: X4).</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Poll option components',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPoll.VotableOption</SubTitle>
        <Desc>
          Answer option button for before voting state. Translucent pill — bg = {'`${carbon900}14`'} (theme-aware ~8% black overlay) with `carbon900`
          text. Geometry: `paddingVertical: X2`, `paddingHorizontal: X5`, `borderRadius: X9`; typography: `body-secondary-medium` (14 / weight 500).
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'answerId',
              type: 'string',
              default: '-',
              description: 'ID of the answer to display (required)',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test identifier',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPoll.ResultOption</SubTitle>
        <Desc>
          Answer option for after voting state. Animated progress fill (`scaleX` 0 → vote share, growing from the leading edge) plus integer
          percentage. Selected option uses a `primary600` fill with a `carbon050` label and `verdictPositive600` percentage; unselected uses the
          translucent {'`${carbon900}14`'} fill with `carbon900` text. No checkmark — selection is communicated by fill color alone.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'answerId',
              type: 'string',
              default: '-',
              description: 'ID of the answer to display (required)',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test identifier',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPoll.VoteCount</SubTitle>
        <Desc>Displays total vote count with proper pluralization.</Desc>
        <PropsTable data={[]} />
      </Section>

      <Section>
        <SubTitle>EtPoll.VoterAvatars</SubTitle>
        <Desc>Displays up to 3 voter avatars with additional count text. Hides if no voters.</Desc>
        <PropsTable data={[]} />
      </Section>

      <Section>
        <SubTitle>EtPoll.UndoButton</SubTitle>
        <Desc>Button to undo vote. Calls onUndo callback from provider. Shows green text.</Desc>
        <PropsTable data={[]} />
      </Section>

      <Section>
        <SubTitle>EtPoll.FooterDivider</SubTitle>
        <Desc>
          Horizontal separator above footer (1px border-top). Opt-in — not part of the canonical Feed 2026 layout (PE-904). Include it only when the
          design explicitly calls for a divider.
        </Desc>
        <PropsTable data={[]} />
      </Section>

      <Section>
        <SubTitle>EtPoll.FooterContent</SubTitle>
        <Desc>Container for footer items with horizontal flex layout (space-between).</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Footer content',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>PollAnswer Interface</SubTitle>
        <Desc>Shape of answer objects in the answers array.</Desc>
        <PropsTable
          data={[
            {
              prop: 'id',
              type: 'string',
              default: '-',
              description: 'Unique answer identifier',
            },
            {
              prop: 'value',
              type: 'string',
              default: '-',
              description: 'Answer text',
            },
            {
              prop: 'votes',
              type: 'number',
              default: '-',
              description: 'Vote count (optional)',
            },
            {
              prop: 'percentage',
              type: 'number',
              default: '-',
              description: 'Pre-calculated percentage (optional, calculated from votes if not provided)',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
