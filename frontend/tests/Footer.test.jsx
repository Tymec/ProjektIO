import 'jest-localstorage-mock';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Footer from '../src/components/Footer';
import React from 'react';



describe('Footer', () => {
  const store = configureStore({ reducer: {} });

  test('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    const input = getByPlaceholderText('Newsletter');
    expect(input).toBeInTheDocument();
  });

  test('handles email input change', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    const input = getByPlaceholderText('Newsletter');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

  test('handles form submission', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <Provider store={store}>
        <Footer />
      </Provider>
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
