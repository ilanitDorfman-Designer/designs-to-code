import { fireEvent, render } from '@testing-library/react-native';
import { useState } from 'react';

import { PollAnswer } from './api';
import { EtPoll } from './et-poll';

// Mock theme hook
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      bgNeutralPrimary: '#FFFFFF',
      bgGreyTertiary: 'rgba(204,204,204,0.15)',
      bgGreySecondary: '#CCCCCC',
      bgActionBrand: '#33C728',
      bgGreyTransparentSecondary: 'rgba(204,204,204,0.3)',
      bgNeutralGreyQuaternary: '#E0E0E0',
      indicesPrimary: '#33C728',
      text: '#262626',
      textPrimaryNeutral: '#262626',
      textSecondary: '#808080',
      textSecondaryNeutral: '#808080',
      textInvertedPrimaryNeutral: '#FFFFFF',
      dividerPrimary: '#E0E0E0',
      shadowPrimary: '#000000',
      indicatorPositive: '#33C728',
    },
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) => {
      const translations: Record<string, string> = {
        'poll.voteCount_one': '{{count}} Vote',
        'poll.voteCount_other': '{{count}} Votes',
        'poll.otherVoters_one': '+{{count}} other voter',
        'poll.otherVoters_other': '+{{count}} other voters',
        'poll.undo': 'Undo',
        'poll.undoVoteAccessibility': 'Undo vote',
        'poll.pollAttachment': 'Poll attachment',
      };
      if (opts?.count !== undefined) {
        const pluralKey = opts.count === 1 ? `${key}_one` : `${key}_other`;
        const template = translations[pluralKey] ?? key;
        return template.replace('{{count}}', String(opts.count));
      }
      return translations[key] ?? key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock EtAvatar with subcomponents
jest.mock('etoro-ui', () => {
  const MockAvatar = ({ children }: any) => children;
  MockAvatar.Image = ({ _src }: any) => null;
  MockAvatar.Fallback = ({ children }: any) => children;

  return {
    EtAvatar: MockAvatar,
  };
});

const mockAnswers: PollAnswer[] = [
  { id: 'a1', value: 'Long-term' },
  { id: 'a2', value: 'Short-term' },
  { id: 'a3', value: 'Day trading' },
];

const mockAnswersWithVotes: PollAnswer[] = [
  { id: 'a1', value: 'Long-term', votes: 120 },
  { id: 'a2', value: 'Short-term', votes: 60 },
  { id: 'a3', value: 'Day trading', votes: 30 },
];

describe('EtPoll - Compound Component API', () => {
  it('renders with votable options before voting', () => {
    const { getByText, getByTestId } = render(
      <EtPoll answers={mockAnswers} voteCount={0}>
        <EtPoll.Frame>
          <EtPoll.Question>What's your investing style?</EtPoll.Question>
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
      </EtPoll>,
    );

    expect(getByText("What's your investing style?")).toBeTruthy();
    expect(getByText('Long-term')).toBeTruthy();
    expect(getByText('Short-term')).toBeTruthy();
    expect(getByText('Day trading')).toBeTruthy();
    expect(getByTestId('poll-vote-count')).toBeTruthy();
  });

  it('renders with result options after voting', () => {
    const { getByText, getByTestId } = render(
      <EtPoll answers={mockAnswersWithVotes} voteCount={210} selectedId="a1">
        <EtPoll.Frame>
          <EtPoll.Question>What's your investing style?</EtPoll.Question>
          <EtPoll.OptionsList>
            {mockAnswersWithVotes.map((answer) => (
              <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
            ))}
          </EtPoll.OptionsList>
          <EtPoll.FooterDivider />
          <EtPoll.FooterContent>
            <EtPoll.VoteCount />
          </EtPoll.FooterContent>
        </EtPoll.Frame>
      </EtPoll>,
    );

    // 120/210 = 57.142857...% -> 57%
    expect(getByText('57%')).toBeTruthy();
    // 60/210 = 28.571428...% -> 29%
    expect(getByText('29%')).toBeTruthy();
    // 30/210 = 14.285714...% -> 14%
    expect(getByText('14%')).toBeTruthy();
    expect(getByTestId('poll-vote-count')).toBeTruthy();
  });

  it('handles voting interaction', () => {
    const onVote = jest.fn();

    function TestComponent() {
      const [selectedId, setSelectedId] = useState<string | undefined>();

      const handleVote = (answerId: string) => {
        setSelectedId(answerId);
        onVote(answerId);
      };

      return (
        <EtPoll answers={mockAnswers} voteCount={0} selectedId={selectedId} onVote={handleVote}>
          <EtPoll.Frame>
            <EtPoll.Question>Question?</EtPoll.Question>
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
      );
    }

    const { getByText } = render(<TestComponent />);

    const option = getByText('Long-term');
    fireEvent.press(option);

    expect(onVote).toHaveBeenCalledWith('a1');
  });

  it('shows voter avatars and undo button', () => {
    const avatarUrls = ['https://example.com/avatar1.jpg', 'https://example.com/avatar2.jpg', 'https://example.com/avatar3.jpg'];
    const onUndo = jest.fn();

    const { getByText, getByTestId } = render(
      <EtPoll answers={mockAnswers} voteCount={25} selectedId="a1" avatarUrls={avatarUrls} additionalVotersCount={22} onUndo={onUndo}>
        <EtPoll.Frame>
          <EtPoll.Question>Question?</EtPoll.Question>
          <EtPoll.OptionsList>
            {mockAnswers.map((answer) => (
              <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
            ))}
          </EtPoll.OptionsList>
          <EtPoll.FooterDivider />
          <EtPoll.FooterContent>
            <EtPoll.VoterAvatars />
            <EtPoll.UndoButton />
          </EtPoll.FooterContent>
        </EtPoll.Frame>
      </EtPoll>,
    );

    expect(getByText('+22 other voters')).toBeTruthy();
    expect(getByTestId('poll-undo-button')).toBeTruthy();

    fireEvent.press(getByTestId('poll-undo-button'));
    expect(onUndo).toHaveBeenCalled();
  });

  it('does not surface NaN voters when voteCount is non-finite and additionalVotersCount is unset', () => {
    const avatarUrls = ['https://example.com/avatar1.jpg'];

    const { queryByText } = render(
      <EtPoll answers={mockAnswers} voteCount={NaN} selectedId="a1" avatarUrls={avatarUrls}>
        <EtPoll.Frame>
          <EtPoll.Question>Question?</EtPoll.Question>
          <EtPoll.OptionsList>
            {mockAnswers.map((answer) => (
              <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
            ))}
          </EtPoll.OptionsList>
          <EtPoll.FooterContent>
            <EtPoll.VoterAvatars />
          </EtPoll.FooterContent>
        </EtPoll.Frame>
      </EtPoll>,
    );

    expect(queryByText(/NaN/)).toBeNull();
    expect(queryByText(/other voter/)).toBeNull();
  });

  it('renders vote count with correct pluralization', () => {
    const { getByText, rerender } = render(
      <EtPoll answers={mockAnswers} voteCount={1}>
        <EtPoll.Frame>
          <EtPoll.Question>Question?</EtPoll.Question>
          <EtPoll.FooterContent>
            <EtPoll.VoteCount />
          </EtPoll.FooterContent>
        </EtPoll.Frame>
      </EtPoll>,
    );

    expect(getByText('1 Vote')).toBeTruthy();

    rerender(
      <EtPoll answers={mockAnswers} voteCount={5}>
        <EtPoll.Frame>
          <EtPoll.Question>Question?</EtPoll.Question>
          <EtPoll.FooterContent>
            <EtPoll.VoteCount />
          </EtPoll.FooterContent>
        </EtPoll.Frame>
      </EtPoll>,
    );

    expect(getByText('5 Votes')).toBeTruthy();
  });

  it('handles empty answers array without crashing', () => {
    const { getByText, getByTestId } = render(
      <EtPoll answers={[]} voteCount={0}>
        <EtPoll.Frame>
          <EtPoll.Question>Empty poll?</EtPoll.Question>
          <EtPoll.OptionsList />
          <EtPoll.FooterContent>
            <EtPoll.VoteCount />
          </EtPoll.FooterContent>
        </EtPoll.Frame>
      </EtPoll>,
    );

    expect(getByText('Empty poll?')).toBeTruthy();
    expect(getByTestId('poll-vote-count')).toBeTruthy();
  });

  it('calculates percentages when not provided', () => {
    const { getByText } = render(
      <EtPoll answers={mockAnswersWithVotes} voteCount={210} selectedId="a1">
        <EtPoll.Frame>
          <EtPoll.Question>Question?</EtPoll.Question>
          <EtPoll.OptionsList>
            {mockAnswersWithVotes.map((answer) => (
              <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
            ))}
          </EtPoll.OptionsList>
        </EtPoll.Frame>
      </EtPoll>,
    );

    // Component should calculate percentages from votes
    expect(getByText('57%')).toBeTruthy();
    expect(getByText('29%')).toBeTruthy();
    expect(getByText('14%')).toBeTruthy();
  });

  it('uses pre-calculated percentages when provided', () => {
    const answersWithPercentages: PollAnswer[] = [
      { id: 'a1', value: 'Option 1', percentage: 75 },
      { id: 'a2', value: 'Option 2', percentage: 25 },
    ];

    const { getByText } = render(
      <EtPoll answers={answersWithPercentages} voteCount={100} selectedId="a1">
        <EtPoll.Frame>
          <EtPoll.Question>Question?</EtPoll.Question>
          <EtPoll.OptionsList>
            {answersWithPercentages.map((answer) => (
              <EtPoll.ResultOption key={answer.id} answerId={answer.id} />
            ))}
          </EtPoll.OptionsList>
        </EtPoll.Frame>
      </EtPoll>,
    );

    expect(getByText('75%')).toBeTruthy();
    expect(getByText('25%')).toBeTruthy();
  });
});
