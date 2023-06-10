import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SearchBox() {
  let navigate = useNavigate();

  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
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

      <Button data-testid="search-box-submit" type="submit" variant="outline-success" className="p-2" disabled={!keyword}>
        Submit
      </Button>
    </Form>
  );
}

export default SearchBox;
