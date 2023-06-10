import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Loader, Product } from '../components';
import { resetChatbotContextId, setChatbotContextId, useChatMutation, useListProductsQuery } from '../features';

const ChatBox = () => {
  const dispatch = useDispatch();

  const { chatbotContextId } = useSelector((state) => state.extraState);

  // TODO: Implement page-context

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: 'Welcome to the chatbot, I will help you find the best product for you', sender: 'Bot' }
  ]);
  const [sendMessage, { data: chatData, isSuccess, isError, isLoading, error }] = useChatMutation();
  const chatBoxRef = useRef(null);

  const [productIds, setProductIds] = useState(skipToken);
  const { data, isSuccess: isProductsSuccess } = useListProductsQuery(productIds);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory((prevChatHistory) => [...prevChatHistory, { text: message, sender: 'User' }]);
      sendMessage({ userMessage: message, contextId: chatbotContextId || null });

      setMessage('');
    }
  };

  const resetContext = () => {
    dispatch(resetChatbotContextId());
    setChatHistory([
      { text: 'Welcome to the chatbot, I will help you find the best product for you', sender: 'Bot' }
    ]);
    setMessage('');
  };

  useEffect(() => {
    if (isError) {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { text: error.data?.detail || 'Error', sender: 'System' }
      ]);
    }

    if (isSuccess) {
      let botMessage = chatData.message;
      const re = /\b\d{18}\b/g;

      if (re.test(botMessage)) {
        const match = botMessage.match(re);
        botMessage = botMessage.replace(re, '');

        setProductIds({ ids: match });
      }

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { text: botMessage, sender: 'Bot' }
      ]);
      if (!chatbotContextId) {
        dispatch(setChatbotContextId(chatData.contextId));
      }
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isProductsSuccess) {
      for (const product of data.products) {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { text: product, sender: 'Product' }
        ]);
      }
    }
  }, [isProductsSuccess]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && message.trim()) {
        event.preventDefault();
        handleFormSubmit(event);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [message, handleFormSubmit]);

  return (
    <>
      {isOpen && (
        <Card
          className="shadow"
          style={{
            width: '300px',
            position: 'fixed',
            right: '23px',
            bottom: '20px',
            zIndex: 9999,
            borderRadius: '5px'
          }}
          ref={chatBoxRef}
        >
          <Card.Header>
            <Button
              variant="link"
              size="sm"
              className="position-absolute top-0 start-0"
              style={{ left: 0, top: 0, padding: '0.3rem' }}
              onClick={toggleChatBox}
            >
              X
            </Button>
          </Card.Header>
          <Card.Body style={{ maxHeight: '400px', overflowY: 'scroll' }}>
            {chatHistory.map((msg, idx) => {
              if (msg.sender === 'Product') {
                const product = msg.text;
                return <Product key={idx} product={product} />;
              }
              return (
                <p key={idx}>
                  <strong>{msg.sender}: </strong> {msg.text}
                </p>
              );
            })}
          </Card.Body>
          <Form onSubmit={handleFormSubmit} className="d-flex flex-column">
            {isLoading && <Loader />}
            {!isLoading && (
              <Form.Group className="m-2">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={handleInputChange}
                  style={{ resize: 'none' }}
                />
              </Form.Group>
            )}
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" className="m-2" style={{ width: '300px' }}>
                Send
              </Button>
              <Button variant="primary" className="m-2" style={{ width: '100px' }} onClick={resetContext}>
                Reset
              </Button>
            </div>
          </Form>
        </Card>
      )}
      <Button
        variant="primary"
        onClick={toggleChatBox}
        className={`mt-3 ${isOpen ? 'd-none' : ''}`}
        style={{
          transform: 'rotate(-90deg)',
          position: 'fixed',
          right: '23px',
          top: '30%',
          transformOrigin: 'right center',
          zIndex: 9999
        }}
      >
        Open chat
      </Button>
    </>
  );
};

export default ChatBox;
