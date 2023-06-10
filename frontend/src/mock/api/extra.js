import { rest } from 'msw';

const handlers = [
  rest.post('*/api/extra/newsletter/subscribe/', (req, res, ctx) => {
    return res(ctx.status(204), ctx.json(), ctx.delay(150));
  })
];

export default handlers;
