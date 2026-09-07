import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.base-react.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // UI components use console.warn/error for runtime validation (like React propTypes).
      // They must not depend on LoggerService (infra layer).
      // All console calls must be guarded with `if (__DEV__)` to prevent production output.
      'no-console': ['error', { allow: ['warn', 'error', 'debug', 'trace'] }],
    },
  },
];
