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
  const [
    deliverOrder,
    { isLoading: loadingDeliver, isSuccess: successDeliver, isFetching: fetchingDeliver }
  ] = useDeliverOrderMutation();

  console.log(successDeliver, loadingDeliver, fetchingDeliver);

  console.log(order);

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
                <strong>Name: </strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {'  '}
                {order.shippingAddress.postalCode},{'  '}
                {order.shippingAddress.country}
                {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}
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
                <strong>Method: </strong>
                {order.paymentMethod}
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
                    {moneyFormat(
                      order.orderItems.reduce(
                        (acc, item) => acc + item.quantity * item.product.price,
                        0
                      )
                    )}
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
                  <Col>{moneyFormat(order.totalPrice)}</Col>
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
