const resolve = require('./resolve');

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:import/errors'],
  plugins: ['compat', 'prefer-object-spread', 'import'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': [
          './webpack.config.js',
        ],
      },
    ],
    'prefer-promise-reject-errors': ['off'],
    'prefer-destructuring': ['off'],
    'react/jsx-no-bind': ['error', {
      ignoreRefs: false,
      allowArrowFunctions: false,
      allowFunctions: false,
      allowBind: false,
    }],
    'react/jsx-handler-names': ['error', {
      eventHandlerPrefix: 'on',
      eventHandlerPropPrefix: 'on',
    }],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-key': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/default-props-match-prop-types': ['error', {
      allowRequiredDefaults: false,
    }],
    'react/sort-prop-types': ['error', {
      ignoreCase: true,
      callbacksLast: true,
      requiredFirst: true,
    }],
    'react/jsx-sort-props': ['error', {
      ignoreCase: true,
      callbacksLast: true,
      shorthandFirst: true,
      shorthandLast: false,
      noSortAlphabetically: true,
      reservedFirst: false,
    }],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'jsx-a11y/interactive-supports-focus': ['off'],
    'compat/compat': 'error',
    'prefer-object-spread/prefer-object-spread': 'error',
  },
  env: {
    browser: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve,
        }
      }
    },
    polyfills: [
      'fetch',
      'promises',
    ],
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  }
};