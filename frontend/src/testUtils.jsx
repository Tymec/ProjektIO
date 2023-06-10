import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import routesConfig from './router';
import storeConfig from './store';

export const RouterProviderWrapper = ({ route }) => {
  const router = createMemoryRouter(routesConfig, {
    initialEntries: [route]
  });

  return <RouterProvider router={router} />;
};

export const StoreProviderWrapper = ({ children }) => {
  const store = configureStore(storeConfig);

  return <Provider store={store}>{children}</Provider>;
};

export const FullProviderWrapper = ({ route }) => {
  return (
    <StoreProviderWrapper>
      <RouterProviderWrapper route={route} />
    </StoreProviderWrapper>
  );
};
