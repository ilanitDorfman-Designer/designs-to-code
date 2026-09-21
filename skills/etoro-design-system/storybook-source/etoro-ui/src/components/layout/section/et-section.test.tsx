import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { EtSection } from './et-section';

// Mock useEtoroTheme
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#1a1a1a',
      bgNeutralPrimary: '#ffffff',
    },
  }),
}));

// Mock EtSelect
jest.mock('../../controls/select/et-select', () => {
  const MockSelect = ({ children, onPress, testID }: any) => {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable onPress={onPress} testID={testID}>
        <Text>{children}</Text>
      </Pressable>
    );
  };
  MockSelect.Label = ({ children }: any) => children;
  MockSelect.Value = ({ children }: any) => children;
  MockSelect.LeadingContent = ({ children }: any) => children;
  return { EtSelect: MockSelect };
});

// Mock EtChipsGroupV2
jest.mock('../../controls/chips-group-v2/et-chips-group-v2', () => ({
  EtChipsGroupV2: ({ items, testID }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID}>
        {items?.map((item: any) => (
          <Text key={item.id}>{item.label}</Text>
        ))}
      </View>
    );
  },
}));

// Mock EtPagination
jest.mock('../../navigation/pagination/et-pagination', () => ({
  EtPagination: ({ totalPages, size, color, testID }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID}>
        <Text>{`${totalPages} pages`}</Text>
        <Text testID="pagination-size">{size}</Text>
        <Text testID="pagination-color">{color}</Text>
      </View>
    );
  },
}));

describe('EtSection', () => {
  describe('Basic Rendering', () => {
    it('renders with static title', () => {
      render(
        <EtSection testID="section">
          <EtSection.Title testID="title">
            <Text>Test Title</Text>
          </EtSection.Title>
        </EtSection>,
      );

      expect(screen.getByTestId('section')).toBeTruthy();
      expect(screen.getByTestId('title')).toBeTruthy();
      expect(screen.getByText('Test Title')).toBeTruthy();
    });

    it('renders with shorthand title prop', () => {
      render(
        <EtSection title="Shorthand Title" testID="section">
          <View testID="content">
            <Text>Content</Text>
          </View>
        </EtSection>,
      );

      expect(screen.getByText('Shorthand Title')).toBeTruthy();
      expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('renders content children', () => {
      render(
        <EtSection>
          <EtSection.Title>
            <Text>Title</Text>
          </EtSection.Title>
          <EtSection.Content testID="content">
            <Text>Test Content</Text>
          </EtSection.Content>
        </EtSection>,
      );

      expect(screen.getByTestId('content')).toBeTruthy();
      expect(screen.getByText('Test Content')).toBeTruthy();
    });
  });

  describe('SelectTitle', () => {
    it('renders select title with pressable behavior', () => {
      const onPress = jest.fn();

      render(
        <EtSection>
          <EtSection.SelectTitle text="Select Option" onPress={onPress} testID="select-title" />
        </EtSection>,
      );

      expect(screen.getByTestId('select-title')).toBeTruthy();
      expect(screen.getByText('Select Option')).toBeTruthy();
    });

    it('calls onPress when select title is pressed', () => {
      const onPress = jest.fn();

      render(
        <EtSection>
          <EtSection.SelectTitle text="Select Option" onPress={onPress} testID="select-title" />
        </EtSection>,
      );

      fireEvent.press(screen.getByTestId('select-title'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Compound Components', () => {
    it('renders title and content together', () => {
      render(
        <EtSection testID="section">
          <EtSection.Title testID="title">
            <Text>Section Title</Text>
          </EtSection.Title>
          <EtSection.Content testID="content">
            <Text>Section Content</Text>
          </EtSection.Content>
        </EtSection>,
      );

      expect(screen.getByTestId('section')).toBeTruthy();
      expect(screen.getByTestId('title')).toBeTruthy();
      expect(screen.getByTestId('content')).toBeTruthy();
    });
  });

  describe('Chips Subcomponent', () => {
    it('renders chips with correct props', () => {
      const items = [
        { id: '1', label: 'Chip 1' },
        { id: '2', label: 'Chip 2' },
      ];

      render(
        <EtSection>
          <EtSection.Title>
            <Text>Title</Text>
          </EtSection.Title>
          <EtSection.Chips items={items} selectionMode="single" value="1" onChange={() => {}} testID="chips" />
        </EtSection>,
      );

      expect(screen.getByTestId('chips')).toBeTruthy();
      expect(screen.getByText('Chip 1')).toBeTruthy();
      expect(screen.getByText('Chip 2')).toBeTruthy();
    });
  });

  describe('Pagination Subcomponent', () => {
    it('renders pagination with correct props and section defaults', () => {
      render(
        <EtSection>
          <EtSection.Title>
            <Text>Title</Text>
          </EtSection.Title>
          <EtSection.Pagination totalPages={5} currentPage={0} testID="pagination" />
        </EtSection>,
      );

      expect(screen.getByTestId('pagination')).toBeTruthy();
      expect(screen.getByText('5 pages')).toBeTruthy();
      expect(screen.getByTestId('pagination-size')).toHaveTextContent('small');
      expect(screen.getByTestId('pagination-color')).toHaveTextContent('neutral');
    });

    it('renders pagination with SharedValue currentPage', () => {
      const mockSharedValue = { value: 2, get: () => 2, set: () => {} };

      render(
        <EtSection>
          <EtSection.Title>
            <Text>Title</Text>
          </EtSection.Title>
          <EtSection.Pagination totalPages={5} currentPage={mockSharedValue as any} testID="pagination-shared" />
        </EtSection>,
      );

      expect(screen.getByTestId('pagination-shared')).toBeTruthy();
    });
  });

  describe('Context', () => {
    it('provides theme colors to title subcomponent', () => {
      // Title component uses context to get textColor
      // If context is not provided, it would throw an error
      expect(() => {
        render(
          <EtSection>
            <EtSection.Title>
              <Text>Title with Context</Text>
            </EtSection.Title>
          </EtSection>,
        );
      }).not.toThrow();
    });

    it('throws error when Title is used outside EtSection', () => {
      // Suppress console.error for expected error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(
          <EtSection.Title>
            <Text>Orphan Title</Text>
          </EtSection.Title>,
        );
      }).toThrow('EtSection compound components must be used within an EtSection component');

      consoleSpy.mockRestore();
    });
  });
});
