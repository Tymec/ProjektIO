import { useEffect } from 'react';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Loader, Message } from '../components';
import { useDeliverOrderMutation, useGetOrderQuery } from '../features';
import { moneyFormat } from '../utils';

export default function OrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { user } = useSelector((state) => state.userState);
  const { data: order, isLoading, isError, error, refetch } = useGetOrderQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver, isSuccess: successDeliver }] =
    useDeliverOrderMutation();

  console.log(order)

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (successDeliver) {
      refetch();
    }
  }, [user, successDeliver, refetch]);

  const deliverHandler = () => {
    deliverOrder(orderId);
  };

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{error.data?.detail || 'Error'}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.shippingAddress?.fullName || user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress?.address && (
                  <span>
                    {order.shippingAddress.address.line || ''}
                    {order.shippingAddress.address?.line2
                      ? `, ${order.shippingAddress.address?.line2}`
                      : ''},
                    {'  '}
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}, {'  '}
                    {order.shippingAddress.country}{' '}
                    {order.shippingAddress?.state ? `, ${order.shippingAddress?.state}` : ''}
                  </span>
                )}
                {!order.shippingAddress?.address && (
                  <span>
                    No shipping information available at this moment.
                  </span>
                )}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {new Date(order.deliveredAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                {(order.paymentMethod && order.paymentMethod?.type === 'card') ? (
                  <span>
                    <strong>{order.paymentMethod.brand.toUpperCase()}</strong>
                    {'  '}
                    •••• {order.paymentMethod.last4}
                  </span>
                ) : (
                  <span>
                    <strong>{order.paymentMethod?.type?.toUpperCase()}</strong>
                  </span>
                )}
                {!order.paymentMethod && <span>No payment information available at this moment.</span>}
              </p>
              <p>
                {order.paymentMethod?.expMonth && order.paymentMethod?.expYear && (
                  <span>
                    <strong>EXP:</strong> {order.paymentMethod?.expMonth} / {order.paymentMethod?.expYear}
                  </span>
                )}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {new Date(order.paidAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.product.image} alt={item.product.name} fluid rounded />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                        </Col>

                        <Col md={4}>
                          {item.quantity} X {moneyFormat(item.product.price)} ={' '}
                          {moneyFormat(item.quantity * item.product.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>
                    {moneyFormat((order.totalPrice / 100))}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{moneyFormat(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>{moneyFormat(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>{moneyFormat(
                      (order.totalPrice / 100) + order.shippingPrice + order.taxPrice
                    )}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && <ListGroup.Item>{false && <Loader />}</ListGroup.Item>}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {user && user.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button type="button" className="btn btn-block" onClick={deliverHandler}>
                  Mark As Delivered
                </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
