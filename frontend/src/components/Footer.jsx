import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here, you can add the code to send the email address to your database
    console.log(email)
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
              <Button variant="primary" type="submit" block>
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
  )
}

export default Footer
