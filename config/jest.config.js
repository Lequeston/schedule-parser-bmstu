module.exports = {
  roots: ['../spec'],
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  preset: 'ts-jest'
};