import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { FormContainer, Loader, Message } from '../components';
import { useLoginMutation } from '../features';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = searchParams.get('redirect') || '/';
  const [loginUser, { data: loginData, isLoading, isSuccess, isError, error }] = useLoginMutation();

  console.log(loginData)

  useEffect(() => {
    // FIX: if user is invalid, redirect to login page
    if (isSuccess) {
      navigate(redirect);
    }
  }, [isSuccess, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {isError && <Message variant="danger">{error.data?.detail || 'Login error'}</Message>}
      {isLoading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            autoComplete="current-email"
            onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}
