import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Loader, Product } from '../components';
import {
  resetChatbotContextId,
  setChatbotContextId,
  useChatMutation,
  useListProductsQuery
} from '../features';

const ChatBox = () => {
  const dispatch = useDispatch();

  const { chatbotContextId: contextId } = useSelector((state) => state.extraState);

  const [isOpen, setIsOpen] = useState(false); // State to determine if the chat box is open
  const [message, setMessage] = useState(''); // State to store the current user message
  const [chatHistory, setChatHistory] = useState([
    // State to store the chat history
    {
      text: contextId
        ? 'Welcome back to the chatbot, I will help you find the best product for you'
        : 'Welcome to the chatbot, I will help you find the best product for you',
      sender: 'Bot'
    }
  ]);
  const [sendMessage, { data: chatData, isSuccess, isError, isLoading, error }] = useChatMutation(); // Mutation for sending messages in the chat
  const chatBoxRef = useRef(null); // Reference to the chat card component

  const [productIds, setProductIds] = useState(skipToken); // State to store product IDs
  const { data, isSuccess: isProductsSuccess } = useListProductsQuery(productIds); // Query to fetch a list of products

  const toggleChatBox = () => {
    setIsOpen(!isOpen); // Toggle the isOpen state between true and false to open/close the chat
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value); // Update the message state based on the user input in the text field
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory((prevChatHistory) => [...prevChatHistory, { text: message, sender: 'User' }]);
      sendMessage({ userMessage: message, contextId: contextId || null });

      setMessage(''); // Clear the text field after sending the message
    }
  };

  const resetContext = () => {
    dispatch(resetChatbotContextId());
    setChatHistory([
      {
        text: 'Welcome to the chatbot, I will help you find the best product for you',
        sender: 'Bot'
      }
    ]);
    setMessage('');
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { text: error.data?.detail || 'Error', sender: 'System' }
      ]); // Add the error message to the chat history in case of an error
      return;
    }

    if (isSuccess) {
      let botMessage = chatData.message;

      if (chatData.finished) {
        botMessage = 'My time has come to an end. Goodbye!';
        resetContext();
        return;
      }

      if (chatData.productIds) {
        setProductIds({ ids: chatData.productIds });
      }

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { text: botMessage, sender: 'Bot' }
      ]); // Add the bot message to the chat history

      if (!contextId) {
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
        ]); // Add each product to the chat history
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
              <Button
                variant="primary"
                className="m-2"
                style={{ width: '100px' }}
                onClick={resetContext}
              >
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
