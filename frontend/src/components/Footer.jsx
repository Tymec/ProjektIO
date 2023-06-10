import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useSubscribeNewsletterMutation } from '../features';

function Footer() {
  const [email, setEmail] = useState('');
  const [block, setBlock] = useState(false);
  const [placeholder, setPlaceholder] = useState('Newsletter');
  const [subscribe, { isSuccess, isError, error }] = useSubscribeNewsletterMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribe(email);
    setEmail('');
  };

  useEffect(() => {
    if (isError) {
      setBlock(true);
      setPlaceholder(error.data?.detail || 'Error');
      setTimeout(() => {
        setBlock(false);
        setPlaceholder('Newsletter');
        setEmail('');
      }, 3000);
    }

    if (isSuccess) {
      setBlock(true);
      setPlaceholder('Subscribed');
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
