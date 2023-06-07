import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useLoginMutation } from '../features/user'
import queryString from 'query-string';

function LoginScreen({ location, history }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { redirect = '/' } = queryString.parse(location.search)
    const [loginUser, { isLoading, isSuccess, isError, error }] = useLoginMutation();

    useEffect(() => {
        if (isSuccess) {
            history.push(redirect)
        }
    }, [history, isSuccess, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        loginUser({ email, password })
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {isError && <Message variant='danger'>{error.data?.detail || "Login error"}</Message>}
            {isLoading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        autoComplete='current-email'
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        autoComplete='current-password'
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Sign In
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Register
                        </Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default LoginScreen
