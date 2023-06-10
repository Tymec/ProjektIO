import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SearchBox from '../src/components/SearchBox';
import { useNavigate } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

test('renders correctly and checks navigation on submit', () => {
  const { getByRole } = render(
    <Router>
      <SearchBox />
    </Router>
  );

  const input = getByRole('textbox');
  const button = getByRole('button');

  expect(button).toBeDisabled();

  fireEvent.change(input, { target: { value: 'test' } });

  expect(button).not.toBeDisabled();

  fireEvent.click(button);

  expect(mockNavigate).toHaveBeenCalledWith('/?search=test&page=1');
});

afterEach(() => {
  jest.resetAllMocks();
});
