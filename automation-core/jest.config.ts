module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // Ensure we can find the files
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/*.test.ts'], // Only look for .ts test files
  transform: { '^.+\\.tsx?$': 'ts-jest'   },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Critical: Ignore compiled files
  reporters: [
    "default",
    ["jest-html-reporter", {
      "outputPath": "./output/unit-test-results.html",
      "pageTitle": "Hybrid Automation Engine Unit Test Report",
      "includeFailureMsg": true,
      "includeConsoleLog": true
    }]
  ]
};