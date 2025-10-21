module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/**/*.spec.js',
    '!lib/**/*.test.js'
  ],
  testMatch: [
    '**/test/**/*.spec.js',
    '**/test/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  testTimeout: 10000,
  verbose: true
};
