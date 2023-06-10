import { render, screen } from '@testing-library/react';

import Message from './Message';

describe('Message Component Tests', () => {
  test('renders alert with correct variant and children', () => {
    const variant = 'danger';
    const children = 'Error Message';

    render(<Message variant={variant}>{children}</Message>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass(`alert-${variant}`);
    expect(alert).toHaveTextContent(children);
  });
});
