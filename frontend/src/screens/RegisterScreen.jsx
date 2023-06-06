import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import {useRegisterMutation} from '../features/user'

function RegisterScreen({ location, history }) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const [register, {data: user, isLoading, isError, isSuccess, error}] = useRegisterMutation()

    useEffect(() => {
        if (user) {
            history.push(redirect)
        }
    }, [history, user, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            register({firstName, lastName, email, password})
        }
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {isError && <Message variant='danger'>{error}</Message>}
            {isLoading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='firstName'>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        required
                        type='firstName'
                        placeholder='Enter first name'
                        autoComplete='new-firstName'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='lastName'>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        required
                        type='lastName'
                        placeholder='Enter last name'
                        autoComplete='new-lastName'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Enter Email'
                        autoComplete='new-email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Enter Password'
                        autoComplete='new-password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Confirm Password'
                        autoComplete='new-password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Register
                </Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    Have an Account? <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Sign In
                        </Link>
                </Col>
            </Row>
        </FormContainer >
    )
}

export default RegisterScreen
