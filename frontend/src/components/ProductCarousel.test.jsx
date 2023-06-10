import { render } from '@testing-library/react';

import { FullProviderWrapper } from '../testUtils';
import ProductCarousel from './ProductCarousel';

test('renders ProductCarousel component', async () => {
  const { findByText, getByAltText } = render(
    <FullProviderWrapper route="/">
        <ProductCarousel />
    </FullProviderWrapper>
  );

  // Expect loading to be visible and products to be loaded
  expect(await findByText('Product 1 ($10)')).toBeInTheDocument();
  expect(await findByText('Product 2 ($20)')).toBeInTheDocument();

  // Check if images have correct alt attributes
  expect(getByAltText('Product 1')).toBeInTheDocument();
  expect(getByAltText('Product 2')).toBeInTheDocument();
});
