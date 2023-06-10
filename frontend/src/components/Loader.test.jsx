import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component Tests', () => {
  test('renders spinner with correct properties', () => {
    render(<Loader />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-border');

    const srOnlySpan = screen.getByText('Loading...');
    expect(srOnlySpan).toHaveClass('sr-only');
  });
});
