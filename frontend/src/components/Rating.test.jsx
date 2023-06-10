import { render } from '@testing-library/react';

import Rating from './Rating';

describe('Rating', () => {
  test('renders correctly with no half stars', () => {
    const { container } = render(<Rating value={5} color="#f0c040" />);
    expect(container.querySelectorAll('.fas.fa-star')).toHaveLength(5);
    expect(container.querySelectorAll('.fas.fa-star-half-alt')).toHaveLength(0);
  });

  test('renders correctly with a half star', () => {
    const { container } = render(<Rating value={4.5} color="#f0c040" />);
    expect(container.querySelectorAll('.fas.fa-star')).toHaveLength(4);
    expect(container.querySelectorAll('.fas.fa-star-half-alt')).toHaveLength(1);
  });

  test('renders correctly with text', () => {
    const { getByText } = render(<Rating value={5} text="Test text" color="#f0c040" />);
    expect(getByText('Test text')).toBeInTheDocument();
  });

  test('renders correctly with custom color', () => {
    const { container } = render(<Rating value={5} color="#123456" />);
    const stars = container.querySelectorAll('.fas.fa-star');
    stars.forEach((star) => {
      expect(star).toHaveStyle({ color: '#123456' });
    });
  });
});
