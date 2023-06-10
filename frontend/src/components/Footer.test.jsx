import { fireEvent, render, waitFor } from '@testing-library/react';

import { StoreProviderWrapper } from '../testUtils';
import Footer from './Footer';

describe('Footer', () => {
  test('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <StoreProviderWrapper>
        <Footer />
      </StoreProviderWrapper>
    );
    const input = getByPlaceholderText('Newsletter');
    expect(input).toBeInTheDocument();
  });

  test('handles email input change', () => {
    const { getByPlaceholderText } = render(
      <StoreProviderWrapper>
        <Footer />
      </StoreProviderWrapper>
    );
    const input = getByPlaceholderText('Newsletter');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

  test('handles form submission', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <StoreProviderWrapper>
        <Footer />
      </StoreProviderWrapper>
    );
    const input = getByPlaceholderText('Newsletter');
    const button = getByRole('button', { name: /Subscribe/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
