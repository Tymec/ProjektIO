import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import storeConfig from '../store';

import ChatBox from './ChatBox';

describe('ChatBox Component Tests', () => {
  test('renders chat box', () => {
    const store = configureStore(storeConfig);

    render(
      <Provider store={store}>
        <ChatBox />
      </Provider>
    );

    
  });
});
