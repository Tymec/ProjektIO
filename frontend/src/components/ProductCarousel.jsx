import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useListProductsQuery } from '../features';
import Loader from './Loader';
import Message from './Message';

function ProductCarousel() {
  const { data, isLoading, isError, error } = useListProductsQuery({});

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{error.data?.detail || 'Error'}</Message>
  ) : (
    <Carousel
      pause="hover"
      className="bg-primary"
      style={{
        opacity: '0.95',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      {data.products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel.caption">
              <h4>
                {product.name} (${product.price})
              </h4>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
