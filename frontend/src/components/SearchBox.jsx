import { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useGenerateProductMutation } from '../features';

export default function SearchBox({ user = null }) {
  let navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [
    generateProduct,
    { isLoading: isGenerating, isError: isGenerationError, error: generationError }
  ] = useGenerateProductMutation();

  useEffect(() => {
    if (isGenerationError) {
      console.error(generationError);
    }
  }, [isGenerationError]);

  const onClickGenerate = () => {
    if (keyword.trim()) {
      generateProduct(keyword);
      setKeyword('');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${keyword}&page=1`);
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        data-testid="search-box-input"
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button
        data-testid="search-box-submit"
        type="submit"
        variant="outline-success"
        className="p-2"
        disabled={!keyword}
      >
        Submit
      </Button>
      {user && user.isAdmin && (
        <Button
          data-testid="generate-button"
          variant="outline-warning"
          className={'p-2 ml-2 px-3' + (isGenerating ? 'lds-ripple' : '')}
          onClick={onClickGenerate}
          disabled={isGenerating || isGenerationError}
        >
          {isGenerationError ? (
            <span>⚠</span>
          ) : isGenerating ? (
            <Spinner animation="border" role="status" size="sm">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <span>+</span>
          )}
        </Button>
      )}
    </Form>
  );
}
