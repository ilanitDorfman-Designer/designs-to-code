import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { EtFlatList } from './et-flat-list';
import { EtSectionList } from './et-section-list';

const ITEMS = [{ id: '1' }, { id: '2' }];
const SECTIONS = [{ title: 'a', data: ITEMS }];

const renderItem = ({ item }: { item: { id: string } }) => <Text>{item.id}</Text>;

describe('EtFlatList', () => {
  it('disables Android subview clipping by default', () => {
    const { getByTestId } = render(<EtFlatList testID="list" data={ITEMS} renderItem={renderItem} keyExtractor={(i) => i.id} />);

    expect(getByTestId('list').props.removeClippedSubviews).toBe(false);
  });

  it('renders its items', () => {
    const { getByText } = render(<EtFlatList testID="list" data={ITEMS} renderItem={renderItem} keyExtractor={(i) => i.id} />);

    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('lets a call site opt back in explicitly', () => {
    const { getByTestId } = render(
      <EtFlatList testID="list" data={ITEMS} renderItem={renderItem} keyExtractor={(i) => i.id} removeClippedSubviews />,
    );

    expect(getByTestId('list').props.removeClippedSubviews).toBe(true);
  });

  // RN resolves the flag as `removeClippedSubviews ?? Platform.OS === 'android'`, so forwarding an
  // explicit `undefined` lands back on `true` and re-opens the crash. Conditionally merged prop
  // bags produce exactly that.
  it('keeps clipping off when a caller passes undefined', () => {
    const { getByTestId } = render(
      <EtFlatList testID="list" data={ITEMS} renderItem={renderItem} keyExtractor={(i) => i.id} removeClippedSubviews={undefined} />,
    );

    expect(getByTestId('list').props.removeClippedSubviews).toBe(false);
  });

  it('forwards a ref to the underlying list', () => {
    const ref = { current: null } as { current: unknown };

    render(<EtFlatList ref={ref as never} testID="list" data={ITEMS} renderItem={renderItem} keyExtractor={(i) => i.id} />);

    expect(ref.current).not.toBeNull();
  });
});

describe('EtSectionList', () => {
  it('disables Android subview clipping by default', () => {
    const { getByTestId } = render(<EtSectionList testID="section-list" sections={SECTIONS} renderItem={renderItem} keyExtractor={(i) => i.id} />);

    expect(getByTestId('section-list').props.removeClippedSubviews).toBe(false);
  });

  it('renders its items', () => {
    const { getByText } = render(<EtSectionList testID="section-list" sections={SECTIONS} renderItem={renderItem} keyExtractor={(i) => i.id} />);

    expect(getByText('1')).toBeTruthy();
  });

  it('keeps clipping off when a caller passes undefined', () => {
    const { getByTestId } = render(
      <EtSectionList
        testID="section-list"
        sections={SECTIONS}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        removeClippedSubviews={undefined}
      />,
    );

    expect(getByTestId('section-list').props.removeClippedSubviews).toBe(false);
  });
});
