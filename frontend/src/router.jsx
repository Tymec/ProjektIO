import { createBrowserRouter } from 'react-router-dom';

import {
  CartPage,
  ErrorPage,
  HomePage,
  LoginPage,
  MaintenancePage,
  NewsletterUnsubscribePage,
  OrderPage,
  ProductPage,
  ProfilePage,
  RegisterPage,
  Root
} from './routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'order/:orderId',
        element: <OrderPage />
      },
      {
        path: 'product/:productId',
        element: <ProductPage />
      },
      {
        path: 'cart/',
        element: <CartPage />
      },
      {
        path: 'newsletter/unsubscribe/:id',
        element: <NewsletterUnsubscribePage />
      }
    ]
  },
  {
    path: '/maintenance',
    element: <MaintenancePage />,
    errorElement: <ErrorPage />
  }
]);

export default router;
