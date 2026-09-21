import '@etoro/common/testing/react';

// Mock the local useEtoroTheme hook so components importing via relative paths
// get proper eToro color tokens instead of bare React Navigation DefaultTheme.
jest.mock('./core/hooks/use-etoro-theme');
jest.mock('expo-video', () => ({
  useVideoPlayer: jest.fn(() => ({})),
  VideoView: 'VideoView',
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: jest.fn((fn: () => void) => fn()),
}));
