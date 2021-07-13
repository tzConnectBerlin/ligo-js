module.exports = function() {
  return {
    clearMocks: true,
    coverageReporters: ['lcov'],
    collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.{d.ts}'],
  };
};
