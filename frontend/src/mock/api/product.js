import { rest } from 'msw';

const handlers = [
  rest.get('*/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        pagination: {
          page: 1,
          pages: 1
        },
        results: [
          {
            _id: '1',
            name: 'Product 1',
            price: 10,
            image: 'image-url-1'
          },
          {
            _id: '2',
            name: 'Product 2',
            price: 20,
            image: 'image-url-2'
          }
        ]
      }),
      ctx.delay(30)
    );
  })
];

export default handlers;
