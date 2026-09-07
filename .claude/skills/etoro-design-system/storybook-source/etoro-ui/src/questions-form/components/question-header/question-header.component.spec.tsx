import { render } from '@testing-library/react-native';

import { QuestionsFormTextProvider } from '../../contexts';
import { QuestionHeader } from './question-header.component';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#FFFFFF',
      textSecondaryNeutral: '#888888',
      bgGreyTertiary: '#333333',
    },
  }),
}));

jest.mock('../../../foundations/text/et-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtText: ({ children, ...rest }: { children?: React.ReactNode }) => React.createElement(Text, rest, children),
  };
});

jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: ({ testID, ...rest }: { source?: { uri?: string }; testID?: string }) =>
      React.createElement(View, { testID: testID ?? 'mock-image', ...rest }),
  };
});

describe('QuestionHeader', () => {
  describe('GIVEN no props', () => {
    it('WHEN rendered, THEN returns null', () => {
      const { toJSON } = render(<QuestionHeader />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('GIVEN title prop', () => {
    it('WHEN rendered, THEN title text is displayed', () => {
      const { getByText } = render(<QuestionHeader title="My Title" />);
      expect(getByText('My Title')).toBeTruthy();
    });
  });

  describe('GIVEN img prop', () => {
    it('WHEN rendered, THEN image is rendered', () => {
      const { getByTestId } = render(<QuestionHeader img="https://example.com/image.png" />);
      expect(getByTestId('mock-image')).toBeTruthy();
    });
  });

  describe('GIVEN all props', () => {
    it('WHEN rendered, THEN all elements are present', () => {
      const { getByText, getByTestId } = render(
        <QuestionHeader title="Header Title" text="Main description" subText="Sub description" img="https://example.com/hero.png" />,
      );
      expect(getByText('Header Title')).toBeTruthy();
      expect(getByText('Main description')).toBeTruthy();
      expect(getByText('Sub description')).toBeTruthy();
      expect(getByTestId('mock-image')).toBeTruthy();
    });
  });

  describe('GIVEN QuestionsFormTextProvider with a custom resolver', () => {
    it('WHEN title, text, and subText are keys, THEN resolved strings are displayed', () => {
      const resolver = {
        resolveText: (key: string | undefined) => {
          const map: Record<string, string> = {
            'q.header.title': 'Resolved title',
            'q.header.text': 'Resolved body',
            'q.header.subText': 'Resolved subtitle',
          };
          return (key && map[key]) ?? key ?? '';
        },
      };

      const { getByText, queryByText } = render(
        <QuestionsFormTextProvider resolver={resolver}>
          <QuestionHeader title="q.header.title" text="q.header.text" subText="q.header.subText" />
        </QuestionsFormTextProvider>,
      );

      expect(getByText('Resolved title')).toBeTruthy();
      expect(getByText('Resolved body')).toBeTruthy();
      expect(getByText('Resolved subtitle')).toBeTruthy();
      expect(queryByText('q.header.title')).toBeNull();
      expect(queryByText('q.header.text')).toBeNull();
      expect(queryByText('q.header.subText')).toBeNull();
    });
  });
});
