import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

import { useSubscribeNewsletterMutation } from '../features'

function Footer() {
  const [email, setEmail] = useState('')
  const [blockButton, setBlockButton] = useState(false)
  const [status, setStatus] = useState('Subscribe')
  const [subscribe, { isSuccess, isError, error }] = useSubscribeNewsletterMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    subscribe(email)
    setEmail('')
  }

  useEffect(() => {
    if (isError) {
      setBlockButton(true)
      setStatus(error.data?.detail || "Error")
      setTimeout(() => {
        setBlockButton(false)
        setStatus('Subscribe')
      }, 3000)
    }

    if (isSuccess) {
      setBlockButton(true)
      setStatus('Subscribed')
    }
  }, [isSuccess, isError])

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
              <Button variant={status === "Subscribed" ? 'success' : status === "Subscribe" ? 'primary' : 'danger'} type="submit" block disabled={blockButton}>{status}
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
