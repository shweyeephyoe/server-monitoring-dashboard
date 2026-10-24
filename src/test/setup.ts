// Runs before every test file.
import '@testing-library/jest-dom/vitest'; // adds matchers like toBeInTheDocument()
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Remove rendered components between tests so they don't affect each other.
afterEach(() => {
  cleanup();
});

// jsdom (the fake browser used in tests) has no ResizeObserver, which the
// chart library needs. This minimal stand-in is enough for tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
