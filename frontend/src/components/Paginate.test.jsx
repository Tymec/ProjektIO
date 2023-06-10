import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Paginate from './Paginate';

describe('Paginate Component Tests', () => {
  test('renders correct number of pagination items', async () => {
    const { findAllByRole } = render(
      <Router>
        <Paginate pages={5} page={1} path="/example/path" />
      </Router>
    );

    const items = await findAllByRole('listitem');

    expect(items.length).toBe(5);
  });
});
