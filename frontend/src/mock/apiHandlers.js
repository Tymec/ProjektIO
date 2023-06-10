import { default as extraHandlers } from './api/extra';
import { default as productHandlers } from './api/product';

const handlers = [...productHandlers, ...extraHandlers];

export default handlers;
