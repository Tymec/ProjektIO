import { render, screen } from '@testing-library/react';

import { FullProviderWrapper } from '../testUtils';
import Header from './Header';

describe('Header Component Tests', () => {
  test('renders Navbar.Brand with correct text', () => {

    render(
        <FullProviderWrapper route="/">
          <Header />
        </FullProviderWrapper>
    );

    const navbarBrand = screen.getByRole('link', { name: /PromptWorld/i });
    expect(navbarBrand).toBeInTheDocument();
  });
});
