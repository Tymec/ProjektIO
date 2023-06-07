import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../features/cart'
import { useListProductsQuery } from '../features/product'
import Paginate from '../components/Paginate'
import queryString from 'query-string'
import Loader from '../components/Loader'

function CartScreen({ history }) {
    const dispatch = useDispatch()
    const {page = 1} = queryString.parse(history.location.search)

    const cart = useSelector(state => state.cartState)
    const cardIds = cart.items.map(item => item.id)
    const { data, isLoading, isFetching, isSuccess, isError, error } = useListProductsQuery({ ids: cardIds, page })

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = async () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cart.items.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Message>
                ) : (
                    (isLoading || isFetching) ? <Loader />
                        : isError ? <Message variant='danger'>{error.data?.dtail || "Error"}</Message>
                            :
                        <ListGroup variant='flush'>
                            {data.products.map(product => (
                                <ListGroup.Item key={product._id}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={product.image} alt={product.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/product/${product._id}`}>{product.name}</Link>
                                        </Col>

                                        <Col md={2}>
                                            ${product.price}
                                        </Col>

                                        <Col md={3}>
                                            <Form.Control
                                                as="select"
                                                value={cart.items.find(item => item.id === product._id).qty}
                                                onChange={(e) => dispatch(addToCart({id: product._id, qty: Number(e.target.value)}))}
                                            >
                                                {
                                                    [...Array(product.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))
                                                }

                                            </Form.Control>
                                        </Col>

                                        <Col md={1}>
                                            <Button
                                                type='button'
                                                variant='light'
                                                onClick={() => removeFromCartHandler(product._id)}
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                            <Paginate page={data.page} pages={data.pages} path="/cart?" />
                        </ListGroup>

                    )}
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({
                                cart.items.reduce((acc, item) => acc + item.qty, 0)
                                }) items</h2>
                            ${isSuccess && cart.items.reduce((acc, item) => {
                                const product = data.products.find(product => product._id === item.id)
                                try {
                                    return acc + Number(product.price) * item.qty
                                } catch (e) {
                                    return acc
                                }
                            }, 0).toFixed(2)}
                            {!isSuccess && '0.00'}
                        </ListGroup.Item>
                    </ListGroup>

                    <ListGroup.Item>
                        <Button
                            type='button'
                            className='btn-block'
                            disabled={cart.items.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </ListGroup.Item>


                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
