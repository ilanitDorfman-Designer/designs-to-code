import { StyleSheet } from 'react-native';
import { EtTableColumn } from '../../api/types';

// Mock columns for testing
export const mockColumns: EtTableColumn[] = [
  { name: 'name', title: 'Name', visible: true, width: 40 },
  {
    name: 'price',
    title: 'Price',
    visible: true,
    width: 30,
  },
  {
    name: 'change',
    title: 'Change',
    visible: true,
    width: 30,
  },
];

// Extended mock columns for main table tests
export const mockColumnsExtended: EtTableColumn[] = [
  { name: 'name', title: 'Name', visible: true, width: 30 },
  {
    name: 'price',
    title: 'Price',
    visible: true,
    width: 25,
  },
  {
    name: 'change',
    title: 'Change',
    visible: true,
    width: 25,
  },
  {
    name: 'volume',
    title: 'Volume',
    visible: false,
    width: 20,
  },
];

// Mock data for testing
export const mockData = [
  { id: '1', name: 'Apple Inc.', price: '$150.00', change: '+2.5%' },
  { id: '2', name: 'Google Inc.', price: '$2800.00', change: '-1.2%' },
  { id: '3', name: 'Microsoft Corp.', price: '$350.00', change: '+0.8%' },
];

// Extended mock data for main table tests
export const mockDataExtended = [
  { id: '1', name: 'Apple', price: '$150.00', change: '+2.5%', volume: '1M' },
  {
    id: '2',
    name: 'Google',
    price: '$2800.00',
    change: '-1.2%',
    volume: '500K',
  },
  {
    id: '3',
    name: 'Microsoft',
    price: '$350.00',
    change: '+0.8%',
    volume: '750K',
  },
];

// Single mock item for row testing
export const mockItem = {
  id: '1',
  name: 'Apple Inc.',
  price: '150.00',
  change: '2.5',
};

// Mock table configuration factory function
export const createMockTableConfig = () => ({
  visibleColumns: mockColumns,
  keyExtractor: (item: { id?: string }, index: number) => item.id || index.toString(),
});

// Test styles
export const testStyles = StyleSheet.create({
  rowStyle: {
    paddingVertical: 8,
  },
});
