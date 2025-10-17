const { TextEncoder, TextDecoder } = require('util');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/*.test.{ts,tsx}',
    '**/__tests__/**/*.{ts,tsx}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.scss$': 'jest-css-modules-transform'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'scss'],
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!@testing-library)'
  ],
  globals: {
    TextEncoder,
    TextDecoder
  }
}