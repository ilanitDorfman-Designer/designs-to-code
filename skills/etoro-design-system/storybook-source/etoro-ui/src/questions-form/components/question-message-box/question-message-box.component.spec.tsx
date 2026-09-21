import { render } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { QuestionsFormTextProvider } from '../../contexts/questions-form-text.context';
import { QuestionMessageBox } from './question-message-box.component';

jest.mock('../../../foundations/text/et-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtText: ({ children, ...rest }: { children?: React.ReactNode }) => React.createElement(Text, rest, children),
  };
});

const mockColors = {
  bgOrangeTertiary: '#FFF3E0',
  statusOrange: '#FF9800',
  bgNeutralNegative: '#FFEBEE',
  statusNegative: '#F44336',
  textPrimaryNeutral: '#FFFFFF',
  textSecondaryNeutral: '#888888',
};

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({ colors: mockColors }),
}));

jest.mock('../../../components/et-icon-v2', () => {
  const { View } = require('react-native');
  return {
    EtIconV2: ({ name, testID }: { name: string; testID?: string }) => <View testID={testID ?? `icon-${name}`} accessibilityLabel={`icon-${name}`} />,
  };
});

function findStyleInTree(node: unknown, key: string): unknown {
  if (!node || typeof node !== 'object') return undefined;
  const n = node as { props?: { style?: unknown; children?: unknown } };
  const style = n.props?.style;
  if (style) {
    const flat = StyleSheet.flatten(style);
    if (flat && typeof flat === 'object' && key in flat) {
      return (flat as Record<string, unknown>)[key];
    }
  }
  const children = n.props?.children;
  if (children == null) return undefined;
  const childArr = Array.isArray(children) ? children : [children];
  for (const child of childArr) {
    const found = findStyleInTree(child, key);
    if (found !== undefined) return found;
  }
  return undefined;
}

describe('QuestionMessageBox', () => {
  describe('GIVEN info type message', () => {
    it('WHEN rendered, THEN it displays the info text', () => {
      const { getByText } = render(<QuestionMessageBox message={{ message: 'Info text', type: 'info' }} />);
      expect(getByText('Info text')).toBeTruthy();
    });
  });

  describe('GIVEN warning message', () => {
    it('WHEN rendered, THEN orange text color is used', () => {
      const { getByText } = render(<QuestionMessageBox message={{ message: 'Warning text', type: 'warning' }} />);
      const warningText = getByText('Warning text');
      expect(warningText).toBeTruthy();
      const flat = StyleSheet.flatten(warningText.props.style);
      expect(flat?.color).toBe(mockColors.statusOrange);
    });
  });

  describe('GIVEN error message', () => {
    it('WHEN rendered, THEN red text color is used', () => {
      const { getByText } = render(<QuestionMessageBox message={{ message: 'Error text', type: 'error' }} />);
      const errorText = getByText('Error text');
      expect(errorText).toBeTruthy();
      const flat = StyleSheet.flatten(errorText.props.style);
      expect(flat?.color).toBe(mockColors.statusNegative);
    });
  });

  describe('GIVEN message with border', () => {
    it('WHEN rendered, THEN border color follows message type (default uses transparent outline)', () => {
      const { getByText, toJSON } = render(<QuestionMessageBox message={{ message: 'Bordered message', border: true }} />);
      expect(getByText('Bordered message')).toBeTruthy();
      const tree = toJSON() as { props?: { style?: unknown }; children?: unknown[] };
      expect(findStyleInTree(tree, 'borderColor')).toBe('transparent');
    });

    it('WHEN warning is bordered, THEN text color stays neutral', () => {
      const { getByText } = render(<QuestionMessageBox message={{ message: 'Bordered warning', type: 'warning', border: true }} />);
      const flat = StyleSheet.flatten(getByText('Bordered warning').props.style);
      expect(flat?.color).toBe(mockColors.textPrimaryNeutral);
    });

    it('WHEN error is bordered, THEN text color stays neutral', () => {
      const { getByText } = render(<QuestionMessageBox message={{ message: 'Bordered error', type: 'error', border: true }} />);
      const flat = StyleSheet.flatten(getByText('Bordered error').props.style);
      expect(flat?.color).toBe(mockColors.textPrimaryNeutral);
    });
  });

  describe('GIVEN message with icon', () => {
    it('WHEN rendered, THEN icon is displayed', () => {
      const { getByText, getByLabelText } = render(<QuestionMessageBox message={{ message: 'Message with icon', icon: 'info' }} />);
      expect(getByText('Message with icon')).toBeTruthy();
      expect(getByLabelText('icon-info')).toBeTruthy();
    });
  });

  describe('GIVEN centered message', () => {
    it('WHEN rendered, THEN text is center aligned', () => {
      const { getByText } = render(<QuestionMessageBox message={{ message: 'Centered message', type: 'info' }} centered />);
      const flat = StyleSheet.flatten(getByText('Centered message').props.style);
      expect(flat?.textAlign).toBe('center');
    });
  });

  describe('GIVEN a rich-node resolver is provided', () => {
    it('WHEN rendered, THEN the resolved node is shown instead of the raw key', () => {
      const resolver = {
        resolveText: (key: string | undefined) => key ?? '',
        resolveNode: (key: string | undefined) => <Text testID="rich-node">{`resolved:${key}`}</Text>,
      };
      const { getByTestId, queryByText } = render(
        <QuestionsFormTextProvider resolver={resolver}>
          <QuestionMessageBox message={{ message: 'tradingExCrypto.optionsDisclaimer', type: 'info' }} />
        </QuestionsFormTextProvider>,
      );
      expect(getByTestId('rich-node')).toBeTruthy();
      expect(queryByText('tradingExCrypto.optionsDisclaimer')).toBeNull();
    });
  });
});
