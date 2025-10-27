module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['text', 'lcov', 'html'],

  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/tests/integration/db_direct_query.test.js',
  ],
};
