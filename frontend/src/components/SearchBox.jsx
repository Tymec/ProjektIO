import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SearchBox() {
  let navigate = useNavigate();

  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/?search=${keyword}&page=1`); // Navigate to the search results page with the provided keyword
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        data-testid="search-box-input"
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)} // Update the keyword state on input change
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>

      <Button
        data-testid="search-box-submit"
        type="submit"
        variant="outline-success"
        className="p-2"
        disabled={!keyword} // Disable the button if there is no keyword
      >
        Submit
      </Button>
    </Form>
  );
}

export default SearchBox;
