import { configureStore } from '@reduxjs/toolkit';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

import { api } from './features';
import { server } from './mock/server';
import storeConfig from './store';

const store = configureStore(storeConfig);

expect.extend(matchers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
  store.dispatch(api.util.resetApiState());
});
