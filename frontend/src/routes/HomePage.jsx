import React from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Loader, Message, Paginate, Product, ProductCarousel } from '../components';
import { useListProductsQuery } from '../features';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;
  const orderBy = searchParams.get('orderBy') || 'createdAt';
  const { data, isLoading, isFetching, isError, error } = useListProductsQuery({
    keyword: search,
    page,
    orderBy
  });

  const sortOptions = [
    { name: 'Created At', value: 'createdAt' },
    { name: 'Price', value: 'price' },
    { name: 'Rating', value: 'rating' },
    { name: 'Name', value: 'name' },
    { name: 'Number of Reviews', value: 'numReviews' },
    { name: 'Count in Stock', value: 'countInStock' }
  ];

  const handleSortChange = (value) => {
    navigate({
      pathname: '/',
      search: `?search=${search}&page=${page}&orderBy=${value}`
    });
  };

  return (
    <div>
      {!search && <ProductCarousel />}

      <h1>Our Prompts</h1>

      <Dropdown onSelect={handleSortChange}>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Sort By
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {sortOptions.map((option) => (
            <Dropdown.Item href="#" eventKey={option.value} key={option.value}>
              {option.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {isLoading || isFetching ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error.data?.detail || 'Error'}</Message>
      ) : (
        <div>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate page={data.page} pages={data.pages} path="/" args={{ search }} />
        </div>
      )}
    </div>
  );
}
