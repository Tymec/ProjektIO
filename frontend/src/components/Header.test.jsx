import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import Header from './Header';

const mockStore = configureStore([]);

describe('Header Component Tests', () => {
  test('renders Navbar.Brand with correct text', () => {
    const store = mockStore({
      userState: { user: null }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    const navbarBrand = screen.getByRole('link', { name: /PromptWorld/i });
    expect(navbarBrand).toBeInTheDocument();
  });
});
