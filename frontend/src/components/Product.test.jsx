import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { StoreProviderWrapper } from '../testUtils';
import Product from './Product';

// Mock product data
const mockProduct = {
  _id: '123',
  title: 'Product Title',
  price: '9.99',
  image: 'product-image.jpg'
};

describe('Product', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <StoreProviderWrapper>
          <Product product={mockProduct} />
        </StoreProviderWrapper>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
