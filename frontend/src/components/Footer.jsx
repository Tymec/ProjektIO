import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useSubscribeNewsletterMutation } from '../features';

function Footer() {
  const [email, setEmail] = useState(''); // State to store the email value
  const [block, setBlock] = useState(false); // State to determine if the form is blocked
  const [placeholder, setPlaceholder] = useState('Newsletter'); // State to store the input field placeholder
  const [subscribe, { isSuccess, isError, error }] = useSubscribeNewsletterMutation(); // Mutation for subscribing to the newsletter

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribe(email); // Call the mutation to subscribe to the newsletter
    setEmail(''); // Clear the email field
  };

  useEffect(() => {
    if (isError) {
      setBlock(true); // Block the form
      setPlaceholder(error.data?.detail || 'Error'); // Set the placeholder to the error message or a default error message
      setTimeout(() => {
        setBlock(false); // Unblock the form after 3 seconds
        setPlaceholder('Newsletter'); // Reset the placeholder
        setEmail(''); // Clear the email field
      }, 3000);
    }

    if (isSuccess) {
      setBlock(true); // Block the form
      setPlaceholder('Subscribed'); // Set the placeholder to indicate successful subscription
    }
  }, [isSuccess, isError]);

  return (
    <footer>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="5">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label></Form.Label>
                <Form.Control
                  type="email"
                  placeholder={placeholder}
                  disabled={block}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant={isSuccess && block ? 'success' : isError && block ? 'danger' : 'primary'}
                type="submit"
                block
                disabled={block}
              >
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3">Copyright &copy; PromptWorld</Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
