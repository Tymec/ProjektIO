import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { Loader, Message, Paginate, Product, ProductCarousel } from '../components';
import { useListProductsQuery } from '../features';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;
  const { data, isLoading, isFetching, isError, error } = useListProductsQuery({
    keyword: search,
    page,
    orderBy: 'createdAt'
  });

  return (
    <div>
      {!search && <ProductCarousel />}

      <h1>Latest Products</h1>
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
