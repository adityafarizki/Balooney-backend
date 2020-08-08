module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/lib/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  setupFiles: ["jest-plugin-context/setup"],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: [
    "src/*.ts",
    "src/**/*",
    "!src/tests"
  ]
};