import { fireEvent, render, waitFor } from '@testing-library/react';

import { StoreProviderWrapper } from '../testUtils';
import ChatBox from './ChatBox';

describe('ChatBox Component Tests', () => {
  test('', () => {
    const { getByText } = render(
      <StoreProviderWrapper>
        <ChatBox />
      </StoreProviderWrapper>
    );

    const text = getByText('Open chat');
    expect(text).toBeInTheDocument();
  });

  test('opens chat', async () => {
    const { getByText } = render(
      <StoreProviderWrapper>
        <ChatBox />
      </StoreProviderWrapper>
    );

    const input = getByText('Open chat');
    fireEvent.click(input);

    await waitFor(() => {
      expect(input.value).toBe('');

      const sendButton = getByText('Send');
      const resetButton = getByText('Reset');

      expect(sendButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });
  });
});
