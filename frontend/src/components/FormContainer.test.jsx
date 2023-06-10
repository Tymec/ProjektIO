import { render, screen } from '@testing-library/react';
import FormContainer from './FormContainer';

describe('FormContainer Component Tests', () => {
  test('renders children correctly', () => {
    render(
      <FormContainer>
        <div>Test Child</div>
      </FormContainer>
    );

    const childElement = screen.getByText(/Test Child/i);
    expect(childElement).toBeInTheDocument();
  });
});
