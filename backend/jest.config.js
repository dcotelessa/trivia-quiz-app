module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/server.ts',
    '!**/node_modules/**',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
}
