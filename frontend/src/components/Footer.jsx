import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useRegisterNewsletterMutation } from '../features'

function Footer() {
  const [email, setEmail] = useState('')
  const [registerNewsletter, { isSuccess, isError }] = useRegisterNewsletterMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    registerNewsletter(email)
    setEmail('')
  }

  return (
    <footer>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="5">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label></Form.Label>
                <Form.Control type="email" placeholder="Newsletter" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              <Button variant={isSuccess ? 'success' : isError ? 'danger' : 'primary'} type="submit" block disabled={isSuccess || isError}>
                {isSuccess ? 'Subscribed' : isError ? 'Error' : 'Subscribe'}
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3">Copyright &copy; PromptWorld</Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
