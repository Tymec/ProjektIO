import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import ProductCarousel from '../src/components/ProductCarousel';

const queryClient = new QueryClient();

test('renders ProductCarousel component', async () => {
  const mockData = {
    products: [
      {
        _id: '1',
        name: 'Product 1',
        price: 10,
        image: 'image-url-1',
      },
      {
        _id: '2',
        name: 'Product 2',
        price: 20,
        image: 'image-url-2',
      },
    ],
  };

  jest.spyOn(window, 'fetch').mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockData),
    })
  );

  const { findByText, getByAltText } = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProductCarousel />
      </MemoryRouter>
    </QueryClientProvider>
  );

  // Expect loading to be visible and products to be loaded
  expect(await findByText('Loading...')).toBeInTheDocument();
  expect(await findByText('Product 1 ($10)')).toBeInTheDocument();
  expect(await findByText('Product 2 ($20)')).toBeInTheDocument();

  // Check if images have correct alt attributes
  expect(getByAltText('Product 1')).toBeInTheDocument();
  expect(getByAltText('Product 2')).toBeInTheDocument();
});
