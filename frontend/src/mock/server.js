import { setupServer } from 'msw/node';

import extraHandlers from './api/extra';
import productHandlers from './api/product';

const handlers = [...productHandlers, ...extraHandlers];

export const server = setupServer(...handlers);
