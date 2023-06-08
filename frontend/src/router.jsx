import { createBrowserRouter } from 'react-router-dom';
import { Root, ErrorPage, MaintenancePage, CartPage, HomePage, LoginPage, OrderPage, PlaceOrderPage, ProductPage, ProfilePage, RegisterPage } from './routes';

const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'home',
          element: <HomePage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
            path: 'register',
            element: <RegisterPage />,
        },
        {
            path: 'profile',
            element: <ProfilePage />,
        },
        {
            path: 'placeorder',
            element: <PlaceOrderPage />,
        },
        {
            path: 'order/:orderId',
            element: <OrderPage />,
        },
            {
            path: 'product/:productId',
            element: <ProductPage />,
        },
        {
            path: 'cart/',
            element: <CartPage />,
        },
      ],
    },
    {
      path: '/maintenance',
      element: <MaintenancePage />,
      errorElement: <ErrorPage />,
    },
  ]);

export default router
