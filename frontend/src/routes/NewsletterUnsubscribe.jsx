// Page to unsubscribe from the newsletter

import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import { Loader, Message } from "../components";
import { useGetSubscriberQuery, useUnsubscribeNewsletterMutation } from "../features";

export default function NewsletterUnsubscribePage() {
  const { id } = useParams();

  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const [unsubscribe, { isLoading: isUnsubscribeLoading, isSuccess: isUnsubscribeSuccess, isError: isUnsubscribeError, error: unsubscribeError }] = useUnsubscribeNewsletterMutation();
  const { data: subscriber, isLoading: isGetSubscriberLoading, isSuccess: isGetSubscriberSuccess, isError: isGetSubscriberError, error: getSubscriberError } = useGetSubscriberQuery(id === 'me' ? skipToken : id);

  useEffect(() => {
    if (isUnsubscribeSuccess) {
      setSubscribed(false);
    }
    if (isGetSubscriberSuccess) {
      setEmail(subscriber.data.email);
      setSubscribed(subscriber.data.active);
    }
  }, [isUnsubscribeSuccess, isGetSubscriberSuccess]);

  const unsubscribeHandler = () => unsubscribe(email);
  const handleSubmit = (e) => {
    e.preventDefault();
    unsubscribe(email);
  };

  return (
    <div>
      <h1>Unsubscribe from Newsletter</h1>
      {(isGetSubscriberLoading || isUnsubscribeLoading) && <Loader />}
      {isGetSubscriberError ? (
        <Message variant="danger">{getSubscriberError?.data?.detail || 'Error getting subscriber'}</Message>
      ) : isUnsubscribeError ? (
        <Message variant="danger">{unsubscribeError?.data?.detail || 'Error unsubscribing'}</Message>
      ) : isUnsubscribeSuccess ? (
        <Message variant="success">
          You have been unsubscribed from our newsletter. You will no longer
          receive emails from us.
        </Message>
      ) : null}

      {(id === 'me' && !subscribed) ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUnsubscribe">
            <Form.Label></Form.Label>
            <Form.Control type="email" placeholder="Newsletter" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Button variant='primary' type="submit" block>Unsubscribe</Button>
        </Form>
      ) : subscribed ? (
        <p>
          You are currently subscribed to our newsletter. If you would like to
          unsubscribe, please <Link onClick={unsubscribeHandler}>click here</Link>.
        </p>
      ) : (
        <p>
          You are not subscribed to our newsletter.
        </p>
      )}
    </div>
  );
}
