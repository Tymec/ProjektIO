import { fireEvent, render } from '@testing-library/react';

import { FullProviderWrapper } from '../testUtils';
import SearchBox from './SearchBox';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

test('renders correctly and checks navigation on submit', () => {
  const { getByTestId } = render(
    <FullProviderWrapper route="/">
      <SearchBox />
    </FullProviderWrapper>
  );

  const input = getByTestId('search-box-input');
  const button = getByTestId('search-box-submit');

  expect(button).toBeDisabled();

  fireEvent.change(input, { target: { value: 'test' } });

  expect(button).not.toBeDisabled();

  fireEvent.click(button);

  expect(mockNavigate).toHaveBeenCalledWith('/?search=test&page=1');
});

afterEach(() => {
  vi.resetAllMocks();
});
