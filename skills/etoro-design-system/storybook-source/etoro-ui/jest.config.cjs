module.exports = {
  ...require('../../jest-react.preset.cjs'),
  displayName: 'ui',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/etoro-ui',
};
