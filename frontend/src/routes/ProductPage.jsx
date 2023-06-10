import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Loader, Message, Rating } from '../components';
import {
  addToCart,
  useCreateCheckoutSessionMutation,
  useCreateReviewMutation,
  useGetProductQuery,
  useHasUserBoughtProductQuery
} from '../features';
import { moneyFormat } from '../utils';

export default function ProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { productId } = useParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('order');

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(false);
  const [userBoughtProduct, setUserBoughtProduct] = useState(false);
  const [internalError, setInternalError] = useState(false);

  const { data: product, isLoading, isError, error, refetch } = useGetProductQuery(productId);
  const { user } = useSelector((state) => state.userState);
  const { data: userBought, isSuccess: userBoughtSuccess } =
    useHasUserBoughtProductQuery(productId);

  const [
    createReview,
    {
      isLoading: isReviewLoading,
      isError: isReviewError,
      isSuccess: isReviewSuccess,
      error: reviewError
    }
  ] = useCreateReviewMutation();

  const [createCheckoutSession, { data: checkoutData, isSuccess: isCheckoutSuccess }] =
    useCreateCheckoutSessionMutation();

  useEffect(() => {
    if (success) {
      navigate(`/order/${orderId}`);
    }
    if (isCheckoutSuccess) {
      if (!checkoutData.url) {
        console.error(checkoutData.detail);
        setInternalError(true);
      }
      window.location.href = checkoutData.url;
    }
    if (userBoughtSuccess) {
      setUserBoughtProduct(userBought.hasBought);
    }
  }, [user, isCheckoutSuccess, checkoutData, success, orderId, userBoughtSuccess]);

  const addToCartHandler = () => {
    dispatch(addToCart({ id: productId, qty, increment: true }));
    navigate(`/cart`);
  };

  const buyNowHandler = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    createCheckoutSession({
      cartItems: [{ id: productId, qty }],
      path: `product/${productId}`
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (comment.trim() === '') {
      return;
    }
    createReview({ product: productId, rating, comment, name: user.name });
  };

  useEffect(() => {
    if (isReviewSuccess) {
      refetch();
      setRating(0);
      setComment('');
      setTimeout(() => {
        setStatus(false);
      }, 3000);
    }

    setStatus(true);
  }, [isReviewSuccess]);

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError || internalError ? (
        <Message variant="danger">{error.data?.detail || 'Error'}</Message>
      ) : (
        <div>
          <Row>
            <Col md={5}>
              <Image
                src={product.image}
                alt={product.name}
                fluid
                style={{
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color={'#f8e825'}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: {moneyFormat(product.price)}</ListGroup.Item>

                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>{moneyFormat(product.price)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      disabled={product.countInStock === 0}
                      type="button"
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      onClick={buyNowHandler}
                      className="btn-block"
                      disabled={product.countInStock === 0}
                      type="button"
                    >
                      Buy now
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={5} className="py-2">
              <h4>Reviews</h4>
              {product?.reviews && product.reviews.length === 0 && (
                <Message variant="info">No Reviews</Message>
              )}

              <ListGroup variant="flush">
                {product?.reviews &&
                  product?.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} color="#f8e825" />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}

                <ListGroup.Item className="py-3">
                  <h4>Write a review</h4>

                  {status && isReviewLoading && <Loader />}
                  {status && isReviewSuccess && (
                    <Message variant="success">Review Submitted</Message>
                  )}
                  {status && isReviewError && (
                    <Message variant="danger">{reviewError.data?.detail || 'Error'}</Message>
                  )}

                  {user && userBoughtProduct && (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="5"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button disabled={isReviewLoading} type="submit" variant="primary">
                        Submit
                      </Button>
                    </Form>
                  )}
                  {user && !userBoughtProduct && (
                    <Message variant="info">You need to buy the product to write a review</Message>
                  )}
                  {!user && (
                    <Message variant="info">
                      Please <Link to="/login">login</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
