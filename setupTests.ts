import '@testing-library/jest-dom';

// Mock IntersectionObserver for Framer Motion
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// This file is used to configure and set up the testing environment before each test.
export {};